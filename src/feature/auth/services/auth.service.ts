import { prisma } from "@/db/prisma";
import { logger } from "@/lib/logger";
import { auth } from "@/server/auth";
import { toSuccessResponse } from "@/server/orpc/utils";
import { BadRequestError, UnauthorizedError } from "@/utils/errors";
import type { SchoolService } from "../../school/services/school.service";
import type {
	ChangePasswordInput,
	TLoginSchema,
} from "../contract/auth.schema";
import type { AuthRepository } from "../repo/auth.repo";

/**
 * AuthService handles the core authentication logic for the SaaS platform.
 * It integrates Better-Auth for identity management and handles specialized
 * flows like school registration/onboarding.
 */
export class AuthService {
	constructor(
		private repo: AuthRepository,
		private schoolService: SchoolService,
	) {}

	/**
	 * Authenticates a user using email and password.
	 * @param input - The login credentials (email and password).
	 * @returns The session object from Better-Auth.
	 * @throws {UnauthorizedError} if login fails.
	 */
	async login(input: TLoginSchema) {
		logger.info({ email: input.email }, "Login attempt");
		const result = await auth.api.signInEmail({
			body: {
				email: input.email,
				password: input.password,
			},
		});
		logger.info(
			{ email: input.email, userId: result?.user?.id },
			"Login successful",
		);
		return toSuccessResponse(result, "Successfully signed in");
	}

	/**
	 * Step 1: Account Creation (The Identity)
	 * Registers the user and triggers email verification.
	 */
	async signUp(input: { email: string; name: string; password: string }) {
		logger.info({ email: input.email }, "User sign-up attempt");

		const existingUser = await this.repo.isUserExisting(input.email);
		if (existingUser) {
			throw new BadRequestError("User already exists");
		}

		const resp = await auth.api.signUpEmail({
			body: {
				email: input.email,
				name: input.name,
				password: input.password,
				role: "user",
			},
		});

		if (!resp || !resp.user) {
			throw new BadRequestError("Account creation failed");
		}

		logger.info(
			{ userId: resp.user.id },
			"Account created, verification pending",
		);
		return toSuccessResponse(resp.user, "Account created successfully");
	}

	/**
	 * Step 2: resetPassword (The User)
	 * Resets the password for the verified user.
	 */
	async resetPassword(token: string, newPassword: string) {
		if (!token) {
			throw new BadRequestError("Token is required");
		}

		logger.info({ token, newPassword }, "Resetting password");

		await auth.api.resetPassword({
			body: {
				newPassword,
				token,
			},
		});

		logger.info("Password reset successfully");

		return toSuccessResponse("", "Password reset successfully");
	}

	/**
	 * Step 2: Tenant Profile (The School)
	 * Creates the school profile and links the verified user as Owner.
	 */

	async changePassword(input: ChangePasswordInput) {
		await auth.api.changePassword({
			body: input,
		});

		logger.info("Password changed successfully");

		return toSuccessResponse("", "Password changed successfully");
	}

	async logout(headers: Headers) {
		await auth.api.signOut({
			headers,
		});

		logger.info("User logged out successfully");

		return toSuccessResponse("", "User logged out successfully");
	}

	async createSchoolProfile(
		userId: string,
		input: {
			schoolName: string;
			logo?: string;
			address?: string;
			website?: string;
		},
	) {
		logger.info(
			{ userId, schoolName: input.schoolName },
			"Creating school profile",
		);

		// 1. Generate slug
		const slug = await this.generateSlug(input.schoolName);

		// 2. Create school
		const school = await this.schoolService.create({
			name: input.schoolName,
			slug,
			logo: input.logo,
			address: input.address,
			website: input.website,
		});

		// 3. Link user as schoolAdmin (Owner)
		await this.repo.linkUserToSchool(userId, school.data.id, "schoolAdmin");

		logger.info(
			{ schoolId: school.data.id, userId },
			"School profile created and linked",
		);

		return toSuccessResponse(
			school.data,
			"School profile created successfully",
		);
	}

	private async generateSlug(name: string): Promise<string> {
		let slug = name
			.toLowerCase()
			.replace(/ /g, "-")
			.replace(/[^\w-]+/g, "");

		// Ensure uniqueness (basic check)
		let existing = await this.schoolService.getBySlug(slug).catch(() => null);
		let counter = 1;
		while (existing) {
			const newSlug = `${slug}-${counter}`;
			existing = await this.schoolService.getBySlug(newSlug).catch(() => null);
			if (!existing) {
				slug = newSlug;
				break;
			}
			counter++;
		}
		return slug;
	}

	/**
	 * Retrieves the current authenticated session.
	 * @param headers - Request headers containing session cookies/tokens.
	 * @returns The current session object.
	 * @throws {UnauthorizedError} if no session is active.
	 */
	async me(headers: Headers) {
		const session = await auth.api.getSession({
			headers,
		});

		if (!session) {
			logger.warn("Session check failed: no active session");
			throw new UnauthorizedError("No active session");
		}

		logger.debug({ userId: session.user.id }, "Session validated");
		return toSuccessResponse(session);
	}
}

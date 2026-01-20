import type { UserRole } from "prisma/generated/enums";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { auth } from "@/server/auth";
import { BadRequestError, UnauthorizedError } from "@/utils/errors";
import { SchoolService } from "../../school/services/school.service";
import { AuthRepository } from "../repo/auth.repo";
import { AuthService } from "./auth.service";

describe("AuthService", () => {
	let service: AuthService;
	let repo: AuthRepository;
	let schoolService: SchoolService;

	beforeEach(() => {
		repo = new AuthRepository();
		schoolService = new SchoolService({} as any); // Mocked below
		service = new AuthService(repo, schoolService);
		vi.clearAllMocks();
	});

	describe("login", () => {
		it("should login successfully", async () => {
			const input = { email: "test@example.com", password: "password123" };
			const mockSession = {
				user: { id: "1", email: input.email },
				session: { id: "s1" },
			};

			vi.mocked(auth.api.signInEmail).mockResolvedValue(mockSession as any);

			const result = await service.login(input);

			expect(auth.api.signInEmail).toHaveBeenCalledWith({
				body: {
					email: input.email,
					password: input.password,
				},
			});
			expect(result).toEqual({
				success: true,
				message: "Successfully signed in",
				data: mockSession,
			});
		});

		it("should throw UnauthorizedError on login failure", async () => {
			const input = { email: "wrong@example.com", password: "wrong" };
			vi.mocked(auth.api.signInEmail).mockRejectedValue(
				new Error("Invalid credentials"),
			);

			await expect(service.login(input)).rejects.toThrow(UnauthorizedError);
		});
	});

	describe("signUp", () => {
		it("should create an account successfully", async () => {
			const input = {
				email: "new@test.com",
				name: "New User",
				password: "password123",
			};
			const mockUser = {
				id: "user-1",
				createdAt: new Date(),
				updatedAt: new Date(),
				email: input.email,
				emailVerified: false,
				name: input.name,
				role: "user" as UserRole,
			};

			vi.mocked(auth.api.signUpEmail).mockResolvedValue({
				user: mockUser,
				token: "token",
			});

			const result = await service.signUp(input);

			expect(auth.api.signUpEmail).toHaveBeenCalledWith({
				body: {
					email: input.email,
					name: input.name,
					password: input.password,
					role: "user",
				},
			});
			expect(result).toEqual({
				success: true,
				message: "Account created successfully",
				data: mockUser,
			});
		});

		it("should throw BadRequestError if sign up fails", async () => {
			vi.mocked(auth.api.signUpEmail).mockResolvedValue(null as any);
			await expect(
				service.signUp({ email: "a@b.com", name: "a", password: "p" }),
			).rejects.toThrow(BadRequestError);
		});
	});

	describe("createSchoolProfile", () => {
		it("should create profile and link owner successfully", async () => {
			const userId = "user-1";
			const input = { schoolName: "Test School", logo: "logo.png" };
			const mockSchool = {
				id: "school-1",
				name: input.schoolName,
				slug: "test-school",
			};

			vi.spyOn(schoolService, "getBySlug").mockRejectedValue(
				new Error("Not found"),
			);
			vi.spyOn(schoolService, "create").mockResolvedValue({
				success: true,
				data: mockSchool,
			} as any);
			vi.spyOn(repo, "linkUserToSchool").mockResolvedValue({} as any);

			const result = await service.createSchoolProfile(userId, input);

			expect(schoolService.create).toHaveBeenCalledWith(
				expect.objectContaining({
					name: input.schoolName,
					logo: input.logo,
				}),
			);
			expect(repo.linkUserToSchool).toHaveBeenCalledWith(
				userId,
				mockSchool.id,
				"schoolAdmin",
			);
			expect(result.success).toBe(true);
			expect(result.data).toEqual(mockSchool);
		});

		it("should handle slug collisions during generation", async () => {
			const userId = "user-1";
			const input = { schoolName: "Test School" };
			const mockSchool = {
				id: "school-2",
				name: input.schoolName,
				slug: "test-school-1",
			};

			// First attempt: slug exists
			vi.spyOn(schoolService, "getBySlug")
				.mockResolvedValueOnce({
					id: "school-1",
					name: "Other",
					slug: "test-school",
				} as any)
				.mockRejectedValueOnce(new Error("Not found")); // Second check: available

			vi.spyOn(schoolService, "create").mockResolvedValue({
				success: true,
				data: mockSchool,
			} as any);
			vi.spyOn(repo, "linkUserToSchool").mockResolvedValue({} as any);

			await service.createSchoolProfile(userId, input);

			expect(schoolService.create).toHaveBeenCalledWith(
				expect.objectContaining({
					slug: "test-school-1",
				}),
			);
		});
	});

	describe("me", () => {
		it("should return session if authenticated", async () => {
			const headers = new Headers();
			const mockSession = {
				user: { id: "1", email: "test@example.com" },
				session: { id: "s1" },
			};
			vi.mocked(auth.api.getSession).mockResolvedValue(mockSession as any);

			const result = await service.me(headers);

			expect(auth.api.getSession).toHaveBeenCalledWith({ headers });
			expect(result).toEqual({
				success: true,
				message: "Action completed successfully",
				data: mockSession,
			});
		});

		it("should throw UnauthorizedError if not authenticated", async () => {
			const headers = new Headers();
			vi.mocked(auth.api.getSession).mockResolvedValue(null);

			await expect(service.me(headers)).rejects.toThrow(UnauthorizedError);
		});
	});
});

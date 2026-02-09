import { implement } from "@orpc/server";
import type { Context } from "../../../server/orpc/context";
import { requiredAuthMiddleware } from "../../../server/orpc/middleware";
import { createRateLimitMiddleware } from "../../../server/orpc/rate-limit";
import { SchoolRepository } from "../../school/repo/school.repo";
import { SchoolService } from "../../school/services/school.service";
import { authContract } from "../contract/auth.contract";
import { AuthRepository } from "../repo/auth.repo";
import { AuthService } from "../services/auth.service";

const authRepo = new AuthRepository();
const schoolRepo = new SchoolRepository();
const schoolService = new SchoolService(schoolRepo);
const authService = new AuthService(authRepo, schoolService);
const os = implement(authContract).$context<Context>();

const loginRateLimit = createRateLimitMiddleware("login");

/**
 * Auth Router implementation.
 * Connects contracts to service handlers for authentication flows.
 */
export const authRouter = os.router({
	/**
	 * Login user with email/password.
	 */
	login: os.login.use(loginRateLimit).handler(async ({ input }) => {
		return await authService.login(input);
	}),
	signUp: os.signUp.handler(async ({ input }) => {
		return await authService.signUp(input);
	}),
	createSchoolProfile: os.createSchoolProfile
		.use(requiredAuthMiddleware)
		.handler(async ({ input, context }) => {
			return await authService.createSchoolProfile(context.user.id, input);
		}),
	me: os.me.handler(async ({ context }) => {
		return await authService.me(context.headers);
	}),
	resetPassword: os.resetPassword.handler(async ({ input }) => {
		return await authService.resetPassword(input.token, input.newPassword);
	}),
	changePassword: os.changePassword.handler(async ({ input }) => {
		return await authService.changePassword(input);
	}),
	logout: os.logout.handler(async ({ context }) => {
		return await authService.logout(context.headers);
	}),
});

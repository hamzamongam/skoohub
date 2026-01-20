import { implement } from "@orpc/server";
import type { Context } from "../../../server/orpc/context";
import { requiredAuthMiddleware } from "../../../server/orpc/middleware";
import { schoolContract } from "../contract/school.contract";
import { SchoolRepository } from "../repo/school.repo";
import { SchoolService } from "../services/school.service";

const schoolRepo = new SchoolRepository();
const schoolService = new SchoolService(schoolRepo);

const os = implement(schoolContract).$context<Context>();

/**
 * School Router implementation.
 * Exposes procedures for creating and retrieving school data.
 */
export const schoolRouter = os.router({
	create: os.create.use(requiredAuthMiddleware).handler(async ({ input }) => {
		return await schoolService.create(input);
	}),
	get: os.get.use(requiredAuthMiddleware).handler(async ({ input }) => {
		return await schoolService.getById(input.id);
	}),
	getCurrent: os.getCurrent
		.use(requiredAuthMiddleware)
		.handler(async ({ context }) => {
			// biome-ignore lint/style/noNonNullAssertion: <explanation>
			return await schoolService.getById(context.schoolId!);
		}),
});

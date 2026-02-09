import { implement, ORPCError } from "@orpc/server";
import type { Context } from "../../../server/orpc/context";
import { requiredAuthMiddleware } from "../../../server/orpc/middleware";
import { studentContract } from "../contract/student.contract";
import { StudentRepository } from "../repo/student.repo";
import { StudentService } from "../services/student.service";

const studentRepo = new StudentRepository();
const studentService = new StudentService(studentRepo);

const os = implement(studentContract).$context<Context>();

/**
 * Student Router implementation.
 * Exposes procedures for managing student records.
 */
export const studentRouter = os.router({
	create: os.create
		.use(requiredAuthMiddleware)
		.handler(async ({ input, context }) => {
			if (!context.schoolId) {
				throw new ORPCError("UNAUTHORIZED", {
					message: "School ID is required",
				});
			}
			return await studentService.create(input, context.schoolId);
		}),
	list: os.list
		.use(requiredAuthMiddleware)
		.handler(async ({ input, context }) => {
			return await studentService.list(context.schoolId!);
		}),
	delete: os.delete.use(requiredAuthMiddleware).handler(async ({ input }) => {
		return await studentService.delete(input.id);
	}),
	get: os.get.use(requiredAuthMiddleware).handler(async ({ input }) => {
		return await studentService.get(input.id);
	}),
	update: os.update.use(requiredAuthMiddleware).handler(async ({ input }) => {
		const { id, ...data } = input;
		return await studentService.update(id, data);
	}),
});

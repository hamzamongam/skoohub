import { implement } from "@orpc/server";
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
	create: os.create.use(requiredAuthMiddleware).handler(async ({ input }) => {
		return await studentService.create(input);
	}),
	list: os.list.use(requiredAuthMiddleware).handler(async ({ input }) => {
		return await studentService.list(input.schoolId);
	}),
	delete: os.delete.use(requiredAuthMiddleware).handler(async ({ input }) => {
		return await studentService.delete(input.id);
	}),
});

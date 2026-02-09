import { implement } from "@orpc/server";
import type { Context } from "@/server/orpc/context";
import { requiredAuthMiddleware } from "@/server/orpc/middleware";
import { toSuccessResponse } from "@/server/orpc/utils";
import { classContract } from "../contract/class.contract";
import { ClassService } from "../services/class.service";

const service = new ClassService();

const os = implement(classContract).$context<Context>();

export const classRouter = os.router({
	create: os.create
		.use(requiredAuthMiddleware)
		.handler(async ({ input, context }) => {
			const schoolId = context.user.schoolId;
			if (!schoolId) throw new Error("School not found");
			const result = await service.create(input, schoolId);
			return toSuccessResponse(result, "Class created successfully");
		}),

	update: os.update.use(requiredAuthMiddleware).handler(async ({ input }) => {
		const { id, ...data } = input;
		const result = await service.update(id, data);
		return toSuccessResponse(result);
	}),

	delete: os.delete.use(requiredAuthMiddleware).handler(async ({ input }) => {
		const result = await service.delete(input.id);
		return toSuccessResponse(result);
	}),

	list: os.list.use(requiredAuthMiddleware).handler(async ({ context }) => {
		const schoolId = context.user.schoolId;
		if (!schoolId) throw new Error("School not found");
		const result = await service.list(schoolId);
		return toSuccessResponse(result);
	}),

	get: os.get.use(requiredAuthMiddleware).handler(async ({ input }) => {
		const result = await service.getById(input.id);
		return toSuccessResponse(result);
	}),
});

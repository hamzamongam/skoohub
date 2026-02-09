import { implement } from "@orpc/server";
import type { Context } from "@/server/orpc/context";
import { requiredAuthMiddleware } from "@/server/orpc/middleware";
import { toSuccessResponse } from "@/server/orpc/utils";
import { teacherContract } from "../contract/teacher.contract";
import { TeacherService } from "../services/teacher.service";

const service = new TeacherService();
const os = implement(teacherContract).$context<Context>();

export const teacherRouter = os.router({
	list: os.list.use(requiredAuthMiddleware).handler(async ({ context }) => {
		const schoolId = context.user.schoolId;
		if (!schoolId) throw new Error("School not found");
		const result = await service.list(schoolId);
		return toSuccessResponse(result);
	}),
});

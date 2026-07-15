import { implement } from "@orpc/server";
import type { Context } from "../../../server/orpc/context";
import { requiredAuthMiddleware } from "../../../server/orpc/middleware";
import { toSuccessResponse } from "../../../server/orpc/utils";
import { attendanceContract } from "../contract/attendance.contract";
import { AttendanceRepository } from "../repo/attendance.repo";
import { AttendanceService } from "../services/attendance.service";

const repo = new AttendanceRepository();
const service = new AttendanceService(repo);
const os = implement(attendanceContract).$context<Context>();

export const attendanceRouter = os.router({
	mark: os.mark.use(requiredAuthMiddleware).handler(async ({ input }) => {
		return await service.mark(input.classId, input.date, input.records);
	}),
	get: os.get.use(requiredAuthMiddleware).handler(async ({ input }) => {
		const result = await service.get(input.classId, input.date);
		return toSuccessResponse(result);
	}),
	getReport: os.getReport
		.use(requiredAuthMiddleware)
		.handler(async ({ input }) => {
			const result = await service.getReport(input.studentId);
			return toSuccessResponse(result);
		}),
});

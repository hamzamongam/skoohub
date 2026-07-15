import { implement, ORPCError } from "@orpc/server";
import type { Context } from "../../../server/orpc/context";
import { requiredAuthMiddleware } from "../../../server/orpc/middleware";
import { toSuccessResponse } from "../../../server/orpc/utils";
import { examContract } from "../contract/exam.contract";
import { ExamRepository } from "../repo/exam.repo";
import { ExamService } from "../services/exam.service";

const repo = new ExamRepository();
const service = new ExamService(repo);
const os = implement(examContract).$context<Context>();

export const examRouter = os.router({
	create: os.create
		.use(requiredAuthMiddleware)
		.handler(async ({ input, context }) => {
			if (!context.schoolId) {
				throw new ORPCError("BAD_REQUEST", {
					message: "User not linked to a school",
				});
			}
			const result = await service.createExam(context.schoolId, input);
			return toSuccessResponse(result);
		}),
	list: os.list.use(requiredAuthMiddleware).handler(async ({ context }) => {
		if (!context.schoolId) {
			throw new ORPCError("BAD_REQUEST", {
				message: "User not linked to a school",
			});
		}
		const result = await service.listExams(context.schoolId);
		return toSuccessResponse(result);
	}),
	listAcademicYears: os.listAcademicYears
		.use(requiredAuthMiddleware)
		.handler(async ({ context }) => {
			if (!context.schoolId) {
				throw new ORPCError("BAD_REQUEST", {
					message: "User not linked to a school",
				});
			}
			const result = await service.listAcademicYears(context.schoolId);
			return toSuccessResponse(result);
		}),
	listSubjects: os.listSubjects
		.use(requiredAuthMiddleware)
		.handler(async ({ context }) => {
			if (!context.schoolId) {
				throw new ORPCError("BAD_REQUEST", {
					message: "User not linked to a school",
				});
			}
			const result = await service.listSubjects(context.schoolId);
			return toSuccessResponse(result);
		}),
	configureSubjects: os.configureSubjects
		.use(requiredAuthMiddleware)
		.handler(async ({ input, context }) => {
			if (!context.schoolId) {
				throw new ORPCError("BAD_REQUEST", {
					message: "User not linked to a school",
				});
			}
			const result = await service.configureSubjects(context.schoolId, input);
			return toSuccessResponse(result);
		}),
	getSubjects: os.getSubjects
		.use(requiredAuthMiddleware)
		.handler(async ({ input, context }) => {
			if (!context.schoolId) {
				throw new ORPCError("BAD_REQUEST", {
					message: "User not linked to a school",
				});
			}
			const result = await service.getSubjects(context.schoolId, input);
			return toSuccessResponse(result);
		}),
	recordScores: os.recordScores
		.use(requiredAuthMiddleware)
		.handler(async ({ input, context }) => {
			if (!context.schoolId) {
				throw new ORPCError("BAD_REQUEST", {
					message: "User not linked to a school",
				});
			}
			return await service.recordScores(context.schoolId, input);
		}),
	getScores: os.getScores
		.use(requiredAuthMiddleware)
		.handler(async ({ input, context }) => {
			if (!context.schoolId) {
				throw new ORPCError("BAD_REQUEST", {
					message: "User not linked to a school",
				});
			}
			const result = await service.getScores(context.schoolId, input);
			return toSuccessResponse(result);
		}),
	getStudentReportCard: os.getStudentReportCard
		.use(requiredAuthMiddleware)
		.handler(async ({ input, context }) => {
			if (!context.schoolId) {
				throw new ORPCError("BAD_REQUEST", {
					message: "User not linked to a school",
				});
			}
			const result = await service.getStudentReportCard(
				context.schoolId,
				input,
			);
			return toSuccessResponse(result);
		}),
	createAcademicYear: os.createAcademicYear
		.use(requiredAuthMiddleware)
		.handler(async ({ input, context }) => {
			if (!context.schoolId) {
				throw new ORPCError("BAD_REQUEST", {
					message: "User not linked to a school",
				});
			}
			const result = await service.createAcademicYear(
				context.schoolId,
				input,
			);
			return toSuccessResponse(result);
		}),
	updateAcademicYear: os.updateAcademicYear
		.use(requiredAuthMiddleware)
		.handler(async ({ input, context }) => {
			if (!context.schoolId) {
				throw new ORPCError("BAD_REQUEST", {
					message: "User not linked to a school",
				});
			}
			const result = await service.updateAcademicYear(
				context.schoolId,
				input,
			);
			return toSuccessResponse(result);
		}),
});


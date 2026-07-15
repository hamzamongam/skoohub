import { oc } from "@orpc/contract";
import { z } from "zod";
import { SuccessResponseSchema } from "@/server/orpc/utils";
import {
	GetAttendanceInputSchema,
	GetStudentReportInputSchema,
	MarkAttendanceInputSchema,
	AttendanceResponseSchema,
	AttendanceReportResponseSchema,
} from "./attendance.schema";

export const attendanceContract = oc.router({
	mark: oc
		.input(MarkAttendanceInputSchema)
		.output(SuccessResponseSchema(z.null())),
	get: oc
		.input(GetAttendanceInputSchema)
		.output(SuccessResponseSchema(z.array(AttendanceResponseSchema))),
	getReport: oc
		.input(GetStudentReportInputSchema)
		.output(SuccessResponseSchema(AttendanceReportResponseSchema)),
});

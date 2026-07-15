import { z } from "zod";

export const AttendanceStatusSchema = z.enum([
	"PRESENT",
	"ABSENT",
	"LATE",
	"EXCUSED",
]);

export const AttendanceRecordSchema = z.object({
	studentId: z.string().min(1, "Student ID is required"),
	status: AttendanceStatusSchema,
	remarks: z.string().nullable().optional(),
});

export const MarkAttendanceInputSchema = z.object({
	classId: z.string().min(1, "Class ID is required"),
	date: z.string().min(1, "Date is required"), // YYYY-MM-DD
	records: z
		.array(AttendanceRecordSchema)
		.min(1, "At least one record is required"),
});

export const GetAttendanceInputSchema = z.object({
	classId: z.string().min(1, "Class ID is required"),
	date: z.string().min(1, "Date is required"), // YYYY-MM-DD
});

export const GetStudentReportInputSchema = z.object({
	studentId: z.string().min(1, "Student ID is required"),
});

export const AttendanceResponseSchema = z.object({
	id: z.string(),
	date: z.date(),
	status: AttendanceStatusSchema,
	remarks: z.string().nullable(),
	studentId: z.string(),
	studentName: z.string(),
	rollNumber: z.string().nullable(),
});

export const AttendanceReportResponseSchema = z.object({
	totalDays: z.number(),
	presentDays: z.number(),
	absentDays: z.number(),
	lateDays: z.number(),
	excusedDays: z.number(),
	percentage: z.number(),
	records: z.array(
		z.object({
			id: z.string(),
			date: z.date(),
			status: AttendanceStatusSchema,
			remarks: z.string().nullable(),
		}),
	),
});

export type AttendanceRecord = z.infer<typeof AttendanceRecordSchema>;
export type MarkAttendanceInput = z.infer<typeof MarkAttendanceInputSchema>;
export type GetAttendanceInput = z.infer<typeof GetAttendanceInputSchema>;
export type GetStudentReportInput = z.infer<typeof GetStudentReportInputSchema>;
export type AttendanceResponse = z.infer<typeof AttendanceResponseSchema>;
export type AttendanceReportResponse = z.infer<
	typeof AttendanceReportResponseSchema
>;

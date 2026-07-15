import { z } from "zod";

export const CreateExamInputSchema = z.object({
	name: z.string().min(1, "Exam name is required"),
	academicYearId: z.string().min(1, "Academic Year is required"),
	termId: z.string().nullable().optional(),
});

export const ExamSubjectInputSchema = z.object({
	subjectId: z.string().min(1, "Subject ID is required"),
	maxMarks: z.number().min(1, "Max marks must be at least 1"),
	passingMarks: z.number().min(0, "Passing marks cannot be negative"),
	examDate: z.string().nullable().optional(), // YYYY-MM-DD
});

export const ConfigureExamSubjectsInputSchema = z.object({
	examId: z.string().min(1, "Exam ID is required"),
	classId: z.string().min(1, "Class ID is required"),
	subjects: z
		.array(ExamSubjectInputSchema)
		.min(1, "At least one subject must be configured"),
});

export const GetExamSubjectsInputSchema = z.object({
	examId: z.string().min(1, "Exam ID is required"),
	classId: z.string().min(1, "Class ID is required"),
});

export const ExamScoreInputSchema = z.object({
	studentId: z.string().min(1, "Student ID is required"),
	marksObtained: z.number().min(0, "Marks obtained cannot be negative"),
	remarks: z.string().nullable().optional(),
});

export const RecordScoresInputSchema = z.object({
	examSubjectId: z.string().min(1, "Exam Subject ID is required"),
	scores: z
		.array(ExamScoreInputSchema)
		.min(1, "At least one student score is required"),
});

export const GetScoresInputSchema = z.object({
	examSubjectId: z.string().min(1, "Exam Subject ID is required"),
});

export const GetStudentReportCardInputSchema = z.object({
	studentId: z.string().min(1, "Student ID is required"),
	academicYearId: z.string().min(1, "Academic Year ID is required"),
});

/**
 * Output Schemas
 */

export const AcademicYearResponseSchema = z.object({
	id: z.string(),
	name: z.string(),
	startDate: z.date(),
	endDate: z.date(),
	isActive: z.boolean(),
	gradingSystem: z.enum(["GPA", "PERCENTAGE", "LETTER"]),
});

export const ExamResponseSchema = z.object({
	id: z.string(),
	name: z.string(),
	schoolId: z.string(),
	academicYearId: z.string(),
	termId: z.string().nullable(),
	createdAt: z.date(),
	updatedAt: z.date(),
});

export const ExamSubjectResponseSchema = z.object({
	id: z.string(),
	examId: z.string(),
	classId: z.string(),
	subjectId: z.string(),
	subjectName: z.string(),
	maxMarks: z.number(),
	passingMarks: z.number(),
	examDate: z.date().nullable(),
});

export const ExamScoreResponseSchema = z.object({
	id: z.string().nullable(), // Nullable if not recorded yet
	examSubjectId: z.string(),
	studentId: z.string(),
	studentName: z.string(),
	rollNumber: z.string().nullable(),
	marksObtained: z.number().nullable(), // Nullable if not recorded yet
	remarks: z.string().nullable(),
});

export const ReportCardSubjectSchema = z.object({
	examName: z.string(),
	subjectName: z.string(),
	marksObtained: z.number(),
	maxMarks: z.number(),
	passingMarks: z.number(),
	percentage: z.number(),
	letterGrade: z.string(),
	isPassed: z.boolean(),
});

export const ReportCardResponseSchema = z.object({
	studentId: z.string(),
	studentName: z.string(),
	rollNumber: z.string().nullable(),
	className: z.string(),
	academicYearName: z.string(),
	subjects: z.array(ReportCardSubjectSchema),
	totalMaxMarks: z.number(),
	totalMarksObtained: z.number(),
	overallPercentage: z.number(),
	gpa: z.number().nullable(),
});

export const SubjectResponseSchema = z.object({
	id: z.string(),
	name: z.string(),
});

export const CreateAcademicYearInputSchema = z.object({
	name: z.string().min(1, "Academic Year Name is required"),
	startDate: z.string().transform((v) => new Date(v)),
	endDate: z.string().transform((v) => new Date(v)),
	isActive: z.boolean().default(false),
	gradingSystem: z.enum(["GPA", "PERCENTAGE", "LETTER"]),
});

export const UpdateAcademicYearInputSchema = z.object({
	id: z.string(),
	name: z.string().min(1, "Academic Year Name is required").optional(),
	startDate: z.string().transform((v) => new Date(v)).optional(),
	endDate: z.string().transform((v) => new Date(v)).optional(),
	isActive: z.boolean().optional(),
	gradingSystem: z.enum(["GPA", "PERCENTAGE", "LETTER"]).optional(),
});

export type CreateExamInput = z.infer<typeof CreateExamInputSchema>;
export type ExamSubjectInput = z.infer<typeof ExamSubjectInputSchema>;
export type ConfigureExamSubjectsInput = z.infer<
	typeof ConfigureExamSubjectsInputSchema
>;
export type GetExamSubjectsInput = z.infer<typeof GetExamSubjectsInputSchema>;
export type ExamScoreInput = z.infer<typeof ExamScoreInputSchema>;
export type RecordScoresInput = z.infer<typeof RecordScoresInputSchema>;
export type GetScoresInput = z.infer<typeof GetScoresInputSchema>;
export type GetStudentReportCardInput = z.infer<
	typeof GetStudentReportCardInputSchema
>;
export type CreateAcademicYearInput = z.infer<
	typeof CreateAcademicYearInputSchema
>;
export type UpdateAcademicYearInput = z.infer<
	typeof UpdateAcademicYearInputSchema
>;

export type AcademicYearResponse = z.infer<typeof AcademicYearResponseSchema>;
export type ExamResponse = z.infer<typeof ExamResponseSchema>;
export type ExamSubjectResponse = z.infer<typeof ExamSubjectResponseSchema>;
export type ExamScoreResponse = z.infer<typeof ExamScoreResponseSchema>;
export type ReportCardResponse = z.infer<typeof ReportCardResponseSchema>;
export type SubjectResponse = z.infer<typeof SubjectResponseSchema>;


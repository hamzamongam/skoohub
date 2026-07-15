import { oc } from "@orpc/contract";
import { z } from "zod";
import { SuccessResponseSchema } from "@/server/orpc/utils";
import {
	AcademicYearResponseSchema,
	ConfigureExamSubjectsInputSchema,
	CreateExamInputSchema,
	ExamResponseSchema,
	ExamScoreResponseSchema,
	ExamSubjectResponseSchema,
	GetExamSubjectsInputSchema,
	GetScoresInputSchema,
	GetStudentReportCardInputSchema,
	RecordScoresInputSchema,
	ReportCardResponseSchema,
	SubjectResponseSchema,
	CreateAcademicYearInputSchema,
	UpdateAcademicYearInputSchema,
} from "./exam.schema";

export const examContract = oc.router({
	create: oc
		.input(CreateExamInputSchema)
		.output(SuccessResponseSchema(ExamResponseSchema)),
	list: oc.output(SuccessResponseSchema(z.array(ExamResponseSchema))),
	listAcademicYears: oc.output(
		SuccessResponseSchema(z.array(AcademicYearResponseSchema)),
	),
	createAcademicYear: oc
		.input(CreateAcademicYearInputSchema)
		.output(SuccessResponseSchema(AcademicYearResponseSchema)),
	updateAcademicYear: oc
		.input(UpdateAcademicYearInputSchema)
		.output(SuccessResponseSchema(AcademicYearResponseSchema)),
	listSubjects: oc.output(
		SuccessResponseSchema(z.array(SubjectResponseSchema)),
	),
	configureSubjects: oc
		.input(ConfigureExamSubjectsInputSchema)
		.output(SuccessResponseSchema(z.array(ExamSubjectResponseSchema))),
	getSubjects: oc
		.input(GetExamSubjectsInputSchema)
		.output(SuccessResponseSchema(z.array(ExamSubjectResponseSchema))),
	recordScores: oc
		.input(RecordScoresInputSchema)
		.output(SuccessResponseSchema(z.null())),
	getScores: oc
		.input(GetScoresInputSchema)
		.output(SuccessResponseSchema(z.array(ExamScoreResponseSchema))),
	getStudentReportCard: oc
		.input(GetStudentReportCardInputSchema)
		.output(SuccessResponseSchema(ReportCardResponseSchema)),
});


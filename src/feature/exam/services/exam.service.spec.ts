import { beforeEach, describe, expect, it, vi } from "vitest";
import { BadRequestError } from "@/utils/errors";
import { ExamRepository } from "../repo/exam.repo";
import { ExamService } from "./exam.service";

describe("ExamService", () => {
	let service: ExamService;
	let repo: ExamRepository;

	beforeEach(() => {
		repo = new ExamRepository();
		service = new ExamService(repo);
		vi.clearAllMocks();
	});

	describe("createExam", () => {
		it("should create an exam successfully", async () => {
			const schoolId = "school-1";
			const input = {
				name: "Term 1 Midterm",
				academicYearId: "ay-1",
				termId: "term-1",
			};

			const mockExam = {
				id: "exam-1",
				name: input.name,
				schoolId,
				academicYearId: input.academicYearId,
				termId: input.termId,
				createdAt: new Date(),
				updatedAt: new Date(),
			};

			const mockCreateExam = vi
				.spyOn(repo, "createExam")
				.mockResolvedValue(mockExam as any);

			const result = await service.createExam(schoolId, input);

			expect(mockCreateExam).toHaveBeenCalledWith({
				name: input.name,
				schoolId,
				academicYearId: input.academicYearId,
				termId: input.termId,
			});
			expect(result).toEqual(mockExam);
		});
	});

	describe("configureSubjects", () => {
		it("should configure exam subjects successfully", async () => {
			const schoolId = "school-1";
			const input = {
				examId: "exam-1",
				classId: "class-1",
				subjects: [
					{
						subjectId: "sub-1",
						maxMarks: 100,
						passingMarks: 35,
						examDate: "2026-06-15",
					},
				],
			};

			vi.spyOn(repo, "findExamById").mockResolvedValue({
				id: "exam-1",
				schoolId,
			} as any);

			vi.spyOn(repo, "configureExamSubjects").mockResolvedValue([] as any);

			const mockConfiguredSubjects = [
				{
					id: "es-1",
					examId: "exam-1",
					classId: "class-1",
					subjectId: "sub-1",
					subject: { name: "Mathematics" },
					maxMarks: 100,
					passingMarks: 35,
					examDate: new Date("2026-06-15T00:00:00.000Z"),
				},
			];

			vi.spyOn(repo, "findExamSubjects").mockResolvedValue(
				mockConfiguredSubjects as any,
			);

			const result = await service.configureSubjects(schoolId, input);

			expect(repo.configureExamSubjects).toHaveBeenCalledWith(
				"exam-1",
				"class-1",
				[
					{
						subjectId: "sub-1",
						maxMarks: 100,
						passingMarks: 35,
						examDate: new Date("2026-06-15T00:00:00.000Z"),
					},
				],
			);

			expect(result).toEqual([
				{
					id: "es-1",
					examId: "exam-1",
					classId: "class-1",
					subjectId: "sub-1",
					subjectName: "Mathematics",
					maxMarks: 100,
					passingMarks: 35,
					examDate: new Date("2026-06-15T00:00:00.000Z"),
				},
			]);
		});

		it("should throw BadRequestError if passing marks exceed maximum marks", async () => {
			const schoolId = "school-1";
			const input = {
				examId: "exam-1",
				classId: "class-1",
				subjects: [
					{
						subjectId: "sub-1",
						maxMarks: 50,
						passingMarks: 60,
						examDate: "2026-06-15",
					},
				],
			};

			vi.spyOn(repo, "findExamById").mockResolvedValue({
				id: "exam-1",
				schoolId,
			} as any);

			await expect(service.configureSubjects(schoolId, input)).rejects.toThrow(
				BadRequestError,
			);
		});
	});

	describe("recordScores", () => {
		it("should record scores successfully", async () => {
			const schoolId = "school-1";
			const input = {
				examSubjectId: "es-1",
				scores: [
					{ studentId: "student-1", marksObtained: 85, remarks: "Excellent" },
				],
			};

			vi.spyOn(repo, "findExamSubjectById").mockResolvedValue({
				id: "es-1",
				maxMarks: 100,
				exam: { schoolId },
			} as any);

			const mockRecordScores = vi
				.spyOn(repo, "recordScores")
				.mockResolvedValue([] as any);

			const result = await service.recordScores(schoolId, input);

			expect(mockRecordScores).toHaveBeenCalledWith("es-1", [
				{ studentId: "student-1", marksObtained: 85, remarks: "Excellent" },
			]);
			expect(result.success).toBe(true);
		});

		it("should throw BadRequestError if marks obtained exceed max marks", async () => {
			const schoolId = "school-1";
			const input = {
				examSubjectId: "es-1",
				scores: [{ studentId: "student-1", marksObtained: 105, remarks: "" }],
			};

			vi.spyOn(repo, "findExamSubjectById").mockResolvedValue({
				id: "es-1",
				maxMarks: 100,
				exam: { schoolId },
			} as any);

			await expect(service.recordScores(schoolId, input)).rejects.toThrow(
				BadRequestError,
			);
		});
	});

	describe("getStudentReportCard", () => {
		it("should generate report card with GPA points correctly", async () => {
			const schoolId = "school-1";
			const input = {
				studentId: "student-1",
				academicYearId: "ay-1",
			};

			vi.spyOn(repo, "findAcademicYearById").mockResolvedValue({
				id: "ay-1",
				name: "2026-2027",
				gradingSystem: "GPA",
				schoolId,
			} as any);

			const mockScores = [
				{
					id: "score-1",
					marksObtained: 95,
					examSubject: {
						maxMarks: 100,
						passingMarks: 35,
						exam: { name: "Midterm" },
						subject: { name: "Maths" },
					},
					student: {
						id: "student-1",
						rollNumber: "12",
						user: { name: "Charlie" },
						class: { grade: "10", section: "A" },
					},
				},
				{
					id: "score-2",
					marksObtained: 75,
					examSubject: {
						maxMarks: 100,
						passingMarks: 35,
						exam: { name: "Midterm" },
						subject: { name: "Science" },
					},
					student: {
						id: "student-1",
						rollNumber: "12",
						user: { name: "Charlie" },
						class: { grade: "10", section: "A" },
					},
				},
			];

			vi.spyOn(repo, "findStudentScoresInAcademicYear").mockResolvedValue(
				mockScores as any,
			);

			const result = await service.getStudentReportCard(schoolId, input);

			expect(result.studentName).toBe("Charlie");
			expect(result.className).toBe("10-A");
			expect(result.totalMaxMarks).toBe(200);
			expect(result.totalMarksObtained).toBe(170);
			// Overall percentage: (170 / 200) * 100 = 85%
			expect(result.overallPercentage).toBe(85);
			// GPAs: 95% -> 4.0, 75% -> 3.0. Avg GPA: (4 + 3) / 2 = 3.5
			expect(result.gpa).toBe(3.5);
			expect(result.subjects).toHaveLength(2);
			expect(result.subjects[0].letterGrade).toBe("A+");
			expect(result.subjects[1].letterGrade).toBe("B");
		});
	});

	describe("listAcademicYears", () => {
		it("should list academic years successfully", async () => {
			const schoolId = "school-1";
			const mockAYs = [{ id: "ay-1", name: "2026-2027", schoolId }];

			const mockFindAcademicYears = vi
				.spyOn(repo, "findAcademicYearsBySchool")
				.mockResolvedValue(mockAYs as any);

			const result = await service.listAcademicYears(schoolId);

			expect(mockFindAcademicYears).toHaveBeenCalledWith(schoolId);
			expect(result).toEqual(mockAYs);
		});
	});

	describe("listSubjects", () => {
		it("should list/seed subjects successfully", async () => {
			const schoolId = "school-1";
			const mockSubjects = [{ id: "s-1", name: "Mathematics" }];

			const mockFindOrCreate = vi
				.spyOn(repo, "findOrCreateDefaultSubjects")
				.mockResolvedValue(mockSubjects as any);

			const result = await service.listSubjects(schoolId);

			expect(mockFindOrCreate).toHaveBeenCalled();
			expect(result).toEqual(mockSubjects);
		});
	});
});

import { logger } from "@/lib/logger";
import { toSuccessResponse } from "@/server/orpc/utils";
import { BadRequestError, NotFoundError } from "@/utils/errors";
import type {
	AcademicYearResponse,
	ConfigureExamSubjectsInput,
	CreateExamInput,
	ExamResponse,
	ExamScoreResponse,
	ExamSubjectResponse,
	GetExamSubjectsInput,
	GetScoresInput,
	GetStudentReportCardInput,
	RecordScoresInput,
	ReportCardResponse,
	SubjectResponse,
	CreateAcademicYearInput,
	UpdateAcademicYearInput,
} from "../contract/exam.schema";
import type { ExamRepository } from "../repo/exam.repo";

export class ExamService {
	constructor(private repo: ExamRepository) {}

	/**
	 * Creates a new exam event cycle.
	 */
	async createExam(
		schoolId: string,
		input: CreateExamInput,
	): Promise<ExamResponse> {
		logger.info({ schoolId, name: input.name }, "Creating new exam event");

		const exam = await this.repo.createExam({
			name: input.name,
			schoolId,
			academicYearId: input.academicYearId,
			termId: input.termId,
		});

		return exam;
	}

	/**
	 * Lists all exams configured for a school.
	 */
	async listExams(schoolId: string): Promise<ExamResponse[]> {
		logger.debug({ schoolId }, "Listing all exams");
		return await this.repo.findExamsBySchool(schoolId);
	}

	/**
	 * Configures which subjects are tested for a class in an exam cycle.
	 */
	async configureSubjects(
		schoolId: string,
		input: ConfigureExamSubjectsInput,
	): Promise<ExamSubjectResponse[]> {
		logger.info(
			{ examId: input.examId, classId: input.classId },
			"Configuring exam subjects",
		);

		// Verify exam exists and belongs to school
		const exam = await this.repo.findExamById(input.examId);
		if (!exam || exam.schoolId !== schoolId) {
			throw new NotFoundError("Exam not found or access denied");
		}

		const formattedSubjects = input.subjects.map((sub) => {
			if (sub.passingMarks > sub.maxMarks) {
				throw new BadRequestError("Passing marks cannot exceed maximum marks");
			}

			return {
				subjectId: sub.subjectId,
				maxMarks: sub.maxMarks,
				passingMarks: sub.passingMarks,
				examDate: sub.examDate
					? new Date(`${sub.examDate}T00:00:00.000Z`)
					: null,
			};
		});

		await this.repo.configureExamSubjects(
			input.examId,
			input.classId,
			formattedSubjects,
		);

		// Fetch subjects info to populate response subject names
		const result = await this.repo.findExamSubjects(
			input.examId,
			input.classId,
		);

		return result.map((r) => ({
			id: r.id,
			examId: r.examId,
			classId: r.classId,
			subjectId: r.subjectId,
			subjectName: r.subject.name,
			maxMarks: r.maxMarks,
			passingMarks: r.passingMarks,
			examDate: r.examDate,
		}));
	}

	/**
	 * Fetches configured exam subjects for a class.
	 */
	async getSubjects(
		schoolId: string,
		input: GetExamSubjectsInput,
	): Promise<ExamSubjectResponse[]> {
		logger.debug(
			{ examId: input.examId, classId: input.classId },
			"Fetching exam subjects",
		);

		const exam = await this.repo.findExamById(input.examId);
		if (!exam || exam.schoolId !== schoolId) {
			throw new NotFoundError("Exam not found or access denied");
		}

		const result = await this.repo.findExamSubjects(
			input.examId,
			input.classId,
		);

		return result.map((r) => ({
			id: r.id,
			examId: r.examId,
			classId: r.classId,
			subjectId: r.subjectId,
			subjectName: r.subject.name,
			maxMarks: r.maxMarks,
			passingMarks: r.passingMarks,
			examDate: r.examDate,
		}));
	}

	/**
	 * Records student marks for a configured exam subject.
	 */
	async recordScores(schoolId: string, input: RecordScoresInput) {
		logger.info(
			{ examSubjectId: input.examSubjectId },
			"Recording exam scores",
		);

		const examSubject = await this.repo.findExamSubjectById(
			input.examSubjectId,
		);
		if (!examSubject || examSubject.exam.schoolId !== schoolId) {
			throw new NotFoundError("Exam subject not found or access denied");
		}

		// Validate that marks do not exceed maximum marks
		for (const score of input.scores) {
			if (score.marksObtained > examSubject.maxMarks) {
				throw new BadRequestError(
					`Marks obtained (${score.marksObtained}) cannot exceed maximum marks (${examSubject.maxMarks})`,
				);
			}
		}

		await this.repo.recordScores(
			input.examSubjectId,
			input.scores.map((s) => ({
				studentId: s.studentId,
				marksObtained: s.marksObtained,
				remarks: s.remarks,
			})),
		);

		return toSuccessResponse(null, "Scores recorded successfully");
	}

	/**
	 * Fetches scores for an exam subject, merged with the class student roster.
	 */
	async getScores(
		schoolId: string,
		input: GetScoresInput,
	): Promise<ExamScoreResponse[]> {
		logger.debug(
			{ examSubjectId: input.examSubjectId },
			"Fetching exam scores",
		);

		const examSubject = await this.repo.findExamSubjectById(
			input.examSubjectId,
		);
		if (!examSubject || examSubject.exam.schoolId !== schoolId) {
			throw new NotFoundError("Exam subject not found or access denied");
		}

		const studentScores = await this.repo.findScoresByExamSubject(
			input.examSubjectId,
		);

		return studentScores.map((student) => {
			const score = student.examScores[0]; // Roster fetch returns array containing 0 or 1 matching score

			return {
				id: score?.id ?? null,
				examSubjectId: input.examSubjectId,
				studentId: student.id,
				studentName: student.user.name,
				rollNumber: student.rollNumber,
				marksObtained: score ? score.marksObtained : null,
				remarks: score?.remarks ?? null,
			};
		});
	}

	/**
	 * Calculates and compiles the report card of a student for an academic year.
	 */
	async getStudentReportCard(
		schoolId: string,
		input: GetStudentReportCardInput,
	): Promise<ReportCardResponse> {
		logger.info(
			{ studentId: input.studentId, academicYearId: input.academicYearId },
			"Generating student report card",
		);

		const academicYear = await this.repo.findAcademicYearById(
			input.academicYearId,
		);
		if (!academicYear || academicYear.schoolId !== schoolId) {
			throw new NotFoundError("Academic Year not found or access denied");
		}

		const scores = await this.repo.findStudentScoresInAcademicYear(
			input.studentId,
			input.academicYearId,
		);

		if (scores.length === 0) {
			throw new NotFoundError("No exam records found for this student");
		}

		const student = scores[0].student;
		const className = student.class
			? `${student.class.grade}-${student.class.section}`
			: "Unassigned";

		let totalMaxMarks = 0;
		let totalMarksObtained = 0;
		let totalGpaPoints = 0;

		const subjects = scores.map((s) => {
			const percentage = (s.marksObtained / s.examSubject.maxMarks) * 100;
			const letterGrade = this.calculateLetterGrade(percentage);
			const isPassed = s.marksObtained >= s.examSubject.passingMarks;
			const gpaPoints = this.calculateGpaPoints(percentage);

			totalMaxMarks += s.examSubject.maxMarks;
			totalMarksObtained += s.marksObtained;
			totalGpaPoints += gpaPoints;

			return {
				examName: s.examSubject.exam.name,
				subjectName: s.examSubject.subject.name,
				marksObtained: s.marksObtained,
				maxMarks: s.examSubject.maxMarks,
				passingMarks: s.examSubject.passingMarks,
				percentage: Math.round(percentage * 100) / 100,
				letterGrade,
				isPassed,
			};
		});

		const overallPercentage =
			totalMaxMarks > 0 ? (totalMarksObtained / totalMaxMarks) * 100 : 0;
		const averageGpa = scores.length > 0 ? totalGpaPoints / scores.length : 0;

		return {
			studentId: student.id,
			studentName: student.user.name,
			rollNumber: student.rollNumber,
			className,
			academicYearName: academicYear.name,
			subjects,
			totalMaxMarks,
			totalMarksObtained,
			overallPercentage: Math.round(overallPercentage * 100) / 100,
			gpa:
				academicYear.gradingSystem === "GPA"
					? Math.round(averageGpa * 100) / 100
					: null,
		};
	}

	/**
	 * Lists all academic years for a school.
	 */
	async listAcademicYears(schoolId: string): Promise<AcademicYearResponse[]> {
		logger.debug({ schoolId }, "Listing all academic years");
		return await this.repo.findAcademicYearsBySchool(schoolId);
	}

	/**
	 * Creates a new academic year.
	 */
	async createAcademicYear(
		schoolId: string,
		input: CreateAcademicYearInput,
	): Promise<AcademicYearResponse> {
		logger.info({ schoolId, name: input.name }, "Creating new academic year");

		if (input.startDate >= input.endDate) {
			throw new BadRequestError("Start date must be before end date");
		}

		return await this.repo.createAcademicYear(schoolId, input);
	}

	/**
	 * Updates an academic year.
	 */
	async updateAcademicYear(
		schoolId: string,
		input: UpdateAcademicYearInput,
	): Promise<AcademicYearResponse> {
		const { id, ...data } = input;
		logger.info({ schoolId, id }, "Updating academic year");

		const existing = await this.repo.findAcademicYearById(id);
		if (!existing || existing.schoolId !== schoolId) {
			throw new NotFoundError("Academic year not found");
		}

		const startDate = data.startDate ?? existing.startDate;
		const endDate = data.endDate ?? existing.endDate;

		if (startDate >= endDate) {
			throw new BadRequestError("Start date must be before end date");
		}

		return await this.repo.updateAcademicYear(schoolId, id, data);
	}

	/**
	 * Lists all available subjects in the school.
	 */
	async listSubjects(schoolId: string): Promise<SubjectResponse[]> {
		logger.debug({ schoolId }, "Listing all subjects");
		return await this.repo.findOrCreateDefaultSubjects();
	}

	private calculateLetterGrade(percentage: number): string {
		if (percentage >= 90) return "A+";
		if (percentage >= 80) return "A";
		if (percentage >= 70) return "B";
		if (percentage >= 60) return "C";
		if (percentage >= 50) return "D";
		if (percentage >= 35) return "E";
		return "F";
	}

	private calculateGpaPoints(percentage: number): number {
		if (percentage >= 90) return 4.0;
		if (percentage >= 80) return 4.0;
		if (percentage >= 70) return 3.0;
		if (percentage >= 60) return 2.0;
		if (percentage >= 50) return 1.0;
		if (percentage >= 35) return 0.5;
		return 0.0;
	}
}

import { prisma } from "@/db/prisma";

export class ExamRepository {
	/**
	 * Creates a new exam event.
	 */
	async createExam(data: {
		name: string;
		schoolId: string;
		academicYearId: string;
		termId?: string | null;
	}) {
		return await prisma.exam.create({
			data: {
				name: data.name,
				schoolId: data.schoolId,
				academicYearId: data.academicYearId,
				termId: data.termId ?? null,
			},
		});
	}

	/**
	 * Fetches all exams for a school.
	 */
	async findExamsBySchool(schoolId: string) {
		return await prisma.exam.findMany({
			where: { schoolId },
			orderBy: { createdAt: "desc" },
		});
	}

	/**
	 * Fetches an exam by its ID.
	 */
	async findExamById(id: string) {
		return await prisma.exam.findUnique({
			where: { id },
		});
	}

	/**
	 * Configures subject setup (max marks, passing marks, date) for an exam class.
	 */
	async configureExamSubjects(
		examId: string,
		classId: string,
		subjects: {
			subjectId: string;
			maxMarks: number;
			passingMarks: number;
			examDate?: Date | null;
		}[],
	) {
		return await prisma.$transaction(
			subjects.map((sub) =>
				prisma.examSubject.upsert({
					where: {
						examId_classId_subjectId: {
							examId,
							classId,
							subjectId: sub.subjectId,
						},
					},
					update: {
						maxMarks: sub.maxMarks,
						passingMarks: sub.passingMarks,
						examDate: sub.examDate ?? null,
					},
					create: {
						examId,
						classId,
						subjectId: sub.subjectId,
						maxMarks: sub.maxMarks,
						passingMarks: sub.passingMarks,
						examDate: sub.examDate ?? null,
					},
				}),
			),
		);
	}

	/**
	 * Fetches configured subjects for a class in an exam.
	 */
	async findExamSubjects(examId: string, classId: string) {
		return await prisma.examSubject.findMany({
			where: { examId, classId },
			include: {
				subject: true,
			},
		});
	}

	/**
	 * Fetches an ExamSubject by ID.
	 */
	async findExamSubjectById(id: string) {
		return await prisma.examSubject.findUnique({
			where: { id },
			include: {
				exam: true,
				class: true,
			},
		});
	}

	/**
	 * Batch records or updates exam scores for students.
	 */
	async recordScores(
		examSubjectId: string,
		scores: {
			studentId: string;
			marksObtained: number;
			remarks?: string | null;
		}[],
	) {
		return await prisma.$transaction(
			scores.map((score) =>
				prisma.examScore.upsert({
					where: {
						examSubjectId_studentId: {
							examSubjectId,
							studentId: score.studentId,
						},
					},
					update: {
						marksObtained: score.marksObtained,
						remarks: score.remarks ?? null,
					},
					create: {
						examSubjectId,
						studentId: score.studentId,
						marksObtained: score.marksObtained,
						remarks: score.remarks ?? null,
					},
				}),
			),
		);
	}

	/**
	 * Fetches all student records in a class, including their score for a specific exam subject.
	 */
	async findScoresByExamSubject(examSubjectId: string) {
		const examSubject = await prisma.examSubject.findUnique({
			where: { id: examSubjectId },
			select: { classId: true },
		});
		if (!examSubject) return [];

		return await prisma.studentProfile.findMany({
			where: { classId: examSubject.classId },
			include: {
				user: true,
				examScores: {
					where: { examSubjectId },
				},
			},
			orderBy: { rollNumber: "asc" },
		});
	}

	/**
	 * Fetches all scored papers for a student in a specific academic year.
	 */
	async findStudentScoresInAcademicYear(
		studentId: string,
		academicYearId: string,
	) {
		return await prisma.examScore.findMany({
			where: {
				studentId,
				examSubject: {
					exam: {
						academicYearId,
					},
				},
			},
			include: {
				examSubject: {
					include: {
						exam: true,
						subject: true,
						class: true,
					},
				},
				student: {
					include: {
						user: true,
						class: true,
					},
				},
			},
		});
	}

	/**
	 * Fetches an academic year with its name/active grading system by ID.
	 */
	async findAcademicYearById(id: string) {
		return await prisma.academicYear.findUnique({
			where: { id },
		});
	}

	/**
	 * Fetches all academic years for a school.
	 */
	async findAcademicYearsBySchool(schoolId: string) {
		return await prisma.academicYear.findMany({
			where: { schoolId },
			orderBy: { startDate: "desc" },
		});
	}

	/**
	 * Creates a new academic year, deactivating existing ones if set to active.
	 */
	async createAcademicYear(schoolId: string, data: {
		name: string;
		startDate: Date;
		endDate: Date;
		isActive: boolean;
		gradingSystem: any;
	}) {
		return await prisma.$transaction(async (tx) => {
			if (data.isActive) {
				await tx.academicYear.updateMany({
					where: { schoolId, isActive: true },
					data: { isActive: false },
				});
			}
			return await tx.academicYear.create({
				data: {
					name: data.name,
					startDate: data.startDate,
					endDate: data.endDate,
					isActive: data.isActive,
					gradingSystem: data.gradingSystem,
					schoolId,
				},
			});
		});
	}

	/**
	 * Updates an academic year, deactivating other active ones if this one becomes active.
	 */
	async updateAcademicYear(schoolId: string, id: string, data: {
		name?: string;
		startDate?: Date;
		endDate?: Date;
		isActive?: boolean;
		gradingSystem?: any;
	}) {
		return await prisma.$transaction(async (tx) => {
			if (data.isActive) {
				await tx.academicYear.updateMany({
					where: { schoolId, id: { not: id }, isActive: true },
					data: { isActive: false },
				});
			}
			return await tx.academicYear.update({
				where: { id },
				data,
			});
		});
	}

	/**
	 * Finds all subjects. Seeds defaults if none exist.
	 */
	async findOrCreateDefaultSubjects() {
		const count = await prisma.subject.count();
		if (count === 0) {
			const defaults = [
				"Mathematics",
				"Science",
				"English",
				"Social Studies",
				"Art",
				"Physical Education",
				"Computer Science",
			];
			await prisma.subject.createMany({
				data: defaults.map((name) => ({ name })),
				skipDuplicates: true,
			});
		}
		return await prisma.subject.findMany({
			orderBy: { name: "asc" },
		});
	}
}

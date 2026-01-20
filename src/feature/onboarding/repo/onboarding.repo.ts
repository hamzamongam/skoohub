import type { OnboardingStatus, Prisma } from "prisma/generated/client";
import { prisma } from "@/db/prisma";

/**
 * OnboardingRepository handles database interactions for the onboarding flow,
 * including academic structures, classes, and invitations.
 */
export class OnboardingRepository {
	/**
	 * Creates a new Academic Year for a school.
	 */
	async createAcademicYear(data: Prisma.AcademicYearCreateInput) {
		return await prisma.academicYear.create({
			data,
		});
	}

	/**
	 * Updates the onboarding status of a school.
	 */
	async updateSchoolStatus(schoolId: string, status: OnboardingStatus) {
		return await prisma.school.update({
			where: { id: schoolId },
			data: { onboardingStatus: status },
		});
	}

	/**
	 * Creates a new Grade Level (and its sections if nested).
	 */
	async createGradeLevel(data: Prisma.GradeLevelCreateInput) {
		return await prisma.gradeLevel.create({
			data,
		});
	}

	/**
	 * Retrieval method for school by ID.
	 */
	async findSchoolById(id: string) {
		return await prisma.school.findUnique({
			where: { id },
		});
	}

	/**
	 * Creates a pending invitation for a staff member.
	 */
	async createInvitation(data: Prisma.InvitationCreateInput) {
		return await prisma.invitation.create({
			data,
		});
	}

	/**
	 * Executes multiple operations in a single transaction.
	 */
	async transaction<T>(
		fn: (tx: Prisma.TransactionClient) => Promise<T>,
	): Promise<T> {
		return await prisma.$transaction(fn);
	}
}

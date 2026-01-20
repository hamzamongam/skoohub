import type { GradingSystem } from "prisma/generated/client";
import { logger } from "@/lib/logger";
import { toSuccessResponse } from "@/server/orpc/utils";
import { BadRequestError, NotFoundError } from "@/utils/errors";
import type { OnboardingRepository } from "../repo/onboarding.repo";

/**
 * OnboardingService orchestrates the multi-phase setup wizard for new schools.
 */
export class OnboardingService {
	constructor(private repo: OnboardingRepository) {}

	/**
	 * Phase 1: Academic Structure
	 * Sets up the academic year, terms, and grading system for the school.
	 */
	async setupAcademicStructure(
		schoolId: string,
		input: {
			yearName: string;
			startDate: Date;
			endDate: Date;
			terms: { name: string; startDate: Date; endDate: Date }[];
			gradingSystem: string;
		},
	) {
		logger.info(
			{ schoolId, yearName: input.yearName },
			"Setting up academic structure",
		);

		// 1. Validation: Year dates
		if (input.startDate >= input.endDate) {
			throw new BadRequestError(
				"Academic year start date must be before end date",
			);
		}

		// 2. Validation: Term dates
		for (const term of input.terms) {
			if (term.startDate >= term.endDate) {
				throw new BadRequestError(
					`Term "${term.name}" start date must be before end date`,
				);
			}
			if (term.startDate < input.startDate || term.endDate > input.endDate) {
				throw new BadRequestError(
					`Term "${term.name}" must be within the academic year dates`,
				);
			}
		}

		return await this.repo.transaction(async (tx) => {
			// 3. Deactivate previous active years (if any)
			await tx.academicYear.updateMany({
				where: { schoolId, isActive: true },
				data: { isActive: false },
			});

			// 4. Create Academic Year
			const academicYear = await tx.academicYear.create({
				data: {
					name: input.yearName,
					startDate: input.startDate,
					endDate: input.endDate,
					isActive: true,
					schoolId,
					terms: {
						create: input.terms,
					},
					gradingSystem: input.gradingSystem as GradingSystem,
				},
			});

			// 5. Update School onboarding status
			await tx.school.update({
				where: { id: schoolId },
				data: { onboardingStatus: "COMPLETED" },
			});

			return toSuccessResponse(academicYear, "Academic structure saved");
		});
	}

	/**
	 * Phase 2: Class & Section Setup
	 * Creates grade levels and sections. Supports batch creation.
	 */
	async setupClasses(
		schoolId: string,
		input: {
			grades: { name: string; level: number; sections: string[] }[];
		},
	) {
		logger.info({ schoolId }, "Setting up classes and sections");

		return await this.repo.transaction(async (tx) => {
			for (const grade of input.grades) {
				await tx.gradeLevel.create({
					data: {
						name: grade.name,
						level: grade.level,
						schoolId,
						sections: {
							create: grade.sections.map((s: string) => ({ name: s })),
						},
					},
				});
			}

			await tx.school.update({
				where: { id: schoolId },
				data: { onboardingStatus: "COMPLETED" },
			});

			return toSuccessResponse(null, "Classes configured successfully");
		});
	}

	/**
	 * Phase 3: Staff Invitation
	 * Invites staff members via email.
	 */
	async inviteStaff(schoolId: string, inviterId: string, emails: string[]) {
		logger.info({ schoolId, count: emails.length }, "Inviting staff members");

		const school = await this.repo.findSchoolById(schoolId);
		if (!school) {
			logger.warn(
				{ schoolId },
				"Onboarding failed: school not found during invitation phase",
			);
			throw new NotFoundError("School not found");
		}

		for (const email of emails) {
			await this.repo.createInvitation({
				id: crypto.randomUUID(),
				email,
				organizationId: schoolId,
				role: "teacher",
				status: "pending",
				expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
				user: { connect: { id: inviterId } },
			});

			// TODO: Trigger actual email service
		}

		// Finalize onboarding
		await this.repo.updateSchoolStatus(schoolId, "COMPLETED");

		logger.info({ schoolId }, "Onboarding completed successfully");

		return toSuccessResponse(null, "Staff invitations sent");
	}
}

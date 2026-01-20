import { implement } from "@orpc/server";
import { BadRequestError } from "@/utils/errors";
import type { Context } from "../../../server/orpc/context";
import { requiredAuthMiddleware } from "../../../server/orpc/middleware";
import { onboardingContract } from "../contract/onboarding.contract";
import { OnboardingRepository } from "../repo/onboarding.repo";
import { OnboardingService } from "../services/onboarding.service";

const onboardingRepo = new OnboardingRepository();
const onboardingService = new OnboardingService(onboardingRepo);
const os = implement(onboardingContract).$context<Context>();

/**
 * onboardingRouter handles the school setup lifecycle after initial registration.
 * It provides procedures for defining academic structure, classes, and invitations.
 */
export const onboardingRouter = os.router({
	/**
	 * Configures the academic year, terms, and grading system.
	 * Requires the schoolId to be present in the user's session.
	 */
	setupAcademicStructure: os.setupAcademicStructure
		.use(requiredAuthMiddleware)
		.handler(async ({ input, context }) => {
			if (!context.schoolId) {
				throw new BadRequestError("User not linked to a school");
			}
			return await onboardingService.setupAcademicStructure(
				context.schoolId,
				input,
			);
		}),
	/**
	 * Defines grade levels and their respective sections for the school.
	 */
	setupClasses: os.setupClasses
		.use(requiredAuthMiddleware)
		.handler(async ({ input, context }) => {
			if (!context.schoolId) {
				throw new BadRequestError("User not linked to a school");
			}
			return await onboardingService.setupClasses(context.schoolId, input);
		}),
	/**
	 * Invites staff members and finalizes the school's onboarding status to ACTIVE.
	 */
	inviteStaff: os.inviteStaff
		.use(requiredAuthMiddleware)
		.handler(async ({ input, context }) => {
			if (!context.schoolId) {
				throw new BadRequestError("User not linked to a school");
			}
			return await onboardingService.inviteStaff(
				context.schoolId,
				context.user.id,
				input.emails,
			);
		}),
});

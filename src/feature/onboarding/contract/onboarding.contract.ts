import { oc } from "@orpc/contract";
import z from "zod";
import { SuccessResponseSchema } from "../../../server/orpc/utils";
import {
	AcademicStructureSchema,
	ClassSetupSchema,
	StaffInvitationSchema,
} from "./onboarding.schema";

/**
 * Onboarding contract definitions.
 * Defines schemas for the multi-step school setup process.
 */
export const onboardingContract = oc.router({
	setupAcademicStructure: oc
		.input(AcademicStructureSchema)
		.output(SuccessResponseSchema(z.any())),
	setupClasses: oc
		.input(ClassSetupSchema)
		.output(SuccessResponseSchema(z.any())),
	inviteStaff: oc
		.input(StaffInvitationSchema)
		.output(SuccessResponseSchema(z.any())),
});

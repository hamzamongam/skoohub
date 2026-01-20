import { oc } from "@orpc/contract";
import z from "zod";
import { SuccessResponseSchema } from "../../../server/orpc/utils";
import {
	CreateSchoolProfileSchema,
	loginSchema,
	SignUpSchema,
} from "./auth.schema";

/**
 * Auth contract definitions.
 * Specifies input/output schemas for authentication procedures.
 */
export const authContract = oc.router({
	login: oc.input(loginSchema).output(SuccessResponseSchema(z.any())),
	signUp: oc.input(SignUpSchema).output(SuccessResponseSchema(z.any())),
	createSchoolProfile: oc
		.input(CreateSchoolProfileSchema)
		.output(SuccessResponseSchema(z.any())),
	me: oc.output(SuccessResponseSchema(z.any())),
});

import { oc } from "@orpc/contract";
import z from "zod";
import { SuccessResponseSchema } from "../../../server/orpc/utils";

export const SchoolSchema = z.object({
	name: z.string().min(3),
	slug: z
		.string()
		.min(3)
		.regex(/^[a-z0-9-]+$/),
});

/**
 * School contract definitions.
 * Defines the schema for school creation and retrieval.
 */
export const schoolContract = oc.router({
	create: oc.input(SchoolSchema).output(SuccessResponseSchema(z.any())),
	get: oc
		.input(z.object({ id: z.string() }))
		.output(SuccessResponseSchema(z.any())),
	getCurrent: oc.input(z.void()).output(SuccessResponseSchema(z.any())),
});

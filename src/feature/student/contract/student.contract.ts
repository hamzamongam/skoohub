import { oc } from "@orpc/contract";
import z from "zod";
import { SuccessResponseSchema } from "../../../server/orpc/utils";
import {
	StudentSchema,
	StudentSchemaInput,
	StudentSchemaOutput,
	StudentSchemaUpdateInput,
} from "./student.shema";

/**
 * Student contract definitions.
 * Defines schemas for student management operations.
 */
export const studentContract = oc.router({
	create: oc
		.input(StudentSchemaInput)
		.output(SuccessResponseSchema(StudentSchemaOutput)),
	list: oc.output(SuccessResponseSchema(z.array(StudentSchemaOutput))),
	delete: oc
		.input(z.object({ id: z.string() }))
		.output(SuccessResponseSchema(z.any())),
	get: oc
		.input(z.object({ id: z.string() }))
		.output(SuccessResponseSchema(StudentSchemaOutput)),
	update: oc
		.input(StudentSchemaUpdateInput)
		.output(SuccessResponseSchema(StudentSchemaOutput)),
});

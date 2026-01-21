import { oc } from "@orpc/contract";
import z from "zod";
import { SuccessResponseSchema } from "../../../server/orpc/utils";
import { StudentSchema, StudentSchemaInput } from "./student.shema";

/**
 * Student contract definitions.
 * Defines schemas for student management operations.
 */
export const studentContract = oc.router({
	create: oc
		.input(StudentSchemaInput)
		.output(SuccessResponseSchema(StudentSchema)),
	list: oc
		.input(z.object({ schoolId: z.string() }))
		.output(SuccessResponseSchema(z.array(StudentSchema))),
	delete: oc
		.input(z.object({ id: z.string() }))
		.output(SuccessResponseSchema(z.any())),
});

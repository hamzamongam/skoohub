import { oc } from "@orpc/contract";
import { z } from "zod";
import { SuccessResponseSchema } from "@/server/orpc/utils";
import { ClassSchemaInput, ClassSchemaOutput } from "./class.schema";

export const classContract = oc.router({
	create: oc
		.input(ClassSchemaInput)
		.output(SuccessResponseSchema(ClassSchemaOutput)),
	update: oc
		.input(ClassSchemaInput.partial().extend({ id: z.string() }))
		.output(SuccessResponseSchema(ClassSchemaOutput)),
	delete: oc
		.input(z.object({ id: z.string() }))
		.output(SuccessResponseSchema(z.any())),
	list: oc.output(SuccessResponseSchema(z.array(ClassSchemaOutput))),
	get: oc
		.input(z.object({ id: z.string() }))
		.output(SuccessResponseSchema(ClassSchemaOutput.nullable())),
});

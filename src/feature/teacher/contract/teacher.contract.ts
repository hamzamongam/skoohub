import { oc } from "@orpc/contract";
import { z } from "zod";
import { SuccessResponseSchema } from "@/server/orpc/utils";

const TeacherSchemaOutput = z.object({
	id: z.string(),
	user: z.object({
		id: z.string(),
		name: z.string(),
		email: z.string(),
		image: z.string().nullable(),
	}),
});

export const teacherContract = oc.router({
	list: oc.output(SuccessResponseSchema(z.array(TeacherSchemaOutput))),
});

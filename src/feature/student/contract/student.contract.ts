import { oc } from "@orpc/contract";
import z from "zod";
import { SuccessResponseSchema } from "../../../server/orpc/utils";

export const StudentSchema = z.object({
	id: z.string(),
	name: z.string().min(2, "Name must be at least 2 characters"),
	email: z.string().email("Invalid email address"),
	schoolId: z.string().nullable(),
	role: z.string().optional().nullable(),

	// Personal
	image: z.string().optional().nullable(),
	dob: z.date().optional().nullable(),
	gender: z.enum(["MALE", "FEMALE", "OTHER"]).optional().nullable(),
	bloodGroup: z.string().optional().nullable(),
	address: z.string().optional().nullable(),

	// Guardian
	guardianName: z.string().optional().nullable(),
	guardianPhone: z.string().optional().nullable(),
	guardianEmail: z.string().email().optional().nullable(),
	guardianRelation: z.string().optional().nullable(),

	// Academic
	admissionNumber: z.string().optional().nullable(),
	rollNumber: z.string().optional().nullable(),
	joiningDate: z.date().optional().nullable(),
	sectionId: z.string().optional().nullable(),

	createdAt: z.date(),
	updatedAt: z.date(),
});

/**
 * Student contract definitions.
 * Defines schemas for student management operations.
 */
export const studentContract = oc.router({
	create: oc
		.input(
			StudentSchema.omit({
				id: true,
				createdAt: true,
				updatedAt: true,
				role: true,
			}),
		)
		.output(SuccessResponseSchema(StudentSchema)),
	list: oc
		.input(z.object({ schoolId: z.string() }))
		.output(SuccessResponseSchema(z.array(StudentSchema))),
	delete: oc
		.input(z.object({ id: z.string() }))
		.output(SuccessResponseSchema(z.any())),
});

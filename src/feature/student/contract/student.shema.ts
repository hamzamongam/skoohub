import z from "zod";

export const StudentSchema = z.object({
	id: z.string(),
	name: z.string().min(2, "Name must be at least 2 characters"),
	email: z.string().email("Invalid email address"),
	schoolId: z.string().nullable(),
	role: z.string().optional().nullable(),
	isActive: z.boolean().optional().default(true),

	// Personal
	image: z.union([z.file(), z.string()]).optional().nullable(),
	dob: z.date().optional().nullable(),
	gender: z.enum(["MALE", "FEMALE", "OTHER"]).optional().nullable(),
	bloodGroup: z.string().optional().nullable(),
	address: z.string().optional().nullable(),
	phone: z.string().optional().nullable(),
	fatherName: z.string().optional().nullable(),
	motherName: z.string().optional().nullable(),

	// Guardian
	guardianName: z.string().optional().nullable(),
	guardianPhone: z.string().optional().nullable(),
	guardianEmail: z.string().email().optional().nullable(),
	guardianRelation: z.string().optional().nullable(),

	// Academic
	admissionNumber: z.string().optional().nullable(),
	rollNumber: z.string().optional().nullable(),
	joiningDate: z.date().optional().nullable(),
	classId: z.string().optional().nullable(),

	createdAt: z.date(),
	updatedAt: z.date(),
});

export const StudentSchemaInput = StudentSchema.omit({
	isActive: true,
	id: true,
	createdAt: true,
	updatedAt: true,
	role: true,
	schoolId: true,
});

export const StudentSchemaUpdateInput = StudentSchemaInput.extend({
	id: z.string(),
});

export const StudentSchemaOutput = StudentSchema.extend({
	class: z.object({
		id: z.string(),
		name: z.string(),
	}),
});

export type StudentSchemaInputType = z.infer<typeof StudentSchemaInput>;
export type StudentSchemaOutputType = z.infer<typeof StudentSchemaOutput>;

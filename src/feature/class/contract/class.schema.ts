import { z } from "zod";

export const ClassSchemaInput = z.object({
	name: z.string().min(1, "Name is required"), // e.g., "XA" or "10-A"
	grade: z.string().min(1, "Grade is required"), // e.g., "10"
	section: z.string().min(1, "Section is required"),
	// e.g., "A"
	medium: z.enum([
		"English",
		"Malayalam",
		"Tamil",
		"Hindi",
		"Urdu",
		"Arabic",
		"Other",
	]),
	classTeacherId: z.string().nullable().optional(),
	capacity: z.number().min(1, "Capacity must be at least 1"),
	isActive: z.boolean().default(true),
});

export const ClassSchemaOutput = ClassSchemaInput.extend({
	totalStudents: z.number(),
	id: z.string(),
	classTeacherName: z.string(),
	schoolId: z.string(),
	createdAt: z.date(),
	updatedAt: z.date(),
	capacity: z.number().nullable(),
	isActive: z.boolean().nullable(),
});

export type ClassSchemaInputType = z.infer<typeof ClassSchemaInput>;
export type ClassSchemaOutputType = z.infer<typeof ClassSchemaOutput>;

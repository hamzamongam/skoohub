import z from "zod";

export const AcademicStructureSchema = z.object({
	yearName: z.string().min(4),
	startDate: z.string().transform((v) => new Date(v)),
	endDate: z.string().transform((v) => new Date(v)),
	terms: z
		.array(
			z.object({
				name: z.string(),
				startDate: z.string().transform((v) => new Date(v)),
				endDate: z.string().transform((v) => new Date(v)),
			}),
		)
		.optional()
		.default([]),
	gradingSystem: z.enum(["GPA", "PERCENTAGE", "LETTER"]),
});

export const ClassSetupSchema = z.object({
	grades: z
		.array(
			z.object({
				name: z.string(),
				level: z.number(),
				sections: z.array(z.string()).min(1),
			}),
		)
		.min(1),
});

export const StaffInvitationSchema = z.object({
	emails: z.array(z.string().email()).min(1),
});

export type AcademicStructureInput = z.infer<typeof AcademicStructureSchema>;
export type ClassSetupInput = z.infer<typeof ClassSetupSchema>;
export type StaffInvitationInput = z.infer<typeof StaffInvitationSchema>;

import type { UserRole } from "prisma/generated/client";
import { prisma } from "@/db/prisma";

export class StudentRepository {
	/**
	 * Creates a new student user.
	 * Manually sets ID and timestamps since we aren't using the auth signup flow.
	 */
	async create(data: {
		name: string;
		email: string;
		schoolId: string | null;
		role: UserRole;
		// Profile fields keys
		dob?: Date | null;
		gender?: "MALE" | "FEMALE" | "OTHER" | null;
		bloodGroup?: string | null;
		address?: string | null;
		guardianName?: string | null;
		guardianPhone?: string | null;
		guardianEmail?: string | null;
		guardianRelation?: string | null;
		admissionNumber?: string | null;
		rollNumber?: string | null;
		joiningDate?: Date | null;
		sectionId?: string | null;
		image?: string | null;
	}) {
		const {
			name,
			email,
			schoolId,
			role,
			image, // User fields
			// Profile fields
			dob,
			gender,
			bloodGroup,
			address,
			guardianName,
			guardianPhone,
			guardianEmail,
			guardianRelation,
			admissionNumber,
			rollNumber,
			joiningDate,
			sectionId,
		} = data;

		return await prisma.user.create({
			data: {
				id: crypto.randomUUID(),
				name,
				email,
				schoolId,
				role,
				image,
				emailVerified: false,
				createdAt: new Date(),
				updatedAt: new Date(),
				studentProfile: {
					create: {
						dob,
						gender: gender as any, // Cast to enum
						bloodGroup,
						address,
						guardianName,
						guardianPhone,
						guardianEmail,
						guardianRelation,
						admissionNumber,
						rollNumber,
						joiningDate,
						sectionId,
					},
				},
			},
			include: {
				studentProfile: true,
			},
		});
	}

	/**
	 * Lists all students belonging to a specific school.
	 */
	async findAllBySchoolId(schoolId: string) {
		return await prisma.user.findMany({
			where: {
				schoolId,
				role: "student",
			},
			orderBy: {
				createdAt: "desc",
			},
		});
	}

	/**
	 * Deletes a student by their ID.
	 */
	async delete(id: string) {
		return await prisma.user.delete({
			where: { id },
		});
	}

	async findByEmail(email: string) {
		return await prisma.user.findUnique({
			where: { email },
		});
	}
}

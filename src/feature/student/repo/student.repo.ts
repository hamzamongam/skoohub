// student.repo.ts

import type { Prisma } from "prisma/generated/client";
import { prisma } from "@/db/prisma";

export class StudentRepository {
	async create(data: Prisma.StudentProfileUncheckedCreateInput) {
		return prisma.studentProfile.create({
			data,
			include: { user: true, class: true },
		});
	}

	async update(
		userId: string,
		data: Prisma.StudentProfileUncheckedUpdateInput & {
			image?: string | null;
			imageKey?: string | null;
			name?: string;
		},
	) {
		// Separate user data from profile data
		const { image, name, imageKey, userId: _u, ...profileData } = data;

		// 1. Update User if needed
		if (name !== undefined || image !== undefined) {
			await prisma.user.update({
				where: { id: userId },
				data: {
					name,
					...(image !== undefined && { image }),
				},
			});
		}

		// 2. Update StudentProfile
		return await prisma.studentProfile.update({
			where: { userId },
			data: {
				...profileData,
				imageKey,
			},
			include: { user: true, class: true },
		});

		// Return full user with profile
		// return this.findUserById(userId);
	}

	async findStudentById(id: string) {
		return prisma.studentProfile.findUnique({
			where: { userId: id },
			include: { user: true, class: true },
		});
	}

	async findByEmail(email: string) {
		return prisma.user.findUnique({
			where: { email },
			include: { studentProfile: true },
		});
	}

	async listBySchoolId(schoolId: string) {
		return prisma.studentProfile.findMany({
			where: {
				user: {
					schoolId,
					role: "student",
				},
			},
			orderBy: { user: { createdAt: "desc" } },
			include: { user: true, class: true },
		});
	}

	async deleteUser(id: string) {
		return prisma.user.delete({
			where: { id },
		});
	}
}

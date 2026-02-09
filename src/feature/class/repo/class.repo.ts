import type { Prisma } from "prisma/generated/client";
import { prisma } from "@/db/prisma";

export class ClassRepository {
	async create(data: Prisma.ClassUncheckedCreateInput) {
		return prisma.class.create({
			data,
			include: {
				classTeacher: {
					include: {
						user: true,
					},
				},
				_count: {
					select: {
						students: true,
					},
				},
			},
		});
	}

	async update(id: string, data: Prisma.ClassUncheckedUpdateInput) {
		return prisma.class.update({
			where: { id },
			data,
			include: {
				classTeacher: {
					include: {
						user: true,
					},
				},
				_count: {
					select: {
						students: true,
					},
				},
			},
		});
	}

	async delete(id: string) {
		return prisma.class.delete({
			where: { id },
		});
	}

	async findById(id: string) {
		return prisma.class.findUnique({
			where: { id },
			include: {
				classTeacher: {
					include: {
						user: true,
					},
				},
				_count: {
					select: {
						students: true,
					},
				},
			},
		});
	}

	async listBySchoolId(schoolId: string) {
		return prisma.class.findMany({
			where: { schoolId },
			orderBy: { grade: "asc" }, // You might want to sort by grade level logic later
			include: {
				classTeacher: {
					include: {
						user: true,
					},
				},
				_count: {
					select: {
						students: true,
					},
				},
			},
		});
	}
}

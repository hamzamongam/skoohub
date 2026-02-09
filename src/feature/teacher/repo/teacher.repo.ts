import { prisma } from "@/db/prisma";

export class TeacherRepository {
	async list(schoolId: string) {
		return prisma.teacher.findMany({
			where: { schoolId },
			include: { user: true },
		});
	}
}

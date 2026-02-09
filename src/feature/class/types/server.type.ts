import type { Prisma } from "prisma/generated/client";

export type ClassDbModel = Prisma.ClassGetPayload<{
	include: {
		classTeacher: {
			include: {
				user: true;
			};
		};
		_count: {
			select: {
				students: true;
			};
		};
	};
}>;

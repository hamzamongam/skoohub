import type { Prisma } from "prisma/generated/client";

export type StudentModel = Prisma.StudentProfileGetPayload<{
	include: {
		user: true;
		class: true;
	};
}>;

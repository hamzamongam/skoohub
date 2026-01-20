import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { customSession } from "better-auth/plugins";
import type { UserRole } from "prisma/generated/enums";
import { prisma } from "@/db/prisma";
import { tanstackStartCookie } from "./plugin/tanstack-start-cookies";
export const auth = betterAuth({
	emailAndPassword: {
		enabled: true,
	},
	database: prismaAdapter(prisma, {
		provider: "postgresql",
	}),
	plugins: [
		tanstackStartCookie(),
		customSession(async ({ user, session }) => {
			const dbUser = await prisma.user.findUnique({
				where: {
					id: user.id,
				},
				select: {
					schoolId: true,
					role: true,
					school: { select: { onboardingStatus: true } },
				},
			});
			return {
				user: {
					...user,
					onboardingStatus: dbUser?.school?.onboardingStatus ?? "PENDING",
					role: dbUser?.role as UserRole,
					schoolId: dbUser?.schoolId,
				},
				session,
			};
		}),
		// emailPassword(),
	],
	user: {
		additionalFields: {
			schoolId: {
				type: "string",
				required: false,
			},
			role: {
				type: ["schoolAdmin", "user", "teacher", "student", "superAdmin"],
				required: true,
			},
		},
	},
});

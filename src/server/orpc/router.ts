import { authRouter } from "@/feature/auth/procedure/auth.router";
import { onboardingRouter } from "@/feature/onboarding/procedure/onboarding.router";
import { schoolRouter } from "@/feature/school/procedure/school.router";
import { studentRouter } from "@/feature/student/procedure/student.router";

export const router = {
	auth: authRouter,
	school: schoolRouter,
	onboarding: onboardingRouter,
	student: studentRouter,
};

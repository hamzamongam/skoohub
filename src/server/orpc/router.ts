import { authRouter } from "@/feature/auth/procedure/auth.router";
import { classRouter } from "@/feature/class/procedure/class.router";
import { onboardingRouter } from "@/feature/onboarding/procedure/onboarding.router";
import { schoolRouter } from "@/feature/school/procedure/school.router";
import { studentRouter } from "@/feature/student/procedure/student.router";
import { teacherRouter } from "@/feature/teacher/procedure/teacher.router";
import { attendanceRouter } from "@/feature/attendance/procedure/attendance.router";
import { examRouter } from "@/feature/exam/procedure/exam.router";
import { billingRouter } from "@/feature/billing/procedure/billing.router";

export const router = {
	auth: authRouter,
	school: schoolRouter,
	onboarding: onboardingRouter,
	student: studentRouter,
	class: classRouter,
	teacher: teacherRouter,
	attendance: attendanceRouter,
	exam: examRouter,
	billing: billingRouter,
};


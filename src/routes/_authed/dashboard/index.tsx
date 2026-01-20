import { useSuspenseQuery } from "@tanstack/react-query";
import {
	createFileRoute,
	useNavigate,
	useRouter,
} from "@tanstack/react-router";
import { userQueryOptions } from "@/feature/auth/auth.functions";
import OnboardingModal from "@/feature/onboarding/ui/OnboardingModal";

export const Route = createFileRoute("/_authed/dashboard/")({
	component: DashboardSwitcher,
	staticData: {
		breadcrumb: "Overview",
	},
});

function DashboardSwitcher() {
	const router = useRouter();
	const { data: session } = useSuspenseQuery(userQueryOptions());
	// const user = context.user as any; // Cast to access injected onboardingStatus
	// const [role] = useState<"admin" | "teacher" | "student">("admin");
	// const isShowModal =
	// 	context.user.role === "schoolAdmin" &&
	// 	context.user.onboardingStatus === "PENDING";

	const showOnboarding =
		session?.user.onboardingStatus === "PENDING" &&
		session?.user.role === "schoolAdmin";

	return (
		<>
			{showOnboarding && (
				<OnboardingModal
					open={true}
					onComplete={() => {
						router.invalidate();
					}}
				/>
			)}
			{/* {role === "admin" && <AdminDashboardView />}
			{role === "teacher" && <TeacherDashboardView />}
			{role === "student" && <StudentDashboardView />} */}
		</>
	);
}

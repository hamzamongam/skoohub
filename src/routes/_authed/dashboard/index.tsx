import { useSuspenseQuery } from "@tanstack/react-query";
import {
	createFileRoute,
	useNavigate,
	useRouter,
} from "@tanstack/react-router";
import { userQueryOptions } from "@/feature/auth/auth.functions";
import { useAuth } from "@/feature/auth/hooks/useAuth";
import AdminDashboardView from "@/feature/dashboard/ui/views/AdminDashboardView";
import StudentDashboardView from "@/feature/dashboard/ui/views/StudentDashboardView";
import OnboardingModal from "@/feature/onboarding/ui/OnboardingModal";

export const Route = createFileRoute("/_authed/dashboard/")({
	component: DashboardSwitcher,
	staticData: {
		breadcrumb: "Overview",
	},
});

function DashboardSwitcher() {
	const router = useRouter();
	const { session } = useAuth();
	const dd = Route.useRouteContext();
	const role = session?.user.role;
	// const user = context.user as any; // Cast to access injected onboardingStatus
	// const [role] = useState<"admin" | "teacher" | "student">("admin");
	// const isShowModal =
	// 	context.user.role === "schoolAdmin" &&
	// 	context.user.onboardingStatus === "PENDING";

	// const showOnboarding =
	// 	session?.user.onboardingStatus === "PENDING" &&
	// 	session?.user.role === "schoolAdmin";

	return (
		<>
			{/* {showOnboarding && (
				<OnboardingModal
					open={true}
					onComplete={() => {
						router.invalidate();
					}}
				/>
			)} */}
			{role === "student" && <StudentDashboardView />}
			{role === "schoolAdmin" && <AdminDashboardView />}
			{/* 
			{role === "teacher" && <TeacherDashboardView />}
			*/}
		</>
	);
}

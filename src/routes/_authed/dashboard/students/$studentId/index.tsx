import { createFileRoute } from "@tanstack/react-router";
import StudentDetailView from "@/feature/student/ui/views/StudentDetailView";

export const Route = createFileRoute("/_authed/dashboard/students/$studentId/")(
	{
		component: RouteComponent,
	},
);

function RouteComponent() {
	const { studentId } = Route.useParams();
	return <StudentDetailView studentId={studentId} />;
}

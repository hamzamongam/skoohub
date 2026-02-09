import { createFileRoute } from "@tanstack/react-router";
import { EditStudentSkeleton } from "@/feature/student/ui/skeletons/EditStudentSkeleton";
import EditStudentView from "@/feature/student/ui/views/EditStudentView";
import { orpc } from "@/server/orpc/client";

export const Route = createFileRoute(
	"/_authed/dashboard/students/$studentId/edit",
)({
	component: RouteComponent,
	staticData: {
		breadcrumb: "Edit Student",
	},
	pendingComponent: EditStudentSkeleton,
	loader: async ({ context, params }) => {
		const { studentId } = params;
		context.queryClient.ensureQueryData(
			orpc.student.get.queryOptions({
				input: {
					id: studentId,
				},
			}),
		);
	},
});

function RouteComponent() {
	const { studentId } = Route.useParams();
	return <EditStudentView studentId={studentId} />;
}

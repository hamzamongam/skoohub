import { createFileRoute } from "@tanstack/react-router";
import AttendanceView from "@/feature/attendance/ui/views/AttendanceView";

export const Route = createFileRoute("/_authed/dashboard/students/attendance")({
	component: RouteComponent,
});

function RouteComponent() {
	return <AttendanceView />;
}

import { createFileRoute } from "@tanstack/react-router";
import CreateStudentView from "@/feature/student/ui/views/CreateStudentView";

export const Route = createFileRoute("/_authed/dashboard/students/add")({
	component: CreateStudentView,
	staticData: {
		breadcrumb: "Register Student",
	},
});

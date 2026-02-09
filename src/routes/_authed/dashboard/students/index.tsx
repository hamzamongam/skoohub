"use client";

import { createFileRoute } from "@tanstack/react-router";
import StudentListView from "@/feature/student/ui/views/StudentListView";

export const Route = createFileRoute("/_authed/dashboard/students/")({
	component: RouteComponent,

	loader: async () => {
		return {
			schoolId: "1",
		};
	},
});

function RouteComponent() {
	return <StudentListView />;
}

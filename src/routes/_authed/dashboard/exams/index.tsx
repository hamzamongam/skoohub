import { createFileRoute } from "@tanstack/react-router";
import ExamListView from "@/feature/exam/ui/views/ExamListView";

export const Route = createFileRoute("/_authed/dashboard/exams/")({
	component: RouteComponent,
});

function RouteComponent() {
	return <ExamListView />;
}


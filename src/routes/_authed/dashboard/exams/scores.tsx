import { createFileRoute } from "@tanstack/react-router";
import EnterScoresView from "@/feature/exam/ui/views/EnterScoresView";

export const Route = createFileRoute("/_authed/dashboard/exams/scores")({
	component: RouteComponent,
});

function RouteComponent() {
	return <EnterScoresView />;
}

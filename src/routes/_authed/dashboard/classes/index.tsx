import { createFileRoute } from "@tanstack/react-router";
import { ClassListView } from "@/feature/class/ui/views/ClassListView";

export const Route = createFileRoute("/_authed/dashboard/classes/")({
	component: RouteComponent,
});

function RouteComponent() {
	return <ClassListView />;
}

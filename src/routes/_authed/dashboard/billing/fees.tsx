import { createFileRoute } from "@tanstack/react-router";
import FeeCategoriesView from "@/feature/billing/ui/views/FeeCategoriesView";

export const Route = createFileRoute("/_authed/dashboard/billing/fees")({
	component: RouteComponent,
	staticData: {
		breadcrumb: "Fee Categories",
	},
});

function RouteComponent() {
	return <FeeCategoriesView />;
}

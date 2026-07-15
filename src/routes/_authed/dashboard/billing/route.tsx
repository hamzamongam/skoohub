import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_authed/dashboard/billing")({
	component: RouteComponent,
	staticData: {
		breadcrumb: "Billing & Fees",
	},
});

function RouteComponent() {
	return <Outlet />;
}

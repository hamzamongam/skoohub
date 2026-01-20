import { createFileRoute, Outlet } from "@tanstack/react-router";
import DashboardLayout from "@/components/layout/dashboard-layout";

export const Route = createFileRoute("/_authed/dashboard")({
	component: RouteComponent,
	staticData: {
		breadcrumb: "Dashboard",
	},
});

function RouteComponent() {
	return (
		<DashboardLayout>
			<Outlet />
		</DashboardLayout>
	);
}

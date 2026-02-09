import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_authed/dashboard/students")({
	component: RouteComponent,
	staticData: {
		breadcrumb: "Students",
	},
});

function RouteComponent() {
	return <Outlet />;
}

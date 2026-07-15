import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_authed/dashboard/exams")({
	component: RouteComponent,
	staticData: {
		breadcrumb: "Exams",
	},
});

function RouteComponent() {
	return <Outlet />;
}

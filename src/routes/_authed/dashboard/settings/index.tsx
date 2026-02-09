import { createFileRoute } from "@tanstack/react-router";
import SettingsView from "@/feature/settings/ui/view/SettingsView";

export const Route = createFileRoute("/_authed/dashboard/settings/")({
	component: RouteComponent,
});

function RouteComponent() {
	return <SettingsView />;
}

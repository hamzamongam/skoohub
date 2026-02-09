import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import InviteAcceptView from "@/feature/auth/ui/views/InviteAcceptView";

export const Route = createFileRoute("/auth/invite/accept")({
	validateSearch: z.object({
		token: z.string().min(1),
	}),
	component: RouteComponent,
});

function RouteComponent() {
	const { token } = Route.useSearch();
	return <InviteAcceptView token={token} />;
}

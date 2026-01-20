import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { AuthLoginView } from "@/feature/auth/ui/views";

const searchSchema = z.object({
	redirect: z.string().optional(),
});

export const Route = createFileRoute("/_auth/login")({
	validateSearch: searchSchema,
	component: RouteComponent,
});

function RouteComponent() {
	const search = Route.useSearch();
	return <AuthLoginView redirectUrl={search.redirect} />;
}

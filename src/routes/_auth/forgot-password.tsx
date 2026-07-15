import { createFileRoute } from "@tanstack/react-router";
import { AuthForgotPasswordView } from "@/feature/auth/ui/views";

export const Route = createFileRoute("/_auth/forgot-password")({
	component: RouteComponent,
});

function RouteComponent() {
	return <AuthForgotPasswordView />;
}

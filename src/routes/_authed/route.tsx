import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_authed")({
	async beforeLoad({ context, location }) {
		if (!context.session) {
			throw redirect({
				to: "/login",
				search: {
					redirect: location.href,
				},
			});
		}

		if (
			context.session.user.role === "schoolAdmin" &&
			context.session.user.onboardingStatus === "PENDING"
		) {
			throw redirect({
				to: "/onboarding",
			});
		}
	},
});

import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth")({
	async beforeLoad({ context }) {
		if (context.session) {
			throw redirect({
				to: "/dashboard",
			});
		}
	},
});

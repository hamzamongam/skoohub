import { createFileRoute, useRouteContext } from "@tanstack/react-router";

export const Route = createFileRoute("/test")({
	component: RouteComponent,
});

function RouteComponent() {
	const { session } = useRouteContext({ from: "__root__" });
	return (
		<div>
			Hello Check
			<pre>{JSON.stringify(session, null, 2)}</pre>
		</div>
	);
}

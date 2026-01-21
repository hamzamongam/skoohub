import { TanStackDevtools } from "@tanstack/react-devtools";
import type { QueryClient } from "@tanstack/react-query";
import {
	createRootRouteWithContext,
	HeadContent,
	Scripts,
} from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { Toaster } from "sonner";
import type { AuthSession } from "@/feature/auth/auth.functions";
import { userQueryOptions } from "@/feature/auth/auth.functions";
import { siteStatusQueryOptions } from "@/feature/site/site.server";
import { ThemeProvider } from "../components/providers/ThemeProvider";
import TanStackQueryDevtools from "../integrations/tanstack-query/devtools";
import appCss from "../styles.css?url";
import { ComingSoon } from "./coming-soon";

interface MyRouterContext {
	queryClient: QueryClient;
	session: AuthSession | null;
	siteStatus: { isComingSoon: boolean };
}

declare module "@tanstack/react-router" {
	interface StaticDataRouteOption {
		breadcrumb?: string;
	}
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
	beforeLoad: async ({ context }) => {
		const session = await context.queryClient.ensureQueryData(
			userQueryOptions(),
		);
		const siteStatus = await context.queryClient.ensureQueryData(
			siteStatusQueryOptions(),
		);

		return {
			session,
			siteStatus,
		};
	},
	head: () => ({
		meta: [
			{
				charSet: "utf-8",
			},
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1",
			},
			{
				title: "Skoohub - #1 School Management System in Kerala",
			},
			{
				name: "description",
				content:
					"Skoohub is the best school management system web application in Kerala, designed to streamline administration, enhance student learning, and improve parent engagement.",
			},
			{
				name: "keywords",
				content:
					"kerala best school management system, school management software kerala, education software, student information system, skoohub, school admin, edtech, malayalam school software",
			},
		],
		links: [
			{
				rel: "icon",
				type: "image/svg+xml",
				href: "/favicon.svg",
			},
			{
				rel: "stylesheet",
				href: appCss,
			},
		],
	}),

	shellComponent: RootDocument,
});

function RootDocument({ children }: { children: React.ReactNode }) {
	const context = Route.useRouteContext();
	return (
		<html lang="en" suppressHydrationWarning>
			<head>
				<HeadContent />
			</head>
			<body>
				<ThemeProvider attribute="class" defaultTheme="system" enableSystem>
					{context.siteStatus?.isComingSoon ? <ComingSoon /> : children}
					<Toaster richColors closeButton position="top-center" />
				</ThemeProvider>
				<TanStackDevtools
					// ...
					config={{
						position: "bottom-right",
					}}
					plugins={[
						{
							name: "Tanstack Router",
							render: <TanStackRouterDevtoolsPanel />,
						},
						TanStackQueryDevtools,
					]}
				/>
				<Scripts />
			</body>
		</html>
	);
}

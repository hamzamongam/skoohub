import { queryOptions } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";

export const getSiteStatus = createServerFn({
	method: "GET",
}).handler(async () => {
	// Check for server-side environment variable (runtime)
	// Fallback to VITE_ prefix if needed, though strictly process.env is preferred for server runtime
	const isComingSoon =
		process.env.SHOW_COMING_SOON === "true" ||
		process.env.VITE_SHOW_COMING_SOON === "true";

	return {
		isComingSoon,
	};
});

export const siteStatusQueryOptions = () =>
	queryOptions({
		queryKey: ["site-status"],
		queryFn: () => getSiteStatus(),
	});

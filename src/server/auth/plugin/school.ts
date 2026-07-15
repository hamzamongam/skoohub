import type { BetterAuthPlugin } from "better-auth";
import { createAuthEndpoint } from "better-auth/api";
import { z } from "zod";

export const schoolPlugin = () => {
	return {
		id: "school",
		$Infer: { getHelloWorld: "" },
		init: () => {},
		endpoints: {
			createSchool: createAuthEndpoint(
				"/school/create",
				{
					method: "POST",
					body: z.object({}),
				},
				async (ctx) => {
					return ctx.json({
						message: "Hello World",
					});
				},
			),
		},
	} satisfies BetterAuthPlugin;
};

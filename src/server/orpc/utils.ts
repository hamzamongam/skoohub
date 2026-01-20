import { ORPCError } from "@orpc/server";
import { APIError } from "better-auth";
import { ZodError, z } from "zod";
import { logger } from "@/lib/logger";
import { AppError } from "@/utils/errors";

/**
 * Standard API response structure for all successful operations.
 */
export const SuccessResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
	z.object({
		success: z.literal(true),
		message: z.string().optional(),
		data: dataSchema,
	});

export type SuccessResponse<T> = {
	success: true;
	message?: string;
	data: T;
};

/**
 * onGlobalError is a global error mapping interceptor.
 * It catches domain-level AppErrors and maps them to ORPCErrors.
 *
 * We use an explicit interceptor pattern here to ensure compatibility
 * with both OpenAPIHandler and RPCHandler types.
 */
// biome-ignore lint/suspicious/noExplicitAny: interceptor returns unknown result
export const onGlobalError = async ({ next }: { next: () => Promise<any> }) => {
	try {
		return await next();
	} catch (error) {
		if (error instanceof AppError) {
			logger.warn(
				{
					error: error.code,
					message: error.message,
					details: error.details,
				},
				"Application error occurred",
			);
			// biome-ignore lint/suspicious/noExplicitAny: map app error code to orpc error code
			throw new ORPCError(error.code as any, {
				message: error.message,
				data: error.details,
			});
		}
		if (error instanceof APIError) {
			logger.warn(
				{
					errors: error.message,
				},
				"Btter Auth  error occurred",
			);
			throw new ORPCError("BAD_REQUEST", {
				message: "Validation failed",
				data: error.message ?? "Som",
			});
		}

		if (error instanceof ZodError) {
			logger.warn(
				{
					errors: error.flatten().fieldErrors,
				},
				"Validation error occurred",
			);
			throw new ORPCError("BAD_REQUEST", {
				message: "Validation failed",
				data: error.flatten().fieldErrors,
			});
		}

		// Log unexpected errors
		logger.error({ error }, "Unexpected error occurred");
		throw error;
	}
};

/**
 * Helper to wrap data into a standardized successful API response.
 */
export function toSuccessResponse<T>(
	data: T,
	message = "Action completed successfully",
): SuccessResponse<T> {
	return {
		success: true,
		message,
		data,
	};
}

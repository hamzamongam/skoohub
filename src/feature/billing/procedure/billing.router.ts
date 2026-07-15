import { implement, ORPCError } from "@orpc/server";
import type { Context } from "../../../server/orpc/context";
import { requiredAuthMiddleware } from "../../../server/orpc/middleware";
import { toSuccessResponse } from "../../../server/orpc/utils";
import { billingContract } from "../contract/billing.contract";
import { BillingRepository } from "../repo/billing.repo";
import { BillingService } from "../services/billing.service";

const repo = new BillingRepository();
const service = new BillingService(repo);
const os = implement(billingContract).$context<Context>();

export const billingRouter = os.router({
	createFeeCategory: os.createFeeCategory
		.use(requiredAuthMiddleware)
		.handler(async ({ input, context }) => {
			if (!context.schoolId) {
				throw new ORPCError("BAD_REQUEST", {
					message: "User not linked to a school",
				});
			}
			const result = await service.createFeeCategory(context.schoolId, input);
			return toSuccessResponse(result);
		}),
	listFeeCategories: os.listFeeCategories
		.use(requiredAuthMiddleware)
		.handler(async ({ context }) => {
			if (!context.schoolId) {
				throw new ORPCError("BAD_REQUEST", {
					message: "User not linked to a school",
				});
			}
			const result = await service.listFeeCategories(context.schoolId);
			return toSuccessResponse(result);
		}),
	deleteFeeCategory: os.deleteFeeCategory
		.use(requiredAuthMiddleware)
		.handler(async ({ input, context }) => {
			if (!context.schoolId) {
				throw new ORPCError("BAD_REQUEST", {
					message: "User not linked to a school",
				});
			}
			const result = await service.deleteFeeCategory(context.schoolId, input.id);
			return toSuccessResponse(result);
		}),
	createInvoice: os.createInvoice
		.use(requiredAuthMiddleware)
		.handler(async ({ input, context }) => {
			if (!context.schoolId) {
				throw new ORPCError("BAD_REQUEST", {
					message: "User not linked to a school",
				});
			}
			const result = await service.createInvoice(context.schoolId, input);
			return toSuccessResponse(result);
		}),
	listInvoices: os.listInvoices
		.use(requiredAuthMiddleware)
		.handler(async ({ input, context }) => {
			if (!context.schoolId) {
				throw new ORPCError("BAD_REQUEST", {
					message: "User not linked to a school",
				});
			}
			const result = await service.listInvoices(context.schoolId, input);
			return toSuccessResponse(result);
		}),
	getInvoiceDetails: os.getInvoiceDetails
		.use(requiredAuthMiddleware)
		.handler(async ({ input, context }) => {
			if (!context.schoolId) {
				throw new ORPCError("BAD_REQUEST", {
					message: "User not linked to a school",
				});
			}
			const result = await service.getInvoiceDetails(context.schoolId, input.id);
			return toSuccessResponse(result);
		}),
	recordPayment: os.recordPayment
		.use(requiredAuthMiddleware)
		.handler(async ({ input, context }) => {
			if (!context.schoolId) {
				throw new ORPCError("BAD_REQUEST", {
					message: "User not linked to a school",
				});
			}
			const result = await service.recordPayment(context.schoolId, input);
			return toSuccessResponse(result);
		}),
});

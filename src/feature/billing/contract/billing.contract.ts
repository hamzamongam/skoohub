import { oc } from "@orpc/contract";
import { z } from "zod";
import { SuccessResponseSchema } from "@/server/orpc/utils";
import {
	CreateFeeCategoryInputSchema,
	CreateInvoiceInputSchema,
	FeeCategoryResponseSchema,
	InvoiceDetailsResponseSchema,
	InvoiceResponseSchema,
	ListInvoicesInputSchema,
	PaymentResponseSchema,
	RecordPaymentInputSchema,
} from "./billing.schema";

export const billingContract = oc.router({
	createFeeCategory: oc
		.input(CreateFeeCategoryInputSchema)
		.output(SuccessResponseSchema(FeeCategoryResponseSchema)),
	listFeeCategories: oc.output(
		SuccessResponseSchema(z.array(FeeCategoryResponseSchema)),
	),
	deleteFeeCategory: oc
		.input(z.object({ id: z.string().min(1, "ID is required") }))
		.output(SuccessResponseSchema(z.null())),
	createInvoice: oc
		.input(CreateInvoiceInputSchema)
		.output(SuccessResponseSchema(z.array(InvoiceResponseSchema))),
	listInvoices: oc
		.input(ListInvoicesInputSchema)
		.output(SuccessResponseSchema(z.array(InvoiceResponseSchema))),
	getInvoiceDetails: oc
		.input(z.object({ id: z.string().min(1, "Invoice ID is required") }))
		.output(SuccessResponseSchema(InvoiceDetailsResponseSchema)),
	recordPayment: oc
		.input(RecordPaymentInputSchema)
		.output(SuccessResponseSchema(PaymentResponseSchema)),
});

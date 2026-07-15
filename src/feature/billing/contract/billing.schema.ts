import { z } from "zod";

export const CreateFeeCategoryInputSchema = z.object({
	name: z.string().min(1, "Name is required"),
	description: z.string().nullable().optional(),
	amount: z.number().min(0, "Amount must be a positive number"),
});

export const FeeCategoryResponseSchema = z.object({
	id: z.string(),
	name: z.string(),
	description: z.string().nullable(),
	amount: z.number(),
	createdAt: z.date(),
	updatedAt: z.date(),
});

export const CreateInvoiceInputSchema = z.object({
	dueDate: z.string().min(1, "Due date is required"), // YYYY-MM-DD
	academicYearId: z.string().min(1, "Academic Year is required"),
	studentId: z.string().optional(), // For single student invoice
	classId: z.string().optional(), // For bulk class invoice generation
	feeCategoryIds: z
		.array(z.string())
		.min(1, "At least one fee category must be selected"),
});

export const ListInvoicesInputSchema = z.object({
	status: z.enum(["UNPAID", "PARTIALLY_PAID", "PAID", "OVERDUE"]).optional(),
	studentId: z.string().optional(),
	classId: z.string().optional(),
	academicYearId: z.string().optional(),
});

export const InvoiceItemResponseSchema = z.object({
	id: z.string(),
	feeCategoryId: z.string(),
	name: z.string(),
	amount: z.number(),
});

export const PaymentResponseSchema = z.object({
	id: z.string(),
	amount: z.number(),
	paymentDate: z.date(),
	paymentMethod: z.enum(["CASH", "BANK_TRANSFER", "CARD", "ONLINE"]),
	reference: z.string().nullable(),
	remarks: z.string().nullable(),
	invoiceId: z.string(),
	createdAt: z.date(),
});

export const InvoiceResponseSchema = z.object({
	id: z.string(),
	invoiceNumber: z.string(),
	dueDate: z.date(),
	status: z.enum(["UNPAID", "PARTIALLY_PAID", "PAID", "OVERDUE"]),
	studentId: z.string(),
	studentName: z.string(),
	className: z.string().nullable(),
	amount: z.number(),
	paidAmount: z.number(),
	createdAt: z.date(),
	updatedAt: z.date(),
});

export const InvoiceDetailsResponseSchema = z.object({
	id: z.string(),
	invoiceNumber: z.string(),
	dueDate: z.date(),
	status: z.enum(["UNPAID", "PARTIALLY_PAID", "PAID", "OVERDUE"]),
	studentId: z.string(),
	studentName: z.string(),
	rollNumber: z.string().nullable(),
	className: z.string().nullable(),
	academicYearId: z.string(),
	academicYearName: z.string(),
	items: z.array(InvoiceItemResponseSchema),
	payments: z.array(PaymentResponseSchema),
	amount: z.number(),
	paidAmount: z.number(),
	createdAt: z.date(),
	updatedAt: z.date(),
});

export const RecordPaymentInputSchema = z.object({
	invoiceId: z.string().min(1, "Invoice ID is required"),
	amount: z.number().gt(0, "Payment amount must be greater than zero"),
	paymentDate: z.string().min(1, "Payment date is required"), // YYYY-MM-DD
	paymentMethod: z.enum(["CASH", "BANK_TRANSFER", "CARD", "ONLINE"]),
	reference: z.string().nullable().optional(),
	remarks: z.string().nullable().optional(),
});

export type CreateFeeCategoryInput = z.infer<typeof CreateFeeCategoryInputSchema>;
export type FeeCategoryResponse = z.infer<typeof FeeCategoryResponseSchema>;
export type CreateInvoiceInput = z.infer<typeof CreateInvoiceInputSchema>;
export type ListInvoicesInput = z.infer<typeof ListInvoicesInputSchema>;
export type InvoiceItemResponse = z.infer<typeof InvoiceItemResponseSchema>;
export type PaymentResponse = z.infer<typeof PaymentResponseSchema>;
export type InvoiceResponse = z.infer<typeof InvoiceResponseSchema>;
export type InvoiceDetailsResponse = z.infer<typeof InvoiceDetailsResponseSchema>;
export type RecordPaymentInput = z.infer<typeof RecordPaymentInputSchema>;

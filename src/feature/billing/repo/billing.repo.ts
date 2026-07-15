import { prisma } from "@/db/prisma";
import type { InvoiceStatus, PaymentMethod } from "prisma/generated/client";

export class BillingRepository {
	/**
	 * Creates a new fee category for a school.
	 */
	async createFeeCategory(data: {
		name: string;
		description?: string | null;
		amount: number;
		schoolId: string;
	}) {
		return await prisma.feeCategory.create({
			data: {
				name: data.name,
				description: data.description ?? null,
				amount: data.amount,
				schoolId: data.schoolId,
			},
		});
	}

	/**
	 * Lists all fee categories for a school.
	 */
	async findFeeCategoriesBySchool(schoolId: string) {
		return await prisma.feeCategory.findMany({
			where: { schoolId },
			orderBy: { name: "asc" },
		});
	}

	/**
	 * Finds a fee category by ID.
	 */
	async findFeeCategoryById(id: string) {
		return await prisma.feeCategory.findUnique({
			where: { id },
			include: {
				invoiceItems: true,
			},
		});
	}

	/**
	 * Deletes a fee category.
	 */
	async deleteFeeCategory(id: string) {
		return await prisma.feeCategory.delete({
			where: { id },
		});
	}

	/**
	 * Fetches the last generated invoice to determine the next invoice number.
	 */
	async findLastInvoiceBySchool(schoolId: string) {
		return await prisma.invoice.findFirst({
			where: { schoolId },
			orderBy: { invoiceNumber: "desc" },
			select: { invoiceNumber: true },
		});
	}

	/**
	 * Creates a new invoice and its associated items.
	 */
	async createInvoice(data: {
		invoiceNumber: string;
		dueDate: Date;
		studentId: string;
		academicYearId: string;
		schoolId: string;
		items: {
			feeCategoryId: string;
			amount: number;
		}[];
	}) {
		return await prisma.invoice.create({
			data: {
				invoiceNumber: data.invoiceNumber,
				dueDate: data.dueDate,
				studentId: data.studentId,
				academicYearId: data.academicYearId,
				schoolId: data.schoolId,
				status: "UNPAID",
				items: {
					create: data.items.map((item) => ({
						feeCategoryId: item.feeCategoryId,
						amount: item.amount,
					})),
				},
			},
			include: {
				student: {
					include: {
						user: true,
						class: true,
					},
				},
				items: {
					include: {
						feeCategory: true,
					},
				},
				payments: true,
			},
		});
	}

	/**
	 * Lists invoices for a school with optional filters.
	 */
	async findInvoices(
		schoolId: string,
		filters: {
			status?: InvoiceStatus;
			studentId?: string;
			classId?: string;
			academicYearId?: string;
		},
	) {
		return await prisma.invoice.findMany({
			where: {
				schoolId,
				status: filters.status,
				studentId: filters.studentId,
				academicYearId: filters.academicYearId,
				student: filters.classId
					? {
							classId: filters.classId,
						}
					: undefined,
			},
			include: {
				student: {
					include: {
						user: true,
						class: true,
					},
				},
				items: true,
				payments: true,
			},
			orderBy: { createdAt: "desc" },
		});
	}

	/**
	 * Finds an invoice by its ID.
	 */
	async findInvoiceById(id: string) {
		return await prisma.invoice.findUnique({
			where: { id },
			include: {
				student: {
					include: {
						user: true,
						class: true,
					},
				},
				academicYear: true,
				items: {
					include: {
						feeCategory: true,
					},
				},
				payments: true,
			},
		});
	}

	/**
	 * Finds all students in a class.
	 */
	async findStudentsInClass(schoolId: string, classId: string) {
		return await prisma.studentProfile.findMany({
			where: {
				classId,
				isActive: true,
				user: {
					schoolId,
				},
			},
			select: {
				id: true,
			},
		});
	}

	/**
	 * Records a payment and updates the invoice status in a single database transaction.
	 */
	async recordPaymentAndUpdateInvoice(
		invoiceId: string,
		paymentData: {
			amount: number;
			paymentDate: Date;
			paymentMethod: PaymentMethod;
			reference?: string | null;
			remarks?: string | null;
		},
		newStatus: InvoiceStatus,
	) {
		return await prisma.$transaction(async (tx) => {
			const payment = await tx.payment.create({
				data: {
					amount: paymentData.amount,
					paymentDate: paymentData.paymentDate,
					paymentMethod: paymentData.paymentMethod,
					reference: paymentData.reference ?? null,
					remarks: paymentData.remarks ?? null,
					invoiceId,
				},
			});

			await tx.invoice.update({
				where: { id: invoiceId },
				data: { status: newStatus },
			});

			return payment;
		});
	}
}

import { logger } from "@/lib/logger";
import { BadRequestError, NotFoundError } from "@/utils/errors";
import type {
	CreateFeeCategoryInput,
	CreateInvoiceInput,
	FeeCategoryResponse,
	InvoiceDetailsResponse,
	InvoiceResponse,
	ListInvoicesInput,
	PaymentResponse,
	RecordPaymentInput,
} from "../contract/billing.schema";
import type { BillingRepository } from "../repo/billing.repo";

export class BillingService {
	constructor(private repo: BillingRepository) {}

	/**
	 * Creates a new fee category.
	 */
	async createFeeCategory(
		schoolId: string,
		input: CreateFeeCategoryInput,
	): Promise<FeeCategoryResponse> {
		logger.info({ schoolId, name: input.name }, "Creating new fee category");
		const category = await this.repo.createFeeCategory({
			name: input.name,
			description: input.description,
			amount: input.amount,
			schoolId,
		});
		return category;
	}

	/**
	 * Lists all fee categories.
	 */
	async listFeeCategories(schoolId: string): Promise<FeeCategoryResponse[]> {
		logger.debug({ schoolId }, "Listing fee categories");
		return await this.repo.findFeeCategoriesBySchool(schoolId);
	}

	/**
	 * Deletes a fee category if it is not referenced by any invoices.
	 */
	async deleteFeeCategory(schoolId: string, id: string): Promise<null> {
		logger.info({ schoolId, id }, "Deleting fee category");

		const category = await this.repo.findFeeCategoryById(id);
		if (!category || category.schoolId !== schoolId) {
			throw new NotFoundError("Fee category not found or access denied");
		}

		if (category.invoiceItems.length > 0) {
			throw new BadRequestError(
				"Cannot delete fee category because it is already linked to existing invoices",
			);
		}

		await this.repo.deleteFeeCategory(id);
		return null;
	}

	/**
	 * Creates invoices for a single student or bulk-generates for a class.
	 */
	async createInvoice(
		schoolId: string,
		input: CreateInvoiceInput,
	): Promise<InvoiceResponse[]> {
		logger.info(
			{
				schoolId,
				studentId: input.studentId,
				classId: input.classId,
				feeCategoryIds: input.feeCategoryIds,
			},
			"Creating invoices",
		);

		if (!input.studentId && !input.classId) {
			throw new BadRequestError("Either studentId or classId must be provided");
		}

		// Verify fee categories exist and belong to this school
		const feeCategories = [];
		for (const id of input.feeCategoryIds) {
			const cat = await this.repo.findFeeCategoryById(id);
			if (!cat || cat.schoolId !== schoolId) {
				throw new NotFoundError(`Fee category ${id} not found or access denied`);
			}
			feeCategories.push(cat);
		}

		// Identify target students
		let studentIds: string[] = [];
		if (input.studentId) {
			studentIds = [input.studentId];
		} else if (input.classId) {
			const classStudents = await this.repo.findStudentsInClass(
				schoolId,
				input.classId,
			);
			studentIds = classStudents.map((s) => s.id);
			if (studentIds.length === 0) {
				throw new BadRequestError("No active students found in the selected class");
			}
		}

		const parsedDueDate = new Date(`${input.dueDate}T00:00:00.000Z`);
		const currentYear = new Date().getFullYear();

		// Determine the starting sequence number
		const lastInvoice = await this.repo.findLastInvoiceBySchool(schoolId);
		let lastSeq = 0;
		if (lastInvoice) {
			// Format is INV-YYYY-XXXX (e.g. INV-2026-0005)
			const parts = lastInvoice.invoiceNumber.split("-");
			if (parts.length === 3) {
				const seq = parseInt(parts[2], 10);
				if (!isNaN(seq)) {
					lastSeq = seq;
				}
			}
		}

		const createdInvoices: InvoiceResponse[] = [];

		for (const studentId of studentIds) {
			lastSeq += 1;
			const invoiceNumber = `INV-${currentYear}-${String(lastSeq).padStart(4, "0")}`;

			const invoice = await this.repo.createInvoice({
				invoiceNumber,
				dueDate: parsedDueDate,
				studentId,
				academicYearId: input.academicYearId,
				schoolId,
				items: feeCategories.map((cat) => ({
					feeCategoryId: cat.id,
					amount: cat.amount,
				})),
			});

			const amount = invoice.items.reduce((sum, item) => sum + item.amount, 0);
			const paidAmount = invoice.payments.reduce((sum, p) => sum + p.amount, 0);
			const className = invoice.student.class
				? `${invoice.student.class.grade}-${invoice.student.class.section}`
				: null;

			createdInvoices.push({
				id: invoice.id,
				invoiceNumber: invoice.invoiceNumber,
				dueDate: invoice.dueDate,
				status: invoice.status,
				studentId: invoice.studentId,
				studentName: invoice.student.user.name,
				className,
				amount,
				paidAmount,
				createdAt: invoice.createdAt,
				updatedAt: invoice.updatedAt,
			});
		}

		return createdInvoices;
	}

	/**
	 * Lists and filters invoices.
	 */
	async listInvoices(
		schoolId: string,
		filters: ListInvoicesInput,
	): Promise<InvoiceResponse[]> {
		logger.debug({ schoolId, filters }, "Listing invoices");
		const invoices = await this.repo.findInvoices(schoolId, filters);

		return invoices.map((inv) => {
			const amount = inv.items.reduce((sum, item) => sum + item.amount, 0);
			const paidAmount = inv.payments.reduce((sum, p) => sum + p.amount, 0);
			const className = inv.student.class
				? `${inv.student.class.grade}-${inv.student.class.section}`
				: null;

			return {
				id: inv.id,
				invoiceNumber: inv.invoiceNumber,
				dueDate: inv.dueDate,
				status: inv.status,
				studentId: inv.studentId,
				studentName: inv.student.user.name,
				className,
				amount,
				paidAmount,
				createdAt: inv.createdAt,
				updatedAt: inv.updatedAt,
			};
		});
	}

	/**
	 * Retrieves detailed invoice information.
	 */
	async getInvoiceDetails(
		schoolId: string,
		invoiceId: string,
	): Promise<InvoiceDetailsResponse> {
		logger.debug({ schoolId, invoiceId }, "Retrieving invoice details");
		const invoice = await this.repo.findInvoiceById(invoiceId);

		if (!invoice || invoice.schoolId !== schoolId) {
			throw new NotFoundError("Invoice not found or access denied");
		}

		const amount = invoice.items.reduce((sum, item) => sum + item.amount, 0);
		const paidAmount = invoice.payments.reduce((sum, p) => sum + p.amount, 0);
		const className = invoice.student.class
			? `${invoice.student.class.grade}-${invoice.student.class.section}`
			: null;

		return {
			id: invoice.id,
			invoiceNumber: invoice.invoiceNumber,
			dueDate: invoice.dueDate,
			status: invoice.status,
			studentId: invoice.studentId,
			studentName: invoice.student.user.name,
			rollNumber: invoice.student.rollNumber,
			className,
			academicYearId: invoice.academicYearId,
			academicYearName: invoice.academicYear.name,
			amount,
			paidAmount,
			items: invoice.items.map((item) => ({
				id: item.id,
				feeCategoryId: item.feeCategoryId,
				name: item.feeCategory.name,
				amount: item.amount,
			})),
			payments: invoice.payments.map((p) => ({
				id: p.id,
				amount: p.amount,
				paymentDate: p.paymentDate,
				paymentMethod: p.paymentMethod,
				reference: p.reference,
				remarks: p.remarks,
				invoiceId: p.invoiceId,
				createdAt: p.createdAt,
			})),
			createdAt: invoice.createdAt,
			updatedAt: invoice.updatedAt,
		};
	}

	/**
	 * Records a payment against an invoice and updates its status.
	 */
	async recordPayment(
		schoolId: string,
		input: RecordPaymentInput,
	): Promise<PaymentResponse> {
		logger.info(
			{ schoolId, invoiceId: input.invoiceId, amount: input.amount },
			"Recording payment",
		);

		const invoice = await this.repo.findInvoiceById(input.invoiceId);
		if (!invoice || invoice.schoolId !== schoolId) {
			throw new NotFoundError("Invoice not found or access denied");
		}

		if (invoice.status === "PAID") {
			throw new BadRequestError("This invoice has already been fully paid");
		}

		const totalAmount = invoice.items.reduce((sum, item) => sum + item.amount, 0);
		const currentPaid = invoice.payments.reduce((sum, p) => sum + p.amount, 0);
		const remaining = totalAmount - currentPaid;

		if (input.amount > remaining) {
			throw new BadRequestError(
				`Payment amount ($${input.amount}) exceeds the remaining balance ($${remaining}) of this invoice`,
			);
		}

		const newTotalPaid = currentPaid + input.amount;
		let newStatus: "PAID" | "PARTIALLY_PAID" | "UNPAID" = "UNPAID";

		if (newTotalPaid >= totalAmount) {
			newStatus = "PAID";
		} else if (newTotalPaid > 0) {
			newStatus = "PARTIALLY_PAID";
		}

		const paymentDate = new Date(`${input.paymentDate}T00:00:00.000Z`);

		const payment = await this.repo.recordPaymentAndUpdateInvoice(
			input.invoiceId,
			{
				amount: input.amount,
				paymentDate,
				paymentMethod: input.paymentMethod,
				reference: input.reference,
				remarks: input.remarks,
			},
			newStatus,
		);

		return {
			id: payment.id,
			amount: payment.amount,
			paymentDate: payment.paymentDate,
			paymentMethod: payment.paymentMethod,
			reference: payment.reference,
			remarks: payment.remarks,
			invoiceId: payment.invoiceId,
			createdAt: payment.createdAt,
		};
	}
}

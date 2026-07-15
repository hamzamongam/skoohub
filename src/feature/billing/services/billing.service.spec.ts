import { beforeEach, describe, expect, it, vi } from "vitest";
import { BadRequestError, NotFoundError } from "@/utils/errors";
import { BillingRepository } from "../repo/billing.repo";
import { BillingService } from "./billing.service";

describe("BillingService", () => {
	let service: BillingService;
	let repo: BillingRepository;

	beforeEach(() => {
		repo = new BillingRepository();
		service = new BillingService(repo);
		vi.clearAllMocks();
	});

	describe("createFeeCategory", () => {
		it("should create a fee category successfully", async () => {
			const schoolId = "school-1";
			const input = {
				name: "Tuition Fee",
				amount: 1500,
				description: "Termly tuition fees",
			};

			const mockCategory = {
				id: "cat-1",
				...input,
				schoolId,
				createdAt: new Date(),
				updatedAt: new Date(),
			};

			const mockCreate = vi
				.spyOn(repo, "createFeeCategory")
				.mockResolvedValue(mockCategory as any);

			const result = await service.createFeeCategory(schoolId, input);

			expect(mockCreate).toHaveBeenCalledWith({
				name: input.name,
				amount: input.amount,
				description: input.description,
				schoolId,
			});
			expect(result).toEqual(mockCategory);
		});
	});

	describe("deleteFeeCategory", () => {
		it("should delete a fee category if it is not linked to any invoice", async () => {
			const schoolId = "school-1";
			const catId = "cat-1";

			vi.spyOn(repo, "findFeeCategoryById").mockResolvedValue({
				id: catId,
				schoolId,
				invoiceItems: [],
			} as any);

			const mockDelete = vi
				.spyOn(repo, "deleteFeeCategory")
				.mockResolvedValue({} as any);

			const result = await service.deleteFeeCategory(schoolId, catId);

			expect(mockDelete).toHaveBeenCalledWith(catId);
			expect(result).toBeNull();
		});

		it("should throw BadRequestError if category is linked to existing invoices", async () => {
			const schoolId = "school-1";
			const catId = "cat-1";

			vi.spyOn(repo, "findFeeCategoryById").mockResolvedValue({
				id: catId,
				schoolId,
				invoiceItems: [{ id: "item-1" }],
			} as any);

			await expect(
				service.deleteFeeCategory(schoolId, catId),
			).rejects.toThrow(BadRequestError);
		});
	});

	describe("createInvoice", () => {
		it("should generate a single invoice with consecutive number successfully", async () => {
			const schoolId = "school-1";
			const input = {
				dueDate: "2026-07-30",
				academicYearId: "ay-1",
				studentId: "student-1",
				feeCategoryIds: ["cat-1"],
			};

			vi.spyOn(repo, "findFeeCategoryById").mockResolvedValue({
				id: "cat-1",
				amount: 500,
				schoolId,
			} as any);

			vi.spyOn(repo, "findLastInvoiceBySchool").mockResolvedValue({
				invoiceNumber: "INV-2026-0004",
			} as any);

			const mockInvoice = {
				id: "inv-1",
				invoiceNumber: "INV-2026-0005",
				dueDate: new Date("2026-07-30T00:00:00.000Z"),
				status: "UNPAID",
				studentId: "student-1",
				academicYearId: "ay-1",
				schoolId,
				items: [{ id: "item-1", amount: 500 }],
				payments: [],
				student: {
					user: { name: "John Doe" },
					class: { grade: "10", section: "A" },
				},
				createdAt: new Date(),
				updatedAt: new Date(),
			};

			const mockCreate = vi
				.spyOn(repo, "createInvoice")
				.mockResolvedValue(mockInvoice as any);

			const result = await service.createInvoice(schoolId, input);

			expect(mockCreate).toHaveBeenCalledWith({
				invoiceNumber: "INV-2026-0005",
				dueDate: new Date("2026-07-30T00:00:00.000Z"),
				studentId: "student-1",
				academicYearId: "ay-1",
				schoolId,
				items: [{ feeCategoryId: "cat-1", amount: 500 }],
			});

			expect(result).toHaveLength(1);
			expect(result[0].invoiceNumber).toBe("INV-2026-0005");
			expect(result[0].amount).toBe(500);
		});
	});

	describe("recordPayment", () => {
		it("should record payment and update invoice status to PAID if fully paid", async () => {
			const schoolId = "school-1";
			const input = {
				invoiceId: "inv-1",
				amount: 300,
				paymentDate: "2026-06-15",
				paymentMethod: "CASH" as const,
			};

			const mockInvoice = {
				id: "inv-1",
				schoolId,
				status: "UNPAID",
				items: [{ id: "item-1", amount: 300 }],
				payments: [],
			};

			vi.spyOn(repo, "findInvoiceById").mockResolvedValue(mockInvoice as any);

			const mockRecord = vi
				.spyOn(repo, "recordPaymentAndUpdateInvoice")
				.mockResolvedValue({
					id: "pay-1",
					amount: 300,
					paymentDate: new Date("2026-06-15T00:00:00.000Z"),
					paymentMethod: "CASH",
					invoiceId: "inv-1",
					createdAt: new Date(),
				} as any);

			const result = await service.recordPayment(schoolId, input);

			expect(mockRecord).toHaveBeenCalledWith(
				"inv-1",
				{
					amount: 300,
					paymentDate: new Date("2026-06-15T00:00:00.000Z"),
					paymentMethod: "CASH",
					reference: undefined,
					remarks: undefined,
				},
				"PAID",
			);
			expect(result.amount).toBe(300);
		});

		it("should throw BadRequestError if payment amount exceeds remaining balance", async () => {
			const schoolId = "school-1";
			const input = {
				invoiceId: "inv-1",
				amount: 400,
				paymentDate: "2026-06-15",
				paymentMethod: "CASH" as const,
			};

			const mockInvoice = {
				id: "inv-1",
				schoolId,
				status: "UNPAID",
				items: [{ id: "item-1", amount: 300 }],
				payments: [],
			};

			vi.spyOn(repo, "findInvoiceById").mockResolvedValue(mockInvoice as any);

			await expect(service.recordPayment(schoolId, input)).rejects.toThrow(
				BadRequestError,
			);
		});
	});
});

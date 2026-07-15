import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, Calendar, CreditCard, DollarSign, FileText, History, Info, Plus } from "lucide-react";
import { type FC, useState } from "react";
import { toast } from "sonner";
import { BaseButton } from "@/components/base/button";
import BaseModal from "@/components/base/dialog/BaseModal";
import { BaseInput } from "@/components/base/input";
import { BaseSelect } from "@/components/base/select";
import { useOrpcMutation } from "@/hooks/useOrpcMutation";
import { orpc } from "@/server/orpc/client";

export const InvoiceDetailsView: FC = () => {
	const { invoiceId } = useParams({ from: "/_authed/dashboard/billing/invoices/$invoiceId" });
	const queryClient = useQueryClient();
	const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

	// Record Payment Form State
	const [paymentAmount, setPaymentAmount] = useState("");
	const [paymentDate, setPaymentDate] = useState("");
	const [paymentMethod, setPaymentMethod] = useState<"CASH" | "BANK_TRANSFER" | "CARD" | "ONLINE">("CASH");
	const [reference, setReference] = useState("");
	const [remarks, setRemarks] = useState("");

	// 1. Fetch details
	const { data: detailsData, isLoading } = useQuery(
		orpc.billing.getInvoiceDetails.queryOptions({
			input: { id: invoiceId },
		}),
	);
	const invoice = detailsData?.data;

	// 2. Mutation
	const { mutate: recordPayment, isPending: isSaving } = useOrpcMutation(
		orpc.billing.recordPayment.mutationOptions({
			onSuccess: () => {
				setIsPaymentModalOpen(false);
				setPaymentAmount("");
				setPaymentDate("");
				setPaymentMethod("CASH");
				setReference("");
				setRemarks("");
				queryClient.invalidateQueries({
					queryKey: orpc.billing.getInvoiceDetails.queryKey({ input: { id: invoiceId } }),
				});
				queryClient.invalidateQueries({
					queryKey: orpc.billing.listInvoices.queryKey(),
				});
			},
		}),
		{
			successMessage: "Payment logged successfully!",
		},
	);

	const handleOpenPaymentModal = () => {
		if (!invoice) return;
		const remaining = invoice.amount - invoice.paidAmount;
		setPaymentAmount(remaining.toFixed(2));
		setPaymentDate(new Date().toISOString().split("T")[0]);
		setIsPaymentModalOpen(true);
	};

	const handlePaymentSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!invoice) return;

		const amount = Number(paymentAmount);
		if (isNaN(amount) || amount <= 0) {
			toast.error("Please enter a valid amount greater than 0");
			return;
		}

		const remaining = invoice.amount - invoice.paidAmount;
		if (amount > remaining) {
			toast.error(`Payment amount exceeds remaining balance of $${remaining.toFixed(2)}`);
			return;
		}

		if (!paymentDate) {
			toast.error("Please select the payment date");
			return;
		}

		recordPayment({
			invoiceId: invoice.id,
			amount,
			paymentDate,
			paymentMethod,
			reference: reference || null,
			remarks: remarks || null,
		});
	};

	const getStatusBadge = (status: string) => {
		switch (status) {
			case "PAID":
				return (
					<span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
						Paid
					</span>
				);
			case "PARTIALLY_PAID":
				return (
					<span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">
						Partially Paid
					</span>
				);
			case "OVERDUE":
				return (
					<span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 border border-rose-200">
						Overdue
					</span>
				);
			default:
				return (
					<span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-800 border border-slate-200">
						Unpaid
					</span>
				);
		}
	};

	if (isLoading) {
		return <div className="p-12 text-center text-muted-foreground">Loading invoice details...</div>;
	}

	if (!invoice) {
		return (
			<div className="p-12 text-center space-y-4">
				<p className="text-muted-foreground">Invoice not found or access denied.</p>
				<Link to="/dashboard/billing/invoices">
					<BaseButton variant="outline" className="gap-2">
						<ArrowLeft className="h-4 w-4" /> Back to Invoices
					</BaseButton>
				</Link>
			</div>
		);
	}

	const remainingBalance = invoice.amount - invoice.paidAmount;

	return (
		<div className="space-y-6 p-6">
			{/* Back Link */}
			<div>
				<Link
					to="/dashboard/billing/invoices"
					className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
				>
					<ArrowLeft className="h-4 w-4" />
					<span>Back to Invoices</span>
				</Link>
			</div>

			{/* Invoice Banner */}
			<div className="bg-card border rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
				<div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-violet-500 to-indigo-600" />
				<div>
					<div className="flex items-center gap-3">
						<h1 className="text-2xl font-bold">{invoice.invoiceNumber}</h1>
						{getStatusBadge(invoice.status)}
					</div>
					<p className="text-sm text-muted-foreground mt-1">
						Academic Year: {invoice.academicYearName}
					</p>
				</div>
				<div className="flex flex-col sm:flex-row gap-3">
					{invoice.status !== "PAID" && (
						<BaseButton onClick={handleOpenPaymentModal} className="flex items-center gap-2">
							<Plus className="h-4.5 w-4.5" />
							Record Payment
						</BaseButton>
					)}
				</div>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				{/* Left Side: Summary & Items */}
				<div className="lg:col-span-2 space-y-6">
					{/* Student & Invoice Info Card */}
					<div className="bg-card border rounded-2xl p-6 shadow-sm space-y-4">
						<div className="flex items-center gap-2 font-medium text-sm text-foreground/80 pb-2 border-b">
							<Info className="h-4.5 w-4.5 text-violet-500" />
							<span>Billing Details</span>
						</div>
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
							<div className="space-y-1">
								<span className="text-muted-foreground block text-xs">Student Name</span>
								<span className="font-semibold text-foreground">{invoice.studentName}</span>
							</div>
							<div className="space-y-1">
								<span className="text-muted-foreground block text-xs">Class / Section</span>
								<span className="font-semibold text-foreground">{invoice.className || "Unassigned"}</span>
							</div>
							<div className="space-y-1">
								<span className="text-muted-foreground block text-xs">Roll Number</span>
								<span className="font-semibold text-foreground">{invoice.rollNumber || "N/A"}</span>
							</div>
							<div className="space-y-1">
								<span className="text-muted-foreground block text-xs">Due Date</span>
								<span className="font-semibold text-foreground flex items-center gap-1">
									<Calendar className="h-3.5 w-3.5 text-muted-foreground" />
									{new Date(invoice.dueDate).toLocaleDateString()}
								</span>
							</div>
						</div>
					</div>

					{/* Invoice Items */}
					<div className="bg-card border rounded-2xl p-6 shadow-sm space-y-4">
						<div className="flex items-center gap-2 font-medium text-sm text-foreground/80 pb-2 border-b">
							<FileText className="h-4.5 w-4.5 text-violet-500" />
							<span>Invoiced Fee Items</span>
						</div>
						<div className="divide-y text-sm">
							{invoice.items.map((item) => (
								<div key={item.id} className="flex justify-between py-3">
									<span className="font-medium text-foreground">{item.name}</span>
									<span className="font-semibold">${item.amount.toFixed(2)}</span>
								</div>
							))}
							<div className="flex justify-between pt-4 font-bold text-base text-foreground">
								<span>Total Billed Amount</span>
								<span>${invoice.amount.toFixed(2)}</span>
							</div>
						</div>
					</div>
				</div>

				{/* Right Side: Totals & Payments */}
				<div className="space-y-6">
					{/* Totals Summary */}
					<div className="bg-card border rounded-2xl p-6 shadow-sm space-y-4">
						<div className="flex items-center gap-2 font-medium text-sm text-foreground/80 pb-2 border-b">
							<DollarSign className="h-4.5 w-4.5 text-violet-500" />
							<span>Payment Summary</span>
						</div>
						<div className="space-y-3 text-sm">
							<div className="flex justify-between">
								<span className="text-muted-foreground">Total Invoiced</span>
								<span className="font-semibold">${invoice.amount.toFixed(2)}</span>
							</div>
							<div className="flex justify-between">
								<span className="text-muted-foreground">Total Paid</span>
								<span className="font-semibold text-emerald-600">${invoice.paidAmount.toFixed(2)}</span>
							</div>
							<div className="flex justify-between pt-2 border-t font-bold text-base">
								<span className="text-foreground">Remaining Balance</span>
								<span className={remainingBalance > 0 ? "text-rose-600" : "text-emerald-600"}>
									${remainingBalance.toFixed(2)}
								</span>
							</div>
						</div>
					</div>

					{/* Payment History */}
					<div className="bg-card border rounded-2xl p-6 shadow-sm space-y-4">
						<div className="flex items-center gap-2 font-medium text-sm text-foreground/80 pb-2 border-b">
							<History className="h-4.5 w-4.5 text-violet-500" />
							<span>Payment History</span>
						</div>
						{invoice.payments.length === 0 ? (
							<p className="text-sm text-muted-foreground text-center py-4">No payments logged yet.</p>
						) : (
							<div className="space-y-4 max-h-64 overflow-y-auto pr-1">
								{invoice.payments.map((p) => (
									<div key={p.id} className="border-b last:border-0 pb-3 last:pb-0 text-sm space-y-1">
										<div className="flex justify-between font-semibold">
											<span className="text-emerald-600">+${p.amount.toFixed(2)}</span>
											<span className="text-muted-foreground text-xs">
												{new Date(p.paymentDate).toLocaleDateString()}
											</span>
										</div>
										<div className="flex justify-between text-xs text-muted-foreground">
											<span>Method: {p.paymentMethod}</span>
											{p.reference && <span>Ref: {p.reference}</span>}
										</div>
										{p.remarks && (
											<p className="text-xs text-muted-foreground italic mt-1">
												Note: {p.remarks}
											</p>
										)}
									</div>
								))}
							</div>
						)}
					</div>
				</div>
			</div>

			{/* Record Payment Modal */}
			<BaseModal
				open={isPaymentModalOpen}
				onOpenChange={(open) => setIsPaymentModalOpen(!!open)}
				title="Record Invoice Payment"
			>
				<form onSubmit={handlePaymentSubmit} className="space-y-4 pt-2">
					<div className="space-y-1.5">
						<label className="text-sm font-medium">Payment Amount ($ USD) <span className="text-destructive">*</span></label>
						<BaseInput
							type="number"
							placeholder="Amount to pay"
							value={paymentAmount}
							onChange={(e) => setPaymentAmount(e.target.value)}
							required
							min="0.01"
							step="0.01"
						/>
						<span className="text-xs text-muted-foreground">
							Remaining balance: ${remainingBalance.toFixed(2)}
						</span>
					</div>

					<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
						<div className="space-y-1.5">
							<label className="text-sm font-medium">Payment Date <span className="text-destructive">*</span></label>
							<BaseInput
								type="date"
								value={paymentDate}
								onChange={(e) => setPaymentDate(e.target.value)}
								required
							/>
						</div>

						<div className="space-y-1.5">
							<label className="text-sm font-medium">Payment Method <span className="text-destructive">*</span></label>
							<BaseSelect
								value={paymentMethod}
								onChange={(val) => setPaymentMethod(val as any)}
								data={[
									{ label: "Cash", value: "CASH" },
									{ label: "Bank Transfer", value: "BANK_TRANSFER" },
									{ label: "Credit/Debit Card", value: "CARD" },
									{ label: "Online", value: "ONLINE" },
								]}
							/>
						</div>
					</div>

					<div className="space-y-1.5">
						<label className="text-sm font-medium">Reference Code (Optional)</label>
						<BaseInput
							placeholder="e.g. Transaction ID, Check #"
							value={reference}
							onChange={(e) => setReference(e.target.value)}
						/>
					</div>

					<div className="space-y-1.5">
						<label className="text-sm font-medium">Remarks (Optional)</label>
						<textarea
							placeholder="Any additional notes..."
							value={remarks}
							onChange={(e) => setRemarks(e.target.value)}
							className="w-full min-h-16 rounded-lg border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
						/>
					</div>

					<div className="pt-2 flex justify-end gap-3">
						<BaseButton
							type="button"
							variant="outline"
							onClick={() => setIsPaymentModalOpen(false)}
						>
							Cancel
						</BaseButton>
						<BaseButton type="submit" isLoading={isSaving}>
							Submit Payment
						</BaseButton>
					</div>
				</form>
			</BaseModal>
		</div>
	);
};

export default InvoiceDetailsView;

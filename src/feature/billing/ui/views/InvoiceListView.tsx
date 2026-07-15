import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { Calendar, DollarSign, Eye, Filter, Plus, Receipt } from "lucide-react";
import { type FC, useState } from "react";
import { toast } from "sonner";
import { BaseButton } from "@/components/base/button";
import BaseModal from "@/components/base/dialog/BaseModal";
import { BaseInput } from "@/components/base/input";
import { BaseSelect } from "@/components/base/select";
import { useOrpcMutation } from "@/hooks/useOrpcMutation";
import { orpc } from "@/server/orpc/client";

export const InvoiceListView: FC = () => {
	const queryClient = useQueryClient();
	const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

	// Filters State
	const [filterStatus, setFilterStatus] = useState<string>("ALL");
	const [filterClassId, setFilterClassId] = useState<string>("ALL");
	const [filterYearId, setFilterYearId] = useState<string>("ALL");

	// Invoice Creation Form State
	const [invoiceType, setInvoiceType] = useState<"single" | "class">("single");
	const [selectedYearId, setSelectedYearId] = useState("");
	const [selectedClassId, setSelectedClassId] = useState("");
	const [selectedStudentId, setSelectedStudentId] = useState("");
	const [dueDate, setDueDate] = useState("");
	const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);

	// 1. Fetch metadata
	const { data: yearsData } = useQuery(orpc.exam.listAcademicYears.queryOptions());
	const { data: classesData } = useQuery(orpc.class.list.queryOptions());
	const { data: categoriesData } = useQuery(orpc.billing.listFeeCategories.queryOptions());

	const academicYears = yearsData?.data ?? [];
	const classes = classesData?.data ?? [];
	const feeCategories = categoriesData?.data ?? [];

	// Fetch student profiles for student selection
	const { data: studentsData } = useQuery({
		...orpc.student.list.queryOptions({
			input: {
				classId: selectedClassId || undefined,
			},
		}),
		enabled: invoiceType === "single" && !!selectedClassId,
	});
	const students = studentsData?.data ?? [];

	// 2. Fetch filtered invoices
	const { data: invoicesData, isLoading: isLoadingInvoices } = useQuery(
		orpc.billing.listInvoices.queryOptions({
			input: {
				status: filterStatus !== "ALL" ? (filterStatus as any) : undefined,
				classId: filterClassId !== "ALL" ? filterClassId : undefined,
				academicYearId: filterYearId !== "ALL" ? filterYearId : undefined,
			},
		}),
	);
	const invoices = invoicesData?.data ?? [];

	// 3. Mutation
	const { mutate: createInvoice, isPending: isCreating } = useOrpcMutation(
		orpc.billing.createInvoice.mutationOptions({
			onSuccess: () => {
				setIsCreateModalOpen(false);
				setSelectedYearId("");
				setSelectedClassId("");
				setSelectedStudentId("");
				setDueDate("");
				setSelectedCategoryIds([]);
				queryClient.invalidateQueries({
					queryKey: orpc.billing.listInvoices.queryKey(),
				});
			},
		}),
		{
			successMessage: "Invoice(s) generated successfully!",
		},
	);

	const handleCreateSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!selectedYearId || !dueDate || selectedCategoryIds.length === 0) {
			toast.error("Please fill in all required fields and select at least one fee category");
			return;
		}

		if (invoiceType === "single" && (!selectedClassId || !selectedStudentId)) {
			toast.error("Please select both a class and a student");
			return;
		}

		if (invoiceType === "class" && !selectedClassId) {
			toast.error("Please select a target class");
			return;
		}

		createInvoice({
			dueDate,
			academicYearId: selectedYearId,
			studentId: invoiceType === "single" ? selectedStudentId : undefined,
			classId: invoiceType === "class" ? selectedClassId : undefined,
			feeCategoryIds: selectedCategoryIds,
		});
	};

	const handleCategoryCheckboxChange = (id: string, checked: boolean) => {
		setSelectedCategoryIds((prev) =>
			checked ? [...prev, id] : prev.filter((item) => item !== id),
		);
	};

	const getStatusBadge = (status: string) => {
		switch (status) {
			case "PAID":
				return (
					<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
						Paid
					</span>
				);
			case "PARTIALLY_PAID":
				return (
					<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">
						Partially Paid
					</span>
				);
			case "OVERDUE":
				return (
					<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 border border-rose-200">
						Overdue
					</span>
				);
			default:
				return (
					<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-800 border border-slate-200">
						Unpaid
					</span>
				);
		}
	};

	return (
		<div className="space-y-6 p-6">
			{/* Page Header */}
			<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">Student Invoices</h1>
					<p className="text-muted-foreground">
						View status, track payment history, and generate single or bulk class invoices.
					</p>
				</div>
				<BaseButton
					onClick={() => setIsCreateModalOpen(true)}
					className="h-10 px-4 flex items-center gap-2"
				>
					<Plus className="h-4.5 w-4.5" />
					Create Invoice
				</BaseButton>
			</div>

			{/* Filters Controls */}
			<div className="bg-card border rounded-2xl p-5 shadow-sm space-y-4">
				<div className="flex items-center gap-2 font-medium text-sm text-foreground/80 pb-2 border-b">
					<Filter className="h-4 w-4" />
					<span>Filter Invoices</span>
				</div>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
					<div className="space-y-1">
						<label className="text-xs font-medium text-muted-foreground">Status</label>
						<BaseSelect
							value={filterStatus}
							onChange={setFilterStatus}
							data={[
								{ label: "All Statuses", value: "ALL" },
								{ label: "Unpaid", value: "UNPAID" },
								{ label: "Partially Paid", value: "PARTIALLY_PAID" },
								{ label: "Paid", value: "PAID" },
								{ label: "Overdue", value: "OVERDUE" },
							]}
						/>
					</div>
					<div className="space-y-1">
						<label className="text-xs font-medium text-muted-foreground">Class</label>
						<BaseSelect
							value={filterClassId}
							onChange={setFilterClassId}
							placeholder="All Classes"
							data={[{ label: "All Classes", value: "ALL" }, ...classes.map((c) => ({ label: c.name, value: c.id }))]}
						/>
					</div>
					<div className="space-y-1">
						<label className="text-xs font-medium text-muted-foreground">Academic Year</label>
						<BaseSelect
							value={filterYearId}
							onChange={setFilterYearId}
							placeholder="All Years"
							data={[{ label: "All Years", value: "ALL" }, ...academicYears.map((y) => ({ label: y.name, value: y.id }))]}
						/>
					</div>
				</div>
			</div>

			{/* Invoices List */}
			{isLoadingInvoices ? (
				<div className="p-12 text-center text-muted-foreground bg-card border rounded-2xl shadow-sm">
					Loading invoices...
				</div>
			) : invoices.length === 0 ? (
				<div className="bg-card border border-dashed rounded-2xl p-16 text-center text-muted-foreground shadow-sm">
					No invoices found matching the filters.
				</div>
			) : (
				<div className="bg-card border rounded-2xl overflow-hidden shadow-sm">
					<div className="overflow-x-auto">
						<table className="w-full text-left border-collapse">
							<thead>
								<tr className="bg-muted/40 border-b text-xs font-medium text-muted-foreground uppercase tracking-wider">
									<th className="py-4 px-6">Invoice #</th>
									<th className="py-4 px-6">Student</th>
									<th className="py-4 px-6">Class</th>
									<th className="py-4 px-6">Due Date</th>
									<th className="py-4 px-6 text-right">Total Amount</th>
									<th className="py-4 px-6 text-right">Paid</th>
									<th className="py-4 px-6 text-center">Status</th>
									<th className="py-4 px-6 text-center">Action</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-muted/40 text-sm">
								{invoices.map((inv) => (
									<tr key={inv.id} className="hover:bg-muted/10 transition-colors">
										<td className="py-4 px-6 font-semibold text-foreground">
											{inv.invoiceNumber}
										</td>
										<td className="py-4 px-6 font-medium">
											{inv.studentName}
										</td>
										<td className="py-4 px-6 text-muted-foreground">
											{inv.className || "Unassigned"}
										</td>
										<td className="py-4 px-6 text-muted-foreground flex items-center gap-1.5 pt-4.5">
											<Calendar className="h-3.5 w-3.5" />
											<span>{new Date(inv.dueDate).toLocaleDateString()}</span>
										</td>
										<td className="py-4 px-6 text-right font-semibold">
											${inv.amount.toFixed(2)}
										</td>
										<td className="py-4 px-6 text-right font-medium text-emerald-600">
											${inv.paidAmount.toFixed(2)}
										</td>
										<td className="py-4 px-6 text-center">
											{getStatusBadge(inv.status)}
										</td>
										<td className="py-4 px-6 text-center">
											<Link
												to={`/dashboard/billing/invoices/${inv.id}`}
												className="inline-flex items-center gap-1.5 text-xs font-medium text-violet-600 hover:text-violet-800 transition-colors"
											>
												<Eye className="h-3.5 w-3.5" />
												<span>View Details</span>
											</Link>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
			)}

			{/* Create Invoice Modal */}
			<BaseModal
				open={isCreateModalOpen}
				onOpenChange={(open) => setIsCreateModalOpen(!!open)}
				title="Generate Invoices"
				className="sm:max-w-xl"
			>
				<form onSubmit={handleCreateSubmit} className="space-y-4 pt-2">
					<div className="flex gap-4 p-1 bg-muted rounded-xl w-fit">
						<button
							type="button"
							onClick={() => {
								setInvoiceType("single");
								setSelectedClassId("");
								setSelectedStudentId("");
							}}
							className={`px-4 py-1.5 text-xs font-medium rounded-lg transition-all ${
								invoiceType === "single"
									? "bg-card shadow-sm text-foreground font-semibold"
									: "text-muted-foreground hover:text-foreground"
							}`}
						>
							Single Student
						</button>
						<button
							type="button"
							onClick={() => {
								setInvoiceType("class");
								setSelectedClassId("");
								setSelectedStudentId("");
							}}
							className={`px-4 py-1.5 text-xs font-medium rounded-lg transition-all ${
								invoiceType === "class"
									? "bg-card shadow-sm text-foreground font-semibold"
									: "text-muted-foreground hover:text-foreground"
							}`}
						>
							Class Bulk Generate
						</button>
					</div>

					<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
						<div className="space-y-1.5">
							<label className="text-sm font-medium">Academic Year <span className="text-destructive">*</span></label>
							<BaseSelect
								value={selectedYearId}
								onChange={setSelectedYearId}
								placeholder="Select Year"
								data={academicYears.map((y) => ({
									label: y.name,
									value: y.id,
								}))}
							/>
						</div>

						<div className="space-y-1.5">
							<label className="text-sm font-medium">Due Date <span className="text-destructive">*</span></label>
							<BaseInput
								type="date"
								value={dueDate}
								onChange={(e) => setDueDate(e.target.value)}
								required
							/>
						</div>
					</div>

					<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
						<div className="space-y-1.5">
							<label className="text-sm font-medium">Class <span className="text-destructive">*</span></label>
							<BaseSelect
								value={selectedClassId}
								onChange={setSelectedClassId}
								placeholder="Select Class"
								data={classes.map((c) => ({
									label: c.name,
									value: c.id,
								}))}
							/>
						</div>

						{invoiceType === "single" && (
							<div className="space-y-1.5">
								<label className="text-sm font-medium">Student <span className="text-destructive">*</span></label>
								<BaseSelect
									value={selectedStudentId}
									onChange={setSelectedStudentId}
									placeholder={selectedClassId ? "Choose Student" : "Select class first"}
									disabled={!selectedClassId}
									data={students.map((s) => ({
										label: s.class ? `${s.name} (${s.class.name})` : s.name,
										value: s.id,
									}))}
								/>
							</div>
						)}
					</div>

					<div className="space-y-3 pt-2">
						<label className="text-sm font-semibold border-b pb-1.5 block">Select Fees to Bill <span className="text-destructive">*</span></label>
						{feeCategories.length === 0 ? (
							<p className="text-xs text-muted-foreground">No fee categories available. Configure categories first.</p>
						) : (
							<div className="max-h-40 overflow-y-auto space-y-2 pr-2">
								{feeCategories.map((cat) => (
									<label key={cat.id} className="flex items-center justify-between p-2.5 rounded-lg border hover:bg-muted/20 cursor-pointer text-sm font-medium">
										<div className="flex items-center gap-2.5">
											<input
												type="checkbox"
												checked={selectedCategoryIds.includes(cat.id)}
												onChange={(e) =>
													handleCategoryCheckboxChange(cat.id, e.target.checked)
												}
												className="rounded border-gray-300 text-violet-600 focus:ring-violet-500 h-4 w-4"
											/>
											<div className="flex flex-col">
												<span>{cat.name}</span>
												{cat.description && (
													<span className="text-xs font-normal text-muted-foreground">{cat.description}</span>
												)}
											</div>
										</div>
										<span className="font-semibold text-foreground">${cat.amount.toFixed(2)}</span>
									</label>
								))}
							</div>
						)}
					</div>

					<div className="pt-4 flex justify-end gap-3 border-t">
						<BaseButton
							type="button"
							variant="outline"
							onClick={() => setIsCreateModalOpen(false)}
						>
							Cancel
						</BaseButton>
						<BaseButton type="submit" isLoading={isCreating}>
							Generate Invoices
						</BaseButton>
					</div>
				</form>
			</BaseModal>
		</div>
	);
};

export default InvoiceListView;

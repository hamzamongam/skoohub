import { useQuery, useQueryClient } from "@tanstack/react-query";
import { DollarSign, Layers, Plus, Trash2 } from "lucide-react";
import { type FC, useState } from "react";
import { toast } from "sonner";
import { BaseButton } from "@/components/base/button";
import BaseModal from "@/components/base/dialog/BaseModal";
import { BaseInput } from "@/components/base/input";
import { useOrpcMutation } from "@/hooks/useOrpcMutation";
import { orpc } from "@/server/orpc/client";

export const FeeCategoriesView: FC = () => {
	const queryClient = useQueryClient();
	const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

	// Form State
	const [name, setName] = useState("");
	const [amount, setAmount] = useState("");
	const [description, setDescription] = useState("");

	// 1. Fetch categories
	const { data: categoriesData, isLoading } = useQuery(
		orpc.billing.listFeeCategories.queryOptions(),
	);
	const categories = categoriesData?.data ?? [];

	// 2. Mutations
	const { mutate: createCategory, isPending: isCreating } = useOrpcMutation(
		orpc.billing.createFeeCategory.mutationOptions({
			onSuccess: () => {
				setIsCreateModalOpen(false);
				setName("");
				setAmount("");
				setDescription("");
				queryClient.invalidateQueries({
					queryKey: orpc.billing.listFeeCategories.queryKey(),
				});
			},
		}),
		{
			successMessage: "Fee category created successfully!",
		},
	);

	const { mutate: deleteCategory, isPending: isDeleting } = useOrpcMutation(
		orpc.billing.deleteFeeCategory.mutationOptions({
			onSuccess: () => {
				queryClient.invalidateQueries({
					queryKey: orpc.billing.listFeeCategories.queryKey(),
				});
			},
		}),
		{
			successMessage: "Fee category deleted successfully!",
		},
	);

	const handleCreateSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!name || !amount) {
			toast.error("Please fill in all required fields");
			return;
		}
		const numericAmount = Number(amount);
		if (isNaN(numericAmount) || numericAmount < 0) {
			toast.error("Please enter a valid amount");
			return;
		}

		createCategory({
			name,
			amount: numericAmount,
			description: description || null,
		});
	};

	const handleDelete = (id: string, catName: string) => {
		if (confirm(`Are you sure you want to delete "${catName}"?`)) {
			deleteCategory({ id });
		}
	};

	return (
		<div className="space-y-6 p-6">
			{/* Page Header */}
			<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">Fee Categories</h1>
					<p className="text-muted-foreground">
						Manage standard fee structures (e.g. Tuition, Transport, Sports) applied to invoices.
					</p>
				</div>
				<BaseButton
					onClick={() => setIsCreateModalOpen(true)}
					className="h-10 px-4 flex items-center gap-2"
				>
					<Plus className="h-4.5 w-4.5" />
					Create Fee Category
				</BaseButton>
			</div>

			{/* Grid Content */}
			{isLoading ? (
				<div className="p-12 text-center text-muted-foreground">
					Loading fee categories...
				</div>
			) : categories.length === 0 ? (
				<div className="bg-card border border-dashed rounded-2xl p-16 text-center text-muted-foreground">
					No fee categories configured. Click "Create Fee Category" to configure one.
				</div>
			) : (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{categories.map((category) => (
						<div
							key={category.id}
							className="bg-card border rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden group flex flex-col justify-between"
						>
							{/* Decorative accent */}
							<div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-600" />

							<div>
								<div className="flex items-start justify-between gap-4 mt-2">
									<div>
										<h3 className="font-semibold text-lg leading-snug group-hover:text-emerald-600 transition-colors">
											{category.name}
										</h3>
										<p className="text-sm text-muted-foreground mt-1 min-h-10">
											{category.description || "No description provided."}
										</p>
									</div>
									<div className="bg-emerald-500/10 p-2.5 rounded-xl text-emerald-600">
										<DollarSign className="h-5 w-5" />
									</div>
								</div>

								<div className="mt-4 flex items-baseline gap-1">
									<span className="text-2xl font-bold">${category.amount.toFixed(2)}</span>
									<span className="text-xs text-muted-foreground">USD / cycle</span>
								</div>
							</div>

							<div className="mt-6 pt-4 border-t flex justify-end">
								<BaseButton
									onClick={() => handleDelete(category.id, category.name)}
									variant="outline"
									className="text-destructive hover:bg-destructive/10 hover:text-destructive border-muted/55 hover:border-destructive/30 flex items-center justify-center gap-2 text-xs h-9"
									isLoading={isDeleting}
								>
									<Trash2 className="h-4 w-4" />
									Delete Category
								</BaseButton>
							</div>
						</div>
					))}
				</div>
			)}

			{/* Create Fee Category Modal */}
			<BaseModal
				open={isCreateModalOpen}
				onOpenChange={(open) => setIsCreateModalOpen(!!open)}
				title="Create Fee Category"
			>
				<form onSubmit={handleCreateSubmit} className="space-y-4 pt-2">
					<div className="space-y-1.5">
						<label className="text-sm font-medium">Name <span className="text-destructive">*</span></label>
						<BaseInput
							placeholder="e.g., Annual Tuition Fee"
							value={name}
							onChange={(e) => setName(e.target.value)}
							required
						/>
					</div>

					<div className="space-y-1.5">
						<label className="text-sm font-medium">Amount ($ USD) <span className="text-destructive">*</span></label>
						<BaseInput
							type="number"
							placeholder="e.g., 1200"
							value={amount}
							onChange={(e) => setAmount(e.target.value)}
							required
							min="0"
							step="0.01"
						/>
					</div>

					<div className="space-y-1.5">
						<label className="text-sm font-medium">Description</label>
						<textarea
							placeholder="Provide context or description..."
							value={description}
							onChange={(e) => setDescription(e.target.value)}
							className="w-full min-h-20 rounded-lg border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
						/>
					</div>

					<div className="pt-2 flex justify-end gap-3">
						<BaseButton
							type="button"
							variant="outline"
							onClick={() => setIsCreateModalOpen(false)}
						>
							Cancel
						</BaseButton>
						<BaseButton type="submit" isLoading={isCreating}>
							Create
						</BaseButton>
					</div>
				</form>
			</BaseModal>
		</div>
	);
};

export default FeeCategoriesView;

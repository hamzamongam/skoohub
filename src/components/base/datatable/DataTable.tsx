"use client";

import {
	type ColumnDef,
	type ColumnFiltersState,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	type SortingState,
	useReactTable,
	type VisibilityState,
} from "@tanstack/react-table";
import { Search, Trash2, X } from "lucide-react";
import * as React from "react";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { DataTablePagination } from "./DataTablePagination";
import { DataTableSkeleton } from "./DataTableSkeleton";

interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[];
	data: TData[];
	searchKey?: string;
	searchPlaceholder?: string;
	className?: string;
	isLoading?: boolean;
	onBulkDelete?: (ids: string[]) => void;
}

export function DataTable<TData, TValue>({
	columns,
	data,
	searchKey,
	searchPlaceholder = "Search...",
	className,
	isLoading,
	onBulkDelete,
}: DataTableProps<TData, TValue>) {
	const [sorting, setSorting] = React.useState<SortingState>([]);
	const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
		[],
	);
	const [columnVisibility, setColumnVisibility] =
		React.useState<VisibilityState>({});
	const [rowSelection, setRowSelection] = React.useState({});

	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		onSortingChange: setSorting,
		getSortedRowModel: getSortedRowModel(),
		onColumnFiltersChange: setColumnFilters,
		getFilteredRowModel: getFilteredRowModel(),
		onColumnVisibilityChange: setColumnVisibility,
		onRowSelectionChange: setRowSelection,
		state: {
			sorting,
			columnFilters,
			columnVisibility,
			rowSelection,
		},
	});

	if (isLoading) {
		return (
			<DataTableSkeleton
				columnCount={columns.length}
				searchable={!!searchKey}
			/>
		);
	}

	const selectedRowsCount = table.getFilteredSelectedRowModel().rows.length;

	return (
		<div className={cn("space-y-4 relative", className)}>
			<div className="flex items-center justify-between gap-4">
				{searchKey && (
					<div className="relative flex items-center transition-all duration-300 focus-within:max-w-md max-w-sm flex-1">
						<Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground/50 transition-colors group-focus-within:text-primary" />
						<input
							placeholder={searchPlaceholder}
							value={
								(table.getColumn(searchKey)?.getFilterValue() as string) ?? ""
							}
							onChange={(event) =>
								table.getColumn(searchKey)?.setFilterValue(event.target.value)
							}
							className="w-full h-11 pl-10 pr-4 rounded-2xl bg-muted/20 border-border/50 border hover:bg-muted/30 focus:bg-background focus:ring-4 focus:ring-primary/5 focus:border-primary/20 transition-all text-sm outline-none"
						/>
					</div>
				)}

				{selectedRowsCount > 0 && (
					<div className="flex items-center gap-2 p-1 pl-4 pr-1 rounded-2xl bg-foreground text-background animate-in slide-in-from-right-4 fade-in duration-300">
						<span className="text-xs font-black uppercase tracking-widest mr-4">
							{selectedRowsCount} selected
						</span>
						{onBulkDelete && (
							<button
								type="button"
								aria-label="Delete selected rows"
								onClick={() => {
									const ids = table
										.getFilteredSelectedRowModel()
										.rows.map((r) => (r.original as { id: string }).id);
									onBulkDelete(ids);
								}}
								className="flex items-center justify-center p-2 rounded-xl hover:bg-white/10 transition-colors text-rose-400"
							>
								<Trash2 className="size-4" />
							</button>
						)}
						<button
							type="button"
							aria-label="Reset selection"
							onClick={() => table.resetRowSelection()}
							className="flex items-center justify-center p-2 rounded-xl hover:bg-white/10 transition-colors"
						>
							<X className="size-4" />
						</button>
					</div>
				)}
			</div>

			<div className="glass-card rounded-[2rem] overflow-hidden border border-border/50 shadow-2xl shadow-primary/5">
				<Table>
					<TableHeader className="bg-muted/30">
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow
								key={headerGroup.id}
								className="hover:bg-transparent border-border/50"
							>
								{headerGroup.headers.map((header) => {
									return (
										<TableHead
											key={header.id}
											className="h-14 text-xs font-black uppercase tracking-widest text-muted-foreground/40"
										>
											{header.isPlaceholder
												? null
												: flexRender(
														header.column.columnDef.header,
														header.getContext(),
													)}
										</TableHead>
									);
								})}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map((row) => (
								<TableRow
									key={row.id}
									data-state={row.getIsSelected() && "selected"}
									className="group transition-all duration-300 border-border/30 hover:bg-primary/2 data-[state=selected]:bg-primary/5"
								>
									{row.getVisibleCells().map((cell) => (
										<TableCell key={cell.id} className="py-4">
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext(),
											)}
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell
									colSpan={columns.length}
									className="h-48 text-center text-muted-foreground/50"
								>
									No results found.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
			<DataTablePagination table={table} />
		</div>
	);
}

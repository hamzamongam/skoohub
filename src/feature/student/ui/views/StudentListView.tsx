import type { ColumnDef } from "@tanstack/react-table";
import { Download, GraduationCap, MoreHorizontal, Plus } from "lucide-react";
import { type FC, useEffect, useState } from "react";
import { BaseCheckbox } from "@/components/base/checkbox";
import { DataTable } from "@/components/base/datatable";
import { PageLayout } from "@/components/layout/page-layout";
import { cn } from "@/lib/utils";

interface Student {
	id: string;
	name: string;
	email: string;
	grade: string;
	admissionNo: string;
	status: "active" | "inactive";
	avatar?: string;
}

const mockStudents: Student[] = [
	{
		id: "1",
		name: "Arjun Sharma",
		email: "arjun.s@school.edu",
		grade: "10-A",
		admissionNo: "ADM-2024-001",
		status: "active",
	},
	{
		id: "2",
		name: "Priya Patel",
		email: "priya.p@school.edu",
		grade: "9-B",
		admissionNo: "ADM-2024-002",
		status: "active",
	},
	{
		id: "3",
		name: "Rohan Gupta",
		email: "rohan.g@school.edu",
		grade: "11-C",
		admissionNo: "ADM-2024-003",
		status: "inactive",
	},
	{
		id: "4",
		name: "Sanya Malhotra",
		email: "sanya.m@school.edu",
		grade: "12-A",
		admissionNo: "ADM-2024-004",
		status: "active",
	},
];

const studentColumns: ColumnDef<Student>[] = [
	{
		id: "select",
		header: ({ table }) => (
			<BaseCheckbox
				checked={table.getIsAllPageRowsSelected()}
				onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
				aria-label="Select all"
			/>
		),
		cell: ({ row }) => (
			<BaseCheckbox
				checked={row.getIsSelected()}
				onCheckedChange={(value) => row.toggleSelected(!!value)}
				aria-label="Select row"
			/>
		),
		enableSorting: false,
		enableHiding: false,
	},
	{
		accessorKey: "name",
		header: "Student",
		cell: ({ row }) => (
			<div className="flex items-center gap-3">
				<div className="size-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-black shadow-inner">
					{row.original.name.charAt(0)}
				</div>
				<div className="flex flex-col">
					<span className="font-bold text-foreground">{row.original.name}</span>
					<span className="text-[11px] text-muted-foreground/60">
						{row.original.email}
					</span>
				</div>
			</div>
		),
	},
	{
		accessorKey: "admissionNo",
		header: "Admission No",
		cell: ({ row }) => (
			<code className="text-[11px] font-bold bg-muted/50 px-2 py-1 rounded-lg border border-border/50">
				{row.original.admissionNo}
			</code>
		),
	},
	{
		accessorKey: "grade",
		header: "Grade",
		cell: ({ row }) => (
			<div className="flex items-center gap-2">
				<GraduationCap className="size-3.5 text-muted-foreground/40" />
				<span className="text-sm font-medium">{row.original.grade}</span>
			</div>
		),
	},
	{
		accessorKey: "status",
		header: "Status",
		cell: ({ row }) => {
			const status = row.original.status;
			return (
				<div
					className={cn(
						"inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider",
						status === "active"
							? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/10"
							: "bg-muted text-muted-foreground border border-border",
					)}
				>
					<div
						className={cn(
							"size-1.5 rounded-full animate-pulse",
							status === "active" ? "bg-emerald-500" : "bg-muted-foreground/40",
						)}
					/>
					{status}
				</div>
			);
		},
	},
	{
		id: "actions",
		cell: () => (
			<button
				type="button"
				className="p-2 hover:bg-muted rounded-xl transition-colors opacity-40 hover:opacity-100"
			>
				<MoreHorizontal className="size-4" />
			</button>
		),
	},
];

const StudentListView: FC = () => {
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const timer = setTimeout(() => setIsLoading(false), 1500);
		return () => clearTimeout(timer);
	}, []);

	return (
		<PageLayout
			title="Students"
			subtitle="Manage your school's student directory and records"
			actions={
				<>
					<button
						type="button"
						onClick={() => setIsLoading(true)}
						className="flex h-10 items-center justify-center gap-2 rounded-xl border border-border bg-background px-4 text-xs font-bold transition-all hover:bg-muted"
					>
						Simulate Load
					</button>
					<button
						type="button"
						className="hidden h-10 items-center justify-center gap-2 rounded-xl border border-border bg-background px-4 text-xs font-bold transition-all hover:bg-muted md:flex"
					>
						<Download className="size-3.5" />
						Export
					</button>
					<button
						type="button"
						className="flex h-10 items-center justify-center gap-2 rounded-xl bg-foreground px-4 text-xs font-bold text-background transition-all hover:scale-[1.02] active:scale-[0.98]"
					>
						<Plus className="size-3.5" />
						Add Student
					</button>
				</>
			}
		>
			<DataTable
				columns={studentColumns}
				data={mockStudents}
				searchKey="name"
				searchPlaceholder="Search by student name..."
				isLoading={isLoading}
				onBulkDelete={(_ids) => {
					// Implement bulk delete
				}}
			/>
		</PageLayout>
	);
};

export default StudentListView;

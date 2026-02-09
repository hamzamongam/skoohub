import { Link } from "@tanstack/react-router";
import type { ColumnDef } from "@tanstack/react-table";
import { GraduationCap } from "lucide-react";
import { BaseCheckbox } from "@/components/base/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import type { StudentSchemaOutputType } from "../contract/student.shema";
import { StudentRowActions } from "../ui/components/StudentRowActions";

export const getStudentColumns = (
	onEdit: (student: StudentSchemaOutputType) => void,
): ColumnDef<StudentSchemaOutputType>[] => [
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
				{/* <div className="size-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-black shadow-inner">
					{row.original.name.charAt(0)}
				</div> */}
				<Avatar>
					<AvatarImage
						src={(row.original.image as string) ?? ""}
						alt="@shadcn"
						className="grayscale"
					/>
					<AvatarFallback>{row.original.name.charAt(0)}</AvatarFallback>
				</Avatar>
				<div className="flex flex-col">
					<Link
						to="/dashboard/students/$studentId"
						params={{ studentId: row.original.id }}
						className="font-bold text-foreground hover:text-primary transition-colors cursor-pointer"
					>
						{row.original.name}
					</Link>
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
				{row.original.admissionNumber}
			</code>
		),
	},
	{
		accessorKey: "class.name",
		header: "Class",
		cell: ({ row }) => (
			<div className="flex items-center gap-2">
				<GraduationCap className="size-3.5 text-muted-foreground/40" />
				<span className="text-sm font-medium">{row.original.class?.name}</span>
			</div>
		),
	},
	{
		accessorKey: "status",
		header: "Status",
		cell: ({ row }) => {
			const status = row.original.isActive;
			return (
				<div
					className={cn(
						"inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider",
						status === true
							? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/10"
							: "bg-muted text-muted-foreground border border-border",
					)}
				>
					<div
						className={cn(
							"size-1.5 rounded-full animate-pulse",
							status === true ? "bg-emerald-500" : "bg-muted-foreground/40",
						)}
					/>
					{status === true ? "Active" : "Inactive"}
				</div>
			);
		},
	},
	{
		id: "actions",
		cell: ({ row }) => {
			return <StudentRowActions id={row.original.id} />;
		},
	},
];

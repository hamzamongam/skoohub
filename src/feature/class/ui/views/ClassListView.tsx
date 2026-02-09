import { useQuery } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import { Pencil, Plus } from "lucide-react";
import { useState } from "react";
import { BaseButton } from "@/components/base/button";
import { DataTable } from "@/components/base/datatable/DataTable";
import { PageLayout } from "@/components/layout/page-layout";
import { Button } from "@/components/ui/button";
import { orpc } from "@/server/orpc/client";
import type { ClassSchemaOutputType } from "../../contract/class.schema";
import { ClassRowActions } from "../components/ClassRowActions";
import { AddStudentModal } from "../modals/AddStudentModal";

export const ClassListView = () => {
	const { data: classes, isLoading } = useQuery(orpc.class.list.queryOptions());
	const [isOpen, setIsOpen] = useState(false);
	const [selectedClass, setSelectedClass] = useState<
		ClassSchemaOutputType | undefined
	>(undefined);

	const handleEdit = (cls: ClassSchemaOutputType) => {
		setSelectedClass(cls);
		setIsOpen(true);
	};

	const handleAdd = () => {
		setSelectedClass(undefined);
		setIsOpen(true);
	};

	const handleClose = () => {
		setIsOpen(false);
		setSelectedClass(undefined);
	};

	const columns: ColumnDef<ClassSchemaOutputType>[] = [
		{
			accessorKey: "name",
			header: "Name",
		},
		{
			accessorKey: "grade",
			header: "Grade",
		},
		{
			accessorKey: "section",
			header: "Section",
		},
		{
			accessorKey: "medium",
			header: "Medium",
		},
		{
			accessorKey: "classTeacher.user.name",
			header: "Class Teacher",
			cell: ({ row }: any) => row.original.classTeacher?.user?.name || "N/A",
		},
		{
			id: "actions",
			cell: ({ row }) => (
				<ClassRowActions
					id={row.original.id}
					onClickEdit={() => handleEdit(row.original)}
				/>
			),
		},
	];

	return (
		<PageLayout
			title="Classes"
			subtitle="Manage your school's class directory and records"
			actions={
				<BaseButton
					leftIcon={<Plus className="size-3.5" />}
					onClick={() => setIsOpen(true)}
					type="button"
					className="flex h-10 items-center justify-center gap-2 rounded-xl bg-foreground px-4 text-xs font-bold text-background transition-all hover:scale-[1.02] active:scale-[0.98]"
				>
					Add Class
				</BaseButton>
			}
		>
			<DataTable
				columns={columns}
				data={classes?.data || []}
				isLoading={isLoading}
			/>

			{isOpen && (
				<AddStudentModal
					open={isOpen}
					onOpenChange={(val) => setIsOpen(val ?? false)}
					classData={selectedClass}
					classId={selectedClass?.id}
					onSuccess={handleClose}
					onCancel={handleClose}
				/>
			)}
		</PageLayout>
	);
};

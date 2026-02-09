import { Link } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { type FC, useState } from "react";
import { BaseButton } from "@/components/base/button";
import { PageLayout } from "@/components/layout/page-layout";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import type { StudentSchemaOutputType } from "../../contract/student.shema";
import { StudentListTable } from "../components/StudentListTable";
import useStudentList from "../hooks/useStudentList";

const StudentListView: FC = () => {
	const { data, isLoading } = useStudentList();
	const [isOpen, setIsOpen] = useState(false);
	const [selectedStudent, setSelectedStudent] = useState<
		StudentSchemaOutputType | undefined
	>(undefined);

	const handleEdit = (student: StudentSchemaOutputType) => {
		setSelectedStudent(student);
		setIsOpen(true);
	};

	const handleAdd = () => {
		setSelectedStudent(undefined);
		setIsOpen(true);
	};

	const handleClose = () => {
		setIsOpen(false);
		setSelectedStudent(undefined);
	};

	return (
		<PageLayout
			title="Students"
			subtitle="Manage your school's student directory and records"
			actions={
				<BaseButton
					onClick={handleAdd}
					type="button"
					variant={"default"}
					leftIcon={<Plus className="size-3.5" />}
					render={<Link to="/dashboard/students/add" />}
					className="flex h-10 items-center justify-center gap-2 rounded-xl bg-foreground px-4 text-xs font-bold text-background transition-all hover:scale-[1.02] active:scale-[0.98]"
				>
					Add Student
				</BaseButton>
			}
		>
			<StudentListTable
				data={data?.data || []}
				isLoading={isLoading}
				onEdit={handleEdit}
			/>
		</PageLayout>
	);
};

export default StudentListView;

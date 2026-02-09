import { Link } from "@tanstack/react-router";
import { Eye, Pencil, Trash } from "lucide-react";
import type { FC } from "react";
import { BaseButton } from "@/components/base/button";
import { useStudentDelete } from "../hooks/useStudentDelete";

interface StudentRowActionsProps {
	id: string;
}

export const StudentRowActions: FC<StudentRowActionsProps> = ({ id }) => {
	const { handleDelete } = useStudentDelete(id);

	return (
		<div className="flex items-center gap-2">
			<BaseButton
				variant="ghost"
				size="icon"
				className="size-8 p-0 text-white hover:text-primary hover:bg-primary/10"
				render={
					<Link
						to="/dashboard/students/$studentId"
						params={{ studentId: id }}
					/>
				}
			>
				<Eye className="size-4 text-white" />
			</BaseButton>
			<BaseButton
				variant="ghost"
				size="icon"
				className="size-8 p-0 text-white hover:text-orange-500 hover:bg-orange-500/10"
				render={
					<Link
						to="/dashboard/students/$studentId/edit"
						params={{ studentId: id }}
					/>
				}
			>
				<Pencil className="size-4 text-white" />
			</BaseButton>
			<BaseButton
				variant="ghost"
				size="icon"
				className="size-8 p-0 text-white hover:text-red-500 hover:bg-red-500/10"
				onClick={handleDelete}
			>
				<Trash className="size-4 text-white" />
			</BaseButton>
		</div>
	);
};

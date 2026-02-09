import { useQuery } from "@tanstack/react-query";
import BaseModal from "@/components/base/dialog/BaseModal";
import { orpc } from "@/server/orpc/client";
import type { ClassSchemaOutputType } from "../../contract/class.schema";
import ClassForm from "../components/ClassForm";
import useClassForm from "../hooks/useClassForm";

interface AddStudentModalProps {
	classData?: ClassSchemaOutputType;
	classId?: string;
	onSuccess?: () => void;
	onCancel?: () => void;
	open: boolean;
	onOpenChange?: (b?: boolean) => void;
}

export const AddStudentModal = ({
	classData,
	classId,
	onSuccess,
	onCancel,
	onOpenChange,
	open,
}: AddStudentModalProps) => {
	const { form, handleSubmit, isPending } = useClassForm({
		onSuccess,
		classData,
		classId,
	});

	const { data: teachers } = useQuery(orpc.teacher.list.queryOptions());

	const teacherOptions =
		teachers?.data?.map((t: any) => ({
			label: t.user.name,
			value: t.id,
		})) || [];

	const mediumOptions = [
		{ label: "English", value: "English" },
		{ label: "Malayalam", value: "Malayalam" },
		{ label: "Tamil", value: "Tamil" },
		{ label: "Hindi", value: "Hindi" },
		{ label: "Urdu", value: "Urdu" },
		{ label: "Arabic", value: "Arabic" },
		{ label: "Other", value: "Other" },
	];

	return (
		<BaseModal
			title={`${classId ? "Edit" : "Add"} Student`}
			open={open}
			onOpenChange={onOpenChange}
			className="sm:max-w-3xl"
		>
			<ClassForm
				mode={classId ? "edit" : "add"}
				isPending={isPending}
				form={form}
				handleSubmit={handleSubmit}
			/>
		</BaseModal>

		// <InternalForm
		// 	form={form as any}
		// 	onSubmit={handleSubmit}
		// 	isPending={isPending}
		// 	onCancel={onCancel}
		// 	schema={[
		// 		{
		// 			name: "name",
		// 			label: "Class Name",
		// 			type: "text",
		// 			placeholder: "e.g., 10-A",
		// 		},
		// 		{
		// 			name: "grade",
		// 			label: "Grade",
		// 			type: "text",
		// 			placeholder: "e.g., 10",
		// 		},
		// 		{
		// 			name: "section",
		// 			label: "Section",
		// 			type: "text",
		// 			placeholder: "e.g., A",
		// 		},
		// 		{
		// 			name: "medium",
		// 			label: "Medium",
		// 			type: "select",
		// 			options: mediumOptions,
		// 		},
		// 		{
		// 			name: "classTeacherId",
		// 			label: "Class Teacher",
		// 			type: "select",
		// 			options: teacherOptions,
		// 		},
		// 		{
		// 			name: "capacity",
		// 			label: "Capacity",
		// 			type: "number",
		// 			placeholder: "e.g., 40",
		// 		},
		// 	]}
		// />
	);
};

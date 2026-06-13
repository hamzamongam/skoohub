import BaseModal from "@/components/base/dialog/BaseModal";
import type { ClassSchemaOutputType } from "../../contract/class.schema";
import ClassForm from "../components/ClassForm";
import useClassForm from "../hooks/useClassForm";

interface AddClassModalProps {
	classData?: ClassSchemaOutputType;
	classId?: string;
	onSuccess?: () => void;
	open: boolean;
	onOpenChange?: (b?: boolean) => void;
}

export const AddClassModal = ({
	classData,
	classId,
	onSuccess,
	onOpenChange,
	open,
}: AddClassModalProps) => {
	const { form, handleSubmit, isPending } = useClassForm({
		onSuccess,
		classData,
		classId,
	});

	return (
		<BaseModal
			title={`${classId ? "Edit" : "Add"} Class`}
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
	);
};

export default AddClassModal;

import type { FC } from "react";
import type { UseFormReturn } from "react-hook-form";
import type { z } from "zod";
import BaseForm from "@/components/base/forms";
import { BaseInput } from "@/components/base/input";
import type { StudentSchema } from "../../contract/student.contract";

type StudentFormData = z.infer<typeof StudentSchema>;

interface AcademicDetailsProps {
	form: UseFormReturn<StudentFormData>;
}

export const AcademicDetails: FC<AcademicDetailsProps> = ({ form }) => {
	return (
		<BaseForm.Card title="Academic Information">
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
				<BaseForm.Item
					control={form.control}
					name="admissionNumber"
					label="Admission Number"
				>
					<BaseInput placeholder="ADM-001" />
				</BaseForm.Item>

				<BaseForm.Item
					control={form.control}
					name="rollNumber"
					label="Roll Number"
				>
					<BaseInput placeholder="12" />
				</BaseForm.Item>

				<BaseForm.Item
					control={form.control}
					name="joiningDate"
					label="Joining Date"
				>
					<BaseInput type="date" />
				</BaseForm.Item>
			</div>
		</BaseForm.Card>
	);
};

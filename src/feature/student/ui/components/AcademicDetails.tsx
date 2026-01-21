import type { FC } from "react";
import type { UseFormReturn } from "react-hook-form";
import { BaseDatePicker } from "@/components/base/datepicker/BaseDatePicker";
import BaseForm from "@/components/base/forms";
import { BaseInput } from "@/components/base/input";
import { BaseSelect } from "@/components/base/select/BaseSelect";
import type { StudentSchemaInputType } from "../../contract/student.shema";

interface AcademicDetailsProps {
	form: UseFormReturn<StudentSchemaInputType>;
}

export const AcademicDetails: FC<AcademicDetailsProps> = ({ form }) => {
	return (
		<BaseForm.Card title="Academic Information">
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
				<div className="md:col-span-2">
					<BaseForm.Item
						control={form.control}
						name="admissionNumber"
						label="Admission Number"
					>
						<BaseInput placeholder="ADM-001" />
					</BaseForm.Item>
				</div>

				<div className="md:col-span-2">
					<BaseForm.Item
						control={form.control}
						name="joiningDate"
						label="Joining Date"
					>
						<BaseDatePicker
							placeholder="Select Joining Date"
							error={!!form.formState.errors.joiningDate}
						/>
					</BaseForm.Item>
				</div>

				<div className="md:col-span-2">
					<BaseForm.Item
						control={form.control}
						name="sectionId"
						label="Class / Section"
					>
						{/* TODO: Fetch active sections from API */}
						<BaseSelect
							// Placeholder data until sections API is available
							data={[]}
							placeholder="Select Class/Section"
						/>
					</BaseForm.Item>
				</div>

				<div className="md:col-span-2">
					<BaseForm.Item
						control={form.control}
						name="rollNumber"
						label="Roll Number"
					>
						<BaseInput placeholder="12" />
					</BaseForm.Item>
				</div>
			</div>
		</BaseForm.Card>
	);
};

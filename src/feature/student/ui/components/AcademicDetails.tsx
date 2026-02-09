import { useQuery } from "@tanstack/react-query";
import type { FC } from "react";
import type { UseFormReturn } from "react-hook-form";
import { BaseDatePicker } from "@/components/base/datepicker/BaseDatePicker";
import BaseForm from "@/components/base/forms";
import { BaseInput } from "@/components/base/input";
import { BaseSelect } from "@/components/base/select/BaseSelect";
import { orpc } from "@/server/orpc/client";
import type { StudentSchemaInputType } from "../../contract/student.shema";

interface AcademicDetailsProps {
	form: UseFormReturn<StudentSchemaInputType>;
}

export const AcademicDetails: FC<AcademicDetailsProps> = ({ form }) => {
	const { data: classes } = useQuery(orpc.class.list.queryOptions());

	const classOptions =
		classes?.data?.map((cls) => ({
			label: `${cls.name} (${cls.grade}-${cls.section})`,
			value: cls.id,
		})) || [];

	return (
		<BaseForm.Card title="Academic Information">
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
				<div>
					<BaseForm.Item
						control={form.control}
						name="admissionNumber"
						label="Admission Number"
					>
						<BaseInput placeholder="ADM-001" />
					</BaseForm.Item>
				</div>

				<div>
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

				<div>
					<BaseForm.Item control={form.control} name="classId" label="Class">
						<BaseSelect data={classOptions} placeholder="Select Class" />
					</BaseForm.Item>
				</div>

				<div>
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

import type { FC } from "react";
import type { UseFormReturn } from "react-hook-form";
import type { z } from "zod";
import BaseForm from "@/components/base/forms";
import { BaseInput } from "@/components/base/input";
import type { StudentSchema } from "../../contract/student.contract";

type StudentFormData = z.infer<typeof StudentSchema>;

interface GuardianDetailsProps {
	form: UseFormReturn<StudentFormData>;
}

export const GuardianDetails: FC<GuardianDetailsProps> = ({ form }) => {
	return (
		<BaseForm.Card title="Guardian Information">
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
				<BaseForm.Item
					control={form.control}
					name="guardianName"
					label="Guardian Name"
				>
					<BaseInput placeholder="Jane Doe" />
				</BaseForm.Item>

				<BaseForm.Item
					control={form.control}
					name="guardianRelation"
					label="Relation"
				>
					<BaseInput placeholder="Mother" />
				</BaseForm.Item>

				<BaseForm.Item
					control={form.control}
					name="guardianPhone"
					label="Contact Phone"
				>
					<BaseInput placeholder="+1 234..." />
				</BaseForm.Item>

				<BaseForm.Item
					control={form.control}
					name="guardianEmail"
					label="Contact Email"
				>
					<BaseInput type="email" placeholder="guardian@example.com" />
				</BaseForm.Item>
			</div>
		</BaseForm.Card>
	);
};

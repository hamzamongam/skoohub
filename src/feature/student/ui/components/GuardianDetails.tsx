import type { FC } from "react";
import type { UseFormReturn } from "react-hook-form";
import type { z } from "zod";
import BaseForm from "@/components/base/forms";
import { BaseInput } from "@/components/base/input";
import { BasePhoneInput } from "@/components/base/input/BasePhoneInput";
import { BaseSelect } from "@/components/base/select/BaseSelect";
import type { StudentSchemaInputType } from "../../contract/student.shema";

interface GuardianDetailsProps {
	form: UseFormReturn<StudentSchemaInputType>;
}

export const GuardianDetails: FC<GuardianDetailsProps> = ({ form }) => {
	return (
		<BaseForm.Card title="Parent & Guardian Information">
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
				<div className="md:col-span-2">
					<BaseForm.Item
						control={form.control}
						name="fatherName"
						label="Father Name"
					>
						<BaseInput placeholder="Father Name" />
					</BaseForm.Item>
				</div>

				<div className="md:col-span-2">
					<BaseForm.Item
						control={form.control}
						name="motherName"
						label="Mother Name"
					>
						<BaseInput placeholder="Mother Name" />
					</BaseForm.Item>
				</div>

				<div className="md:col-span-2">
					<BaseForm.Item
						control={form.control}
						name="guardianName"
						label="Guardian Name"
					>
						<BaseInput placeholder="Jane Doe" />
					</BaseForm.Item>
				</div>

				<div className="md:col-span-2">
					<BaseForm.Item
						control={form.control}
						name="guardianRelation"
						label="Relation"
					>
						<BaseSelect
							value={form.watch("guardianRelation") || ""}
							onChange={(val: string) => form.setValue("guardianRelation", val)}
							data={[
								{ value: "FATHER", label: "Father" },
								{ value: "MOTHER", label: "Mother" },
								{ value: "BROTHER", label: "Brother" },
								{ value: "SISTER", label: "Sister" },
								{ value: "UNCLE", label: "Uncle" },
								{ value: "AUNT", label: "Aunt" },
								{ value: "GRANDFATHER", label: "Grandfather" },
								{ value: "GRANDMOTHER", label: "Grandmother" },
								{ value: "OTHER", label: "Other" },
							]}
							placeholder="Select Relation"
						/>
					</BaseForm.Item>
				</div>

				<div className="md:col-span-2">
					<BaseForm.Item
						control={form.control}
						name="guardianPhone"
						label="Contact Phone"
					>
						<BasePhoneInput placeholder="Enter phone number" />
					</BaseForm.Item>
				</div>

				<div className="md:col-span-2">
					<BaseForm.Item
						control={form.control}
						name="guardianEmail"
						label="Contact Email"
					>
						<BaseInput type="email" placeholder="guardian@example.com" />
					</BaseForm.Item>
				</div>
			</div>
		</BaseForm.Card>
	);
};

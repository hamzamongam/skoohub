import type { FC } from "react";
import type { UseFormReturn } from "react-hook-form";
import type { z } from "zod";
import { BaseDatePicker } from "@/components/base/datepicker/BaseDatePicker";
import BaseForm from "@/components/base/forms";
import { BaseInput } from "@/components/base/input";
import { BasePhoneInput } from "@/components/base/input/BasePhoneInput";
import { BaseSelect } from "@/components/base/select/BaseSelect";
import { BaseImageUpload } from "@/components/base/upload/BaseImageUpload";
import type { StudentSchemaInputType } from "../../contract/student.shema";

interface PersonalDetailsProps {
	form: UseFormReturn<StudentSchemaInputType>;
}

export const PersonalDetails: FC<PersonalDetailsProps> = ({ form }) => {
	return (
		<BaseForm.Card title="Personal Information">
			<div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
				<div className="lg:col-span-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
					<div className="md:col-span-2 lg:col-span-1">
						<BaseForm.Item control={form.control} name="name" label="Full Name">
							<BaseInput placeholder="John Doe" />
						</BaseForm.Item>
					</div>

					<div className="md:col-span-2 lg:col-span-1">
						<BaseForm.Item control={form.control} name="email" label="Email">
							<BaseInput type="email" placeholder="john@example.com" />
						</BaseForm.Item>
					</div>

					<div className="md:col-span-2 lg:col-span-1">
						<BaseForm.Item control={form.control} name="phone" label="Phone">
							<BasePhoneInput placeholder="Student Phone" />
						</BaseForm.Item>
					</div>

					<BaseForm.Item
						control={form.control}
						name="dob"
						label="Date of Birth"
					>
						<BaseDatePicker
							placeholder="Select Date of Birth"
							error={!!form.formState.errors.dob}
						/>
					</BaseForm.Item>

					<BaseForm.Item control={form.control} name="gender" label="Gender">
						<BaseSelect
							data={[
								{ value: "MALE", label: "Male" },
								{ value: "FEMALE", label: "Female" },
								{ value: "OTHER", label: "Other" },
							]}
							placeholder="Select Gender"
						/>
					</BaseForm.Item>

					<BaseForm.Item
						control={form.control}
						name="bloodGroup"
						label="Blood Group"
					>
						<BaseSelect
							data={[
								{ value: "A+", label: "A+" },
								{ value: "A-", label: "A-" },
								{ value: "B+", label: "B+" },
								{ value: "B-", label: "B-" },
								{ value: "O+", label: "O+" },
								{ value: "O-", label: "O-" },
								{ value: "AB+", label: "AB+" },
								{ value: "AB-", label: "AB-" },
							]}
							placeholder="Select Blood Group"
						/>
					</BaseForm.Item>

					<div className="md:col-span-2 lg:col-span-3">
						<BaseForm.Item
							control={form.control}
							name="address"
							label="Address"
						>
							<BaseInput placeholder="123 Main St" />
						</BaseForm.Item>
					</div>
				</div>

				<div className="lg:col-span-2 order-first lg:order-last">
					<BaseForm.Item
						control={form.control}
						name="image"
						label="Profile Image"
					>
						<div className="space-y-1 h-full">
							<BaseImageUpload className="h-full" manualUpload={true} />
							<p className="text-[10px] text-muted-foreground text-center lg:text-left">
								Upload a profile picture (max 5MB)
							</p>
						</div>
					</BaseForm.Item>
				</div>
			</div>
		</BaseForm.Card>
	);
};

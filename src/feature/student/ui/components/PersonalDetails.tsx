import type { FC } from "react";
import type { UseFormReturn } from "react-hook-form";
import type { z } from "zod";
import BaseForm from "@/components/base/forms";
import { BaseInput } from "@/components/base/input";
import { BaseSelect } from "@/components/base/select/BaseSelect";
import { BaseImageUpload } from "@/components/base/upload/BaseImageUpload";
import type { StudentSchema } from "../../contract/student.contract";

type StudentFormData = z.infer<typeof StudentSchema>;

interface PersonalDetailsProps {
	form: UseFormReturn<StudentFormData>;
}

export const PersonalDetails: FC<PersonalDetailsProps> = ({ form }) => {
	return (
		<BaseForm.Card title="Personal Information">
			<div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
				<div className="lg:col-span-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
					<BaseForm.Item control={form.control} name="name" label="Full Name">
						<BaseInput placeholder="John Doe" />
					</BaseForm.Item>

					<BaseForm.Item control={form.control} name="email" label="Email">
						<BaseInput type="email" placeholder="john@example.com" />
					</BaseForm.Item>

					<BaseForm.Item
						control={form.control}
						name="dob"
						label="Date of Birth"
					>
						<BaseInput type="date" />
					</BaseForm.Item>

					<BaseForm.Item control={form.control} name="gender" label="Gender">
						<BaseSelect
							value={form.watch("gender") || ""}
							onChange={(val) =>
								form.setValue("gender", val as "MALE" | "FEMALE" | "OTHER")
							}
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
						<BaseInput placeholder="O+" />
					</BaseForm.Item>

					<BaseForm.Item control={form.control} name="address" label="Address">
						<BaseInput placeholder="123 Main St" />
					</BaseForm.Item>
				</div>

				<div className="lg:col-span-2 order-first lg:order-last">
					<BaseForm.Item
						control={form.control}
						name="image"
						label="Profile Image"
					>
						<div className="space-y-1 h-full">
							<BaseImageUpload
								className="h-full"
								value={form.watch("image") as any}
								onChange={(val) =>
									form.setValue("image", val as any, { shouldDirty: true })
								}
								manualUpload={true}
							/>
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

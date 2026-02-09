import React, { type FC } from "react";
import { BaseButton } from "@/components/base/button";
import BaseForm from "@/components/base/forms";
import { BaseInput } from "@/components/base/input";
import { BaseInputNumber } from "@/components/base/input/BaseInputNumber";
import { BaseSelect } from "@/components/base/select";
import type { UseClassFormReturn } from "../hooks/useClassForm";

type ClassFormProps = UseClassFormReturn & {
	mode: "add" | "edit";
};
const ClassForm: FC<ClassFormProps> = ({
	form,
	handleSubmit,
	isPending,
	mode = "add",
}) => {
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
		<BaseForm
			form={form}
			onSubmit={handleSubmit}
			className="grid grid-cols-4 gap-4  duration-500"
		>
			<BaseForm.Item
				className="col-span-2"
				label="Name"
				control={form.control}
				name="name"
			>
				<BaseInput placeholder="Enter class name" />
			</BaseForm.Item>
			<BaseForm.Item
				className="col-span-2"
				label="Grade"
				control={form.control}
				name="grade"
			>
				<BaseInput placeholder="Enter grade" />
			</BaseForm.Item>
			<BaseForm.Item
				className="col-span-2"
				label="Section"
				control={form.control}
				name="section"
			>
				<BaseInput placeholder="Enter section" />
			</BaseForm.Item>
			<BaseForm.Item
				className="col-span-2"
				label="Medium"
				control={form.control}
				name="medium"
			>
				<BaseSelect placeholder="Select medium" data={mediumOptions} />
			</BaseForm.Item>
			<BaseForm.Item
				label="Class Teacher"
				className="col-span-2"
				control={form.control}
				name="classTeacherId"
			>
				<BaseInput placeholder="Enter class teacher" />
			</BaseForm.Item>
			<BaseForm.Item
				className="col-span-2"
				label="Capacity"
				control={form.control}
				name="capacity"
			>
				<BaseInputNumber placeholder="Enter capacity" />
			</BaseForm.Item>
			<div className="pt-4 col-span-4 flex justify-end gap-4">
				<BaseButton type="button" variant="outline">
					Reset
				</BaseButton>
				<BaseButton type="submit" isLoading={isPending} loadingText="Saving...">
					{mode === "add" ? "Add Class" : "Update Class"}
				</BaseButton>
			</div>
		</BaseForm>
	);
};

export default ClassForm;

"use client";

import type { FC } from "react";
import type { SubmitHandler } from "react-hook-form";
import type { z } from "zod";
import { BaseButton } from "@/components/base/button";
import BaseForm from "@/components/base/forms";
import useBaseForm from "@/components/base/forms/useBaseForm";
import {
	StudentSchemaInput,
	type StudentSchemaInputType,
} from "../../contract/student.shema";
import { AcademicDetails } from "./AcademicDetails";
import { GuardianDetails } from "./GuardianDetails";
import { PersonalDetails } from "./PersonalDetails";

interface StudentFormProps {
	onSubmit: (data: StudentSchemaInputType) => void;
	initialData?: StudentSchemaInputType;
	isLoading?: boolean;
	schoolId: string;
}

const StudentForm: FC<StudentFormProps> = ({
	onSubmit,
	initialData,
	isLoading,
	schoolId,
}) => {
	const [form] = useBaseForm({
		schema: StudentSchemaInput,
		defaultValues: {
			name: "",
			email: "",
			schoolId,
			...initialData,
		},
	});

	const handleSubmit: SubmitHandler<StudentSchemaInputType> = async (
		values,
	) => {
		console.log(values);
	};

	return (
		<BaseForm
			form={form}
			onSubmit={handleSubmit}
			className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500"
		>
			<PersonalDetails form={form} />
			<GuardianDetails form={form} />
			<AcademicDetails form={form} />

			{form.formState.errors && (
				<div>
					<pre>{JSON.stringify(form.formState.errors, null, 2)}</pre>
				</div>
			)}

			<div className="pt-4 space-x-4">
				<BaseButton type="submit" isLoading={isLoading} loadingText="Saving...">
					{/* {initialData?.id ? "Update Student" : "Register Student"} */}
				</BaseButton>
				<BaseButton type="button" variant="outline">
					Reset
				</BaseButton>
			</div>
		</BaseForm>
	);
};

export default StudentForm;

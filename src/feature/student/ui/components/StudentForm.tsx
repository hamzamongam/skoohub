"use client";

import type { FC } from "react";
import type { z } from "zod";
import { BaseButton } from "@/components/base/button";
import BaseForm from "@/components/base/forms";
import useBaseForm from "@/components/base/forms/useBaseForm";
import { uploadStudentImage } from "@/feature/upload/upload.server";
import { StudentSchema } from "../../contract/student.contract";
import { AcademicDetails } from "./AcademicDetails";
import { GuardianDetails } from "./GuardianDetails";
import { PersonalDetails } from "./PersonalDetails";

type StudentFormData = z.infer<typeof StudentSchema>;

interface StudentFormProps {
	onSubmit: (data: StudentFormData) => void;
	initialData?: Partial<StudentFormData>;
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
		schema: StudentSchema,
		defaultValues: {
			name: "",
			email: "",
			schoolId,
			...initialData,
		} as any, // Cast needed if implicit types don't match exactly with optional fields
	});

	const handleSubmit = async (data: StudentFormData) => {
		try {
			let imageUrl = data.image;

			// Check if image is a File object (local upload)
			if (data.image && (data.image as any) instanceof File) {
				const formData = new FormData();
				formData.append("file", data.image as any);
				const result = await uploadStudentImage({ data: formData });
				if (result?.url) {
					imageUrl = result.url;
				}
			}

			onSubmit({
				...data,
				image: imageUrl,
			});
		} catch (error) {
			console.error("Error uploading image:", error);
			// Optional: Trigger form error using setError if needed
		}
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

			<div className="pt-4 space-x-4">
				<BaseButton type="submit" isLoading={isLoading} loadingText="Saving...">
					{initialData?.id ? "Update Student" : "Register Student"}
				</BaseButton>
				<BaseButton type="button" variant="outline">
					Reset
				</BaseButton>
			</div>
		</BaseForm>
	);
};

export default StudentForm;

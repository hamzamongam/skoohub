"use client";

import type { FC } from "react";

import { BaseButton } from "@/components/base/button";
import BaseForm from "@/components/base/forms";

import type { UseStudentFormReturn } from "../hooks/useStudentForm";
import { AcademicDetails } from "./AcademicDetails";
import { GuardianDetails } from "./GuardianDetails";
import { PersonalDetails } from "./PersonalDetails";

type StudentFormProps = UseStudentFormReturn & {
	mode?: "create" | "edit";
};

const StudentForm: FC<StudentFormProps> = ({
	form,
	handleSubmit,
	isPending,
	mode,
}) => {
	return (
		<BaseForm
			form={form}
			onSubmit={handleSubmit}
			className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500"
		>
			<PersonalDetails form={form} />
			<GuardianDetails form={form} />
			<AcademicDetails form={form} />
			<div className="pt-4 flex justify-end space-x-4">
				<BaseButton type="button" variant="outline" disabled={isPending}>
					Reset
				</BaseButton>
				<BaseButton
					type="submit"
					isLoading={isPending}
					loadingText="Saving..."
					disabled={isPending}
				>
					{mode === "create" ? "Create Student" : "Update Student"}
				</BaseButton>
			</div>
		</BaseForm>
	);
};

export default StudentForm;

"use client";

import type { FC } from "react";
import { ContainerCard } from "@/components/base/ContainerCard";
import { PageLayout } from "@/components/layout/page-layout";
import StudentForm from "../components/StudentForm";
import useStudentForm from "../hooks/useStudentForm";

const CreateStudentView: FC = () => {
	const form = useStudentForm();
	return (
		<PageLayout
			isBack
			title="Register Student"
			subtitle="Add a new student to your database"
		>
			<div className="max-w-full">
				<ContainerCard>
					<StudentForm {...form} />
				</ContainerCard>
			</div>
		</PageLayout>
	);
};

export default CreateStudentView;

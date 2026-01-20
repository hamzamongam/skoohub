"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import type { FC } from "react";
import { PageLayout } from "@/components/layout/page-layout";
import { userQueryOptions } from "@/feature/auth/auth.functions";
import { useOrpcMutation } from "@/hooks/useOrpcMutation";
import { orpc } from "@/server/orpc/client";
import StudentForm from "../components/StudentForm";

const CreateStudentView: FC = () => {
	const router = useRouter();
	const { data: session } = useSuspenseQuery(userQueryOptions());
	const schoolId = session?.user.schoolId;

	const { mutate: createStudent, isPending } = useOrpcMutation(
		orpc.student.create.mutationOptions({
			onSuccess: () => {
				router.history.back(); // Or navigate to list
			},
		}),
		{
			successMessage: "Student registered successfully!",
		},
	);

	if (!schoolId) {
		return <div>Error: No school ID found for user.</div>;
	}

	return (
		<PageLayout
			title="Register Student"
			subtitle="Add a new student to your database"
		>
			<div className="max-w-full">
				<div className="bg-card border rounded-2xl p-6 shadow-sm">
					<StudentForm
						schoolId={schoolId}
						onSubmit={(data) => createStudent(data)}
						isLoading={isPending}
					/>
				</div>
			</div>
		</PageLayout>
	);
};

export default CreateStudentView;

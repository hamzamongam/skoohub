import { useSuspenseQuery } from "@tanstack/react-query";
import type { FC } from "react";
import { ContainerCard } from "@/components/base/ContainerCard";
import { PageLayout } from "@/components/layout/page-layout";
import { orpc } from "@/server/orpc/client";
import StudentForm from "../components/StudentForm";
import useStudentForm from "../hooks/useStudentForm";

interface EditStudentViewProps {
	studentId: string;
}

const EditStudentView: FC<EditStudentViewProps> = ({ studentId }) => {
	const { data: student } = useSuspenseQuery(
		orpc.student.get.queryOptions({
			input: {
				id: studentId,
			},
			staleTime: 1000 * 60, // 1 minute
		}),
	);
	const form = useStudentForm({ student: student.data, studentId });
	return (
		<PageLayout
			title="Edit Student"
			subtitle="Update student information"
			isBack
		>
			<div className="max-w-full">
				<ContainerCard>
					<StudentForm {...form} mode="edit" />
				</ContainerCard>
			</div>
		</PageLayout>
	);
};

export default EditStudentView;

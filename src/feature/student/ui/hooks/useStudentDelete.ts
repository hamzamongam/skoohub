import { useQueryClient } from "@tanstack/react-query";
import { useOrpcMutation } from "@/hooks/useOrpcMutation";
import { confirm } from "@/lib/confirm";
import { orpc } from "@/server/orpc/client";

export const useStudentDelete = (id: string) => {
	const queryClient = useQueryClient();
	const { mutateAsync: deleteStudent } = useOrpcMutation(
		orpc.student.delete.mutationOptions({
			onSuccess: () => {
				const previousStudents = queryClient.getQueryData(
					orpc.student.list.queryKey(),
				);
				queryClient.setQueryData(orpc.student.list.queryKey(), (old: any) => {
					if (!old) return old;
					return {
						...old,
						data: old.data.filter(
							(student: { id: string }) => student.id !== id,
						),
					};
				});
				queryClient.invalidateQueries({
					queryKey: orpc.student.list.queryKey(),
				});
				return { previousStudents };
			},
		}),
		{
			successMessage: "Student deleted successfully",
		},
	);
	const handleDelete = () => {
		confirm({
			title: "Delete Student",
			description:
				"Are you sure you want to delete this student? This action cannot be undone.",
			confirmText: "Delete",
			variant: "destructive",
			onConfirm: async () => {
				await deleteStudent({ id });
			},
		});
	};

	return { handleDelete };
};

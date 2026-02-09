import { useQueryClient } from "@tanstack/react-query";
import { useOrpcMutation } from "@/hooks/useOrpcMutation";
import { confirm } from "@/lib/confirm";
import { orpc } from "@/server/orpc/client";

export const useClassDelete = (id: string) => {
	const queryClient = useQueryClient();
	const { mutateAsync: deleteClass } = useOrpcMutation(
		orpc.class.delete.mutationOptions({
			onSuccess: () => {
				const previousClasses = queryClient.getQueryData(
					orpc.class.list.queryKey(),
				);
				queryClient.setQueryData(orpc.class.list.queryKey(), (old: any) => {
					if (!old) return old;
					return {
						...old,
						data: old.data.filter(
							(student: { id: string }) => student.id !== id,
						),
					};
				});
				queryClient.invalidateQueries({
					queryKey: orpc.class.list.queryKey(),
				});
				return { previousClasses };
			},
		}),
		{
			successMessage: "Class deleted successfully",
		},
	);
	const handleDelete = () => {
		confirm({
			title: "Delete Class",
			description:
				"Are you sure you want to delete this class? This action cannot be undone.",
			confirmText: "Delete",
			variant: "destructive",
			onConfirm: async () => {
				await deleteClass({ id });
			},
		});
	};

	return { handleDelete };
};

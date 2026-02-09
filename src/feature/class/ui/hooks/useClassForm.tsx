import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import type { SubmitHandler, UseFormReturn } from "react-hook-form";
import useBaseForm from "@/components/base/forms/useBaseForm";
import { useOrpcMutation } from "@/hooks/useOrpcMutation";
import { orpc } from "@/server/orpc/client";
import {
	ClassSchemaInput,
	type ClassSchemaInputType,
	type ClassSchemaOutputType,
} from "../../contract/class.schema";

export type UseClassFormProps = {
	onSuccess?: () => void;
	classData?: ClassSchemaOutputType;
	classId?: string;
};

export type UseClassFormReturn = {
	form: UseFormReturn<ClassSchemaInputType>;
	handleSubmit: SubmitHandler<ClassSchemaInputType>;
	isPending: boolean;
};

const useClassForm = ({
	onSuccess,
	classId,
	classData,
}: UseClassFormProps = {}): UseClassFormReturn => {
	const queryClient = useQueryClient();

	const { mutate: createClass, isPending: isCreating } = useOrpcMutation(
		orpc.class.create.mutationOptions({
			onSuccess: ({ data }) => {
				onSuccess?.();
				queryClient.setQueryData(orpc.class.list.queryKey(), (old: any) => {
					if (!old) return old;
					return {
						...old,
						data: [...old.data, data],
					};
				});
				queryClient.invalidateQueries({
					queryKey: orpc.class.list.queryKey(),
				});
			},
		}),
		{
			successMessage: "Class created successfully!",
		},
	);

	const { mutate: updateClass, isPending: isUpdating } = useOrpcMutation(
		orpc.class.update.mutationOptions({
			onSuccess: ({ data }) => {
				onSuccess?.();
				queryClient.invalidateQueries({
					queryKey: orpc.class.list.queryKey(),
				});
				if (classId) {
					queryClient.setQueryData(orpc.class.list.queryKey(), (old: any) => {
						if (!old) return old;
						return {
							...old,
							data: old.data.map((cls: any) => {
								if (cls.id === classId) {
									return data;
								}
								return cls;
							}),
						};
					});
					queryClient.setQueryData(
						orpc.class.get.queryKey({ input: { id: classId } }),
						(old: any) => {
							if (!old) return old;
							return {
								...old,
								data: data,
							};
						},
					);
					// queryClient.invalidateQueries({
					// 	queryKey: orpc.class.get.queryKey({ input: { id: classId } }),
					// });
				}
			},
		}),
		{
			successMessage: "Class updated successfully!",
		},
	);

	const defaultValues: ClassSchemaInputType = classData
		? {
				name: classData.name,
				grade: classData.grade,
				section: classData.section,
				medium: classData.medium,
				classTeacherId: classData.classTeacherId,
				capacity: classData.capacity || undefined,
				isActive: classData.isActive || true,
			}
		: {
				name: "",
				grade: "",
				section: "",
				medium: "English",
				classTeacherId: "",
				capacity: undefined,
				isActive: true,
			};

	const [form] = useBaseForm({
		schema: ClassSchemaInput,
		defaultValues,
	});

	useEffect(() => {
		if (classData) {
			form.reset({
				name: classData.name,
				grade: classData.grade,
				section: classData.section,
				medium: classData.medium,
				classTeacherId: classData.classTeacherId,
				capacity: classData.capacity || undefined,
				isActive: classData.isActive || true,
			});
		}
	}, [classData, form]);

	const handleSubmit: SubmitHandler<ClassSchemaInputType> = async (values) => {
		if (classId) {
			updateClass({ ...values, id: classId });
		} else {
			createClass(values);
		}
	};

	return { form, handleSubmit, isPending: isCreating || isUpdating };
};

export default useClassForm;

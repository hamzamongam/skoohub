import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import type { SubmitHandler, UseFormReturn } from "react-hook-form";
import useBaseForm from "@/components/base/forms/useBaseForm";
import { useOrpcMutation } from "@/hooks/useOrpcMutation";
import { orpc } from "@/server/orpc/client";
import {
	StudentSchemaInput,
	type StudentSchemaInputType,
	type StudentSchemaOutputType,
} from "../../contract/student.shema";

export type UseStudentFormProps = {
	onSuccess?: () => void;
	student?: StudentSchemaOutputType;
	studentId?: string;
};

export type UseStudentFormReturn = {
	form: UseFormReturn<StudentSchemaInputType>;
	handleSubmit: SubmitHandler<StudentSchemaInputType>;
	isPending: boolean;
};

const useStudentForm = ({
	onSuccess,
	studentId,
	student,
}: UseStudentFormProps = {}): UseStudentFormReturn => {
	const navigate = useNavigate();
	const queryClient = useQueryClient();

	const { mutate: createStudent, isPending: isCreating } = useOrpcMutation(
		orpc.student.create.mutationOptions({
			onSuccess: ({ data }) => {
				onSuccess?.();

				queryClient.setQueryData(orpc.student.list.queryKey(), (old: any) => {
					if (!old) return old;
					return {
						...old,
						data: [...old.data, data],
					};
				});

				queryClient.invalidateQueries({
					queryKey: orpc.student.list.queryKey(),
				});
				navigate({ to: "/dashboard/students" });
			},
		}),
		{
			successMessage: "Student registered successfully!",
		},
	);

	const { mutate: updateStudent, isPending: isUpdating } = useOrpcMutation(
		orpc.student.update.mutationOptions({
			onSuccess: ({ data }) => {
				onSuccess?.();
				queryClient.invalidateQueries({
					queryKey: orpc.student.list.queryKey(),
				});
				if (studentId) {
					// Manually update the cache with the new data
					queryClient.setQueryData(
						orpc.student.get.queryKey({ input: { id: studentId } }),
						(old: any) => {
							if (!old) return old;
							return {
								...old,
								data: data,
							};
						},
					);
				}
				navigate({ to: "/dashboard/students" });
			},
		}),
		{
			successMessage: "Student updated successfully!",
		},
	);

	// Transform student data to form values if available
	const defaultValues: StudentSchemaInputType = student
		? {
				...student,
				// Flatten nested profile data if necessary, based on how the schema expects it
				// Since we are using the same schema input, we might need to map it back depending on how 'get' returns it.
				// Assuming 'get' returns flattened view or we map it here.
				// Based on repo, it returns User including StudentProfile.
				// We need to map StudentProfile fields back to the flat form structure.
				dob: student.dob || undefined,
				gender: student.gender || "MALE",
				bloodGroup: student.bloodGroup || "",
				address: student.address || "",
				guardianName: student.guardianName || "",
				guardianPhone: student.guardianPhone || "",
				guardianEmail: student.guardianEmail || "",
				guardianRelation: student.guardianRelation || "",
				admissionNumber: student.admissionNumber || "",
				rollNumber: student.rollNumber || "",
				joiningDate: student.joiningDate || undefined,
				classId: student.classId || "",
			}
		: {
				name: "",
				email: "",
				// image: "",
				dob: new Date(),
				gender: "MALE",
				bloodGroup: "",
				address: "",
				guardianName: "",
				guardianPhone: "",
				guardianEmail: "",
				guardianRelation: "",
				admissionNumber: "",
				rollNumber: "",
				joiningDate: new Date(),
			};

	const [form] = useBaseForm({
		schema: StudentSchemaInput,
		defaultValues,
	});

	// Reset form when student data loads
	useEffect(() => {
		if (student) {
			form.reset({
				...student,
			});
		}
	}, [student, form]);

	const handleSubmit: SubmitHandler<StudentSchemaInputType> = async (
		values,
	) => {
		const payload = {
			...values,
			classId: values.classId || null,
			// schoolId: values.schoolId || null,
			// role: values.role || null,
			image: values.image || null,
			dob: values.dob || null,
			gender: values.gender || null,
			bloodGroup: values.bloodGroup || null,
			address: values.address || null,
			phone: values.phone || null,
			fatherName: values.fatherName || null,
			motherName: values.motherName || null,
			guardianName: values.guardianName || null,
			guardianPhone: values.guardianPhone || null,
			guardianEmail: values.guardianEmail || null,
			guardianRelation: values.guardianRelation || null,
			admissionNumber: values.admissionNumber || null,
			rollNumber: values.rollNumber || null,
			joiningDate: values.joiningDate || null,
		};

		if (studentId) {
			updateStudent({ ...payload, id: studentId });
		} else {
			createStudent(payload);
		}
	};

	return { form, handleSubmit, isPending: isCreating || isUpdating };
};

export default useStudentForm;

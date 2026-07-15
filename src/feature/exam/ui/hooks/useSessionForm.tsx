import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import type { SubmitHandler, UseFormReturn } from "react-hook-form";
import z from "zod";
import useBaseForm from "@/components/base/forms/useBaseForm";
import { useOrpcMutation } from "@/hooks/useOrpcMutation";
import { orpc } from "@/server/orpc/client";
import type { AcademicYearResponse } from "../../contract/exam.schema";

export const SessionFormSchema = z.object({
	name: z.string().min(1, "Academic Year Name is required"),
	startDate: z.string().min(1, "Start date is required"),
	endDate: z.string().min(1, "End date is required"),
	isActive: z.boolean().default(false),
	gradingSystem: z.enum(["GPA", "PERCENTAGE", "LETTER"]),
}).refine((data) => new Date(data.startDate) < new Date(data.endDate), {
	message: "Start date must be before end date",
	path: ["endDate"],
});

export type SessionFormInput = z.infer<typeof SessionFormSchema>;

export type UseSessionFormProps = {
	onSuccess?: () => void;
	sessionData?: AcademicYearResponse;
	sessionId?: string;
};

export type UseSessionFormReturn = {
	form: UseFormReturn<SessionFormInput>;
	handleSubmit: SubmitHandler<SessionFormInput>;
	isPending: boolean;
};

export const useSessionForm = ({
	onSuccess,
	sessionId,
	sessionData,
}: UseSessionFormProps = {}): UseSessionFormReturn => {
	const queryClient = useQueryClient();

	const { mutate: createSession, isPending: isCreating } = useOrpcMutation(
		orpc.exam.createAcademicYear.mutationOptions({
			onSuccess: () => {
				onSuccess?.();
				queryClient.invalidateQueries({
					queryKey: orpc.exam.listAcademicYears.queryKey(),
				});
			},
		}),
		{
			successMessage: "Academic year created successfully!",
		},
	);

	const { mutate: updateSession, isPending: isUpdating } = useOrpcMutation(
		orpc.exam.updateAcademicYear.mutationOptions({
			onSuccess: () => {
				onSuccess?.();
				queryClient.invalidateQueries({
					queryKey: orpc.exam.listAcademicYears.queryKey(),
				});
			},
		}),
		{
			successMessage: "Academic year updated successfully!",
		},
	);

	const defaultValues: SessionFormInput = sessionData
		? {
				name: sessionData.name,
				startDate: new Date(sessionData.startDate).toISOString().split("T")[0],
				endDate: new Date(sessionData.endDate).toISOString().split("T")[0],
				isActive: sessionData.isActive,
				gradingSystem: sessionData.gradingSystem,
			}
		: {
				name: "",
				startDate: "",
				endDate: "",
				isActive: false,
				gradingSystem: "PERCENTAGE",
			};

	const [form] = useBaseForm({
		schema: SessionFormSchema,
		defaultValues,
	});

	useEffect(() => {
		if (sessionData) {
			form.reset({
				name: sessionData.name,
				startDate: new Date(sessionData.startDate).toISOString().split("T")[0],
				endDate: new Date(sessionData.endDate).toISOString().split("T")[0],
				isActive: sessionData.isActive,
				gradingSystem: sessionData.gradingSystem,
			});
		}
	}, [sessionData, form]);

	const handleSubmit: SubmitHandler<SessionFormInput> = async (values) => {
		if (sessionId) {
			updateSession({ ...values, id: sessionId });
		} else {
			createSession(values);
		}
	};

	return { form, handleSubmit, isPending: isCreating || isUpdating };
};

export default useSessionForm;

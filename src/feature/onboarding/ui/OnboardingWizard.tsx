import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import type { FC } from "react";
import type { SubmitHandler } from "react-hook-form";
import { BaseButton } from "@/components/base/button";
import BaseForm from "@/components/base/forms";
import useBaseForm from "@/components/base/forms/useBaseForm";
import { BaseInput } from "@/components/base/input";
import { BaseSelect } from "@/components/base/select";
import {
	type AcademicStructureInput,
	AcademicStructureSchema,
} from "@/feature/onboarding/contract/onboarding.schema";
import { useOrpcMutation } from "@/hooks/useOrpcMutation";
import { orpc } from "@/server/orpc/client";

const OnboardingWizard: FC<{ onComplete?: () => void }> = ({ onComplete }) => {
	const navigate = useNavigate();

	const queryClient = useQueryClient();
	const handleComplete = async () => {
		await queryClient.invalidateQueries({ queryKey: ["auth-session"] });
		if (onComplete) {
			onComplete();
		} else {
			navigate({ to: "/dashboard" });
		}
	};

	return (
		<div className="">
			<div className="mb-10">
				<h1 className="text-3xl font-bold mb-2">Welcome to your new school</h1>
				<p className="text-muted-foreground">
					Let's set up the academic year to get started.
				</p>
			</div>

			<div className="bg-card border rounded-2xl p-6 shadow-sm">
				<StepAcademic onComplete={handleComplete} />
			</div>
		</div>
	);
};

const StepAcademic: FC<{ onComplete: () => void }> = ({ onComplete }) => {
	const { mutate, isPending } = useOrpcMutation(
		orpc.onboarding.setupAcademicStructure.mutationOptions({
			onSuccess: onComplete,
		}),
	);

	const [form] = useBaseForm({
		schema: AcademicStructureSchema,
		defaultValues: {
			yearName: `${new Date().getFullYear()}-${new Date().getFullYear() + 1}`,
			startDate: new Date().toISOString().split("T")[0],
			endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1))
				.toISOString()
				.split("T")[0],
			gradingSystem: "PERCENTAGE",
		} as any, // Cast required because schema expects Date but form uses string inputs
	});

	const handleSubmit: SubmitHandler<AcademicStructureInput> = (v) => {
		mutate({
			...v,
			startDate: v.startDate.toISOString().split("T")[0],
			endDate: v.endDate.toISOString().split("T")[0],
			terms: v.terms?.map((t) => ({
				...t,
				startDate: t.startDate.toISOString().split("T")[0],
				endDate: t.endDate.toISOString().split("T")[0],
			})),
		});
	};

	return (
		<BaseForm form={form} onSubmit={handleSubmit} className="space-y-6">
			<div className="grid grid-cols-2 gap-4">
				<BaseForm.Item
					control={form.control}
					name="yearName"
					label="Academic Year Name"
				>
					<BaseInput placeholder="e.g. 2024-2025" />
				</BaseForm.Item>
				<BaseForm.Item
					control={form.control}
					name="gradingSystem"
					label="Grading System"
				>
					<BaseSelect
						data={[
							{ label: "Percentage", value: "PERCENTAGE" },
							{ label: "GPA", value: "GPA" },
							{ label: "Letter Grade", value: "LETTER" },
						]}
					/>
				</BaseForm.Item>
			</div>
			<div className="grid grid-cols-2 gap-4">
				<BaseForm.Item
					control={form.control}
					name="startDate"
					label="Start Date"
				>
					<BaseInput type="date" />
				</BaseForm.Item>
				<BaseForm.Item control={form.control} name="endDate" label="End Date">
					<BaseInput type="date" />
				</BaseForm.Item>
			</div>

			<BaseButton type="submit" isLoading={isPending} className="w-full">
				Save & Finish
			</BaseButton>
		</BaseForm>
	);
};

export default OnboardingWizard;

import { useNavigate } from "@tanstack/react-router";
import type { FC } from "react";
import type { SubmitHandler } from "react-hook-form";
import { BaseButton } from "@/components/base/button";
import BaseForm from "@/components/base/forms";
import useBaseForm from "@/components/base/forms/useBaseForm";
import { BaseInput } from "@/components/base/input";
import {
	type CreateSchoolProfileInput,
	CreateSchoolProfileSchema,
} from "@/feature/auth/contract/auth.schema";
import AuthLayout from "@/feature/auth/ui/layout/AuthLayout";
import { useOrpcMutation } from "@/hooks/useOrpcMutation";
import { orpc } from "@/server/orpc/client";

const CreateSchoolView: FC = () => {
	const navigate = useNavigate();
	const { mutate: createSchool, isPending } = useOrpcMutation(
		orpc.auth.createSchoolProfile.mutationOptions({
			onSuccess: ({ data }) => {
				navigate({ to: "/onboarding" });
			},
		}),
		{
			successMessage: "School profile created successfully!",
		},
	);

	const [form] = useBaseForm({
		schema: CreateSchoolProfileSchema,
		defaultValues: {
			schoolName: "",
			logo: "",
			website: "",
			address: "",
		},
	});

	const handleSubmit: SubmitHandler<CreateSchoolProfileInput> = (v) => {
		createSchool(v);
	};

	return (
		<AuthLayout>
			<div className="text-center lg:text-left mb-8">
				<h2 className="text-3xl font-bold tracking-tight text-foreground mb-2">
					Setup Your School
				</h2>
				<p className="text-muted-foreground font-medium">
					Tell us about your institution to get started.
				</p>
			</div>

			<div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-1000">
				<BaseForm form={form} onSubmit={handleSubmit}>
					<div className="space-y-5">
						<BaseForm.Item
							control={form.control}
							name="schoolName"
							label="School Name"
							required
						>
							<BaseInput placeholder="e.g. Springfield High School" />
						</BaseForm.Item>

						<BaseForm.Item
							control={form.control}
							name="website"
							label="Website (Optional)"
						>
							<BaseInput placeholder="https://www.springfield.edu" />
						</BaseForm.Item>

						<BaseForm.Item
							control={form.control}
							name="logo"
							label="Logo URL (Optional)"
						>
							<BaseInput placeholder="https://..." />
						</BaseForm.Item>
					</div>

					<BaseButton
						type="submit"
						className="w-full h-11 mt-8 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-indigo-600/20 active:scale-[0.98]"
						isLoading={isPending}
						loadingText="Creating Profile..."
					>
						Continue to Onboarding
					</BaseButton>
				</BaseForm>
			</div>
		</AuthLayout>
	);
};

export default CreateSchoolView;

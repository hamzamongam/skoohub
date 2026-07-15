import { Link } from "@tanstack/react-router";
import { type FC, useState } from "react";
import type { SubmitHandler } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { BaseButton } from "@/components/base/button";
import BaseForm from "@/components/base/forms";
import useBaseForm from "@/components/base/forms/useBaseForm";
import { BaseInput } from "@/components/base/input";
import { useOrpcMutation } from "@/hooks/useOrpcMutation";
import { orpc } from "@/server/orpc/client";

const ForgotPasswordSchema = z.object({
	email: z.string().email("Invalid email address"),
});

type ForgotPasswordValues = z.infer<typeof ForgotPasswordSchema>;

const ForgotPasswordForm: FC = () => {
	const [isSubmitted, setIsSubmitted] = useState(false);

	const { mutate, isPending } = useOrpcMutation(
		orpc.auth.forgotPassword.mutationOptions({
			onSuccess: () => {
				setIsSubmitted(true);
				toast.success("Password reset email sent!");
			},
			onError: (error) => {
				toast.error(error.message || "Failed to send reset email");
			},
		}),
	);

	const [form] = useBaseForm({
		schema: ForgotPasswordSchema,
		defaultValues: {
			email: "",
		},
	});

	const onSubmit: SubmitHandler<ForgotPasswordValues> = (values) => {
		mutate({ email: values.email });
	};

	if (isSubmitted) {
		return (
			<div className="space-y-6 text-center animate-in fade-in duration-500">
				<div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-2xl text-sm font-medium">
					Please check your email. If an account exists, we have sent
					instructions to reset your password.
				</div>
				<BaseButton
					variant="outline"
					className="w-full h-11 rounded-xl font-semibold border-white/10 hover:bg-white/5 transition-all active:scale-[0.98]"
					render={<Link to="/login" />}
				>
					Back to Sign In
				</BaseButton>
			</div>
		);
	}

	return (
		<div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
			<BaseForm form={form} onSubmit={onSubmit}>
				<BaseForm.Item
					control={form.control}
					name="email"
					label="Email Address"
					required
				>
					<BaseInput type="email" placeholder="name@school.edu" />
				</BaseForm.Item>

				<BaseButton
					variant="default"
					size="lg"
					type="submit"
					className="h-11 mt-4 w-full bg-primary hover:bg-primary/90 font-bold transition-all shadow-lg active:scale-[0.98]"
					isLoading={isPending}
					loadingText="Sending request..."
				>
					Send Reset Instructions
				</BaseButton>

				<p className="text-center text-sm text-muted-foreground mt-6">
					Remembered your password?{" "}
					<Link
						to="/login"
						className="font-semibold text-primary hover:text-primary/80 underline underline-offset-4"
					>
						Sign In
					</Link>
				</p>
			</BaseForm>
		</div>
	);
};

export default ForgotPasswordForm;

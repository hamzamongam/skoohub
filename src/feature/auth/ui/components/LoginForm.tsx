import { useRouter } from "@tanstack/react-router";
import { type FC, useId } from "react";
import type { SubmitHandler } from "react-hook-form";
import { BaseButton } from "@/components/base/button";
import { BaseCheckbox } from "@/components/base/checkbox";
import BaseForm from "@/components/base/forms";
import useBaseForm from "@/components/base/forms/useBaseForm";
import InputPassword from "@/components/base/InputPassword";
import { BaseInput } from "@/components/base/input";
import { useOrpcMutation } from "@/hooks/useOrpcMutation";
import { orpc } from "@/server/orpc/client";
import { loginSchema, type TLoginSchema } from "../../contract/auth.schema";
import SocialLoginButtons from "./SocialLoginButtons";

const LoginForm: FC<{ redirectUrl?: string }> = ({ redirectUrl }) => {
	const router = useRouter();
	const { mutate: loginMutation, isPending } = useOrpcMutation(
		orpc.auth.login.mutationOptions({
			onSuccess: () => {
				if (redirectUrl) {
					router.navigate({ to: redirectUrl });
				} else {
					router.navigate({ to: "/" });
				}
			},
		}),
		{
			successMessage: "Successfully signed in!",
		},
	);
	const rememberId = useId();
	const [form] = useBaseForm({
		schema: loginSchema,
		defaultValues: {
			email: "",
			password: "",
		},
	});

	const handleSubmit: SubmitHandler<TLoginSchema> = (v) => {
		loginMutation(v);
	};

	return (
		<div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
			<BaseForm form={form} onSubmit={handleSubmit}>
				<BaseForm.Item
					control={form.control}
					name="email"
					label="Email Address"
					required
				>
					<BaseInput type="email" placeholder="name@school.edu" />
				</BaseForm.Item>

				<BaseForm.Item
					control={form.control}
					name="password"
					label="Password"
					required
				>
					<InputPassword placeholder="••••••••" />
				</BaseForm.Item>

				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2 group">
						<BaseCheckbox id={rememberId} />
						<label
							htmlFor={rememberId}
							className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors cursor-pointer"
						>
							Remember me
						</label>
					</div>
					<a
						href="#forgot-password"
						className="text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
					>
						Forgot password?
					</a>
				</div>

				<BaseButton
					variant="default"
					size="lg"
					type="submit"
					className="h-10"
					isLoading={isPending}
					loadingText="Signing in..."
				>
					Sign In
				</BaseButton>

				<SocialLoginButtons />

				<p className="text-center text-sm text-muted-foreground mt-6">
					Don't have an account?{" "}
					<a
						href="#register"
						className="font-semibold text-primary hover:text-primary/80 underline underline-offset-4"
					>
						Join your school
					</a>
				</p>
			</BaseForm>
		</div>
	);
};

export default LoginForm;

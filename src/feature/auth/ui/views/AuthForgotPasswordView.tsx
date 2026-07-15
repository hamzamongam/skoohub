import type { FC } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";
import ForgotPasswordForm from "../components/ForgotPasswordForm";
import AuthLayout from "../layout/AuthLayout";

const AuthForgotPasswordView: FC = () => {
	return (
		<AuthLayout>
			<div className="absolute top-4 right-4 z-50">
				<ThemeToggle />
			</div>
			<div className="text-center lg:text-left mb-6">
				<h2 className="text-3xl font-bold tracking-tight text-foreground mb-1">
					Reset Your Password
				</h2>
				<p className="text-muted-foreground font-medium">
					Enter your registered email address and we'll send you a link to reset
					your password.
				</p>
			</div>
			<ForgotPasswordForm />
		</AuthLayout>
	);
};

export default AuthForgotPasswordView;
export { AuthForgotPasswordView };

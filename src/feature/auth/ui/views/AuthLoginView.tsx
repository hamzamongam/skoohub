import type { FC } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";
import LoginForm from "../components/LoginForm";
import AuthLayout from "../layout/AuthLayout";

const AuthLoginView: FC<{ redirectUrl?: string }> = ({ redirectUrl }) => {
	return (
		<AuthLayout>
			<div className="absolute top-4 right-4 z-50">
				<ThemeToggle />
			</div>
			<div className="text-center lg:text-left mb-6">
				<h2 className="text-3xl font-bold tracking-tight text-foreground mb-1">
					Welcome Back
				</h2>
				<p className="text-muted-foreground font-medium">
					Please enter your details to sign in to your account.
				</p>
			</div>
			<LoginForm redirectUrl={redirectUrl} />
		</AuthLayout>
	);
};

export default AuthLoginView;

import type { FC } from "react";
import ResetPasswordForm from "./components/ResetPasswordForm";

const InviteAcceptView: FC<{
	token: string;
}> = ({ token }) => {
	return (
		<div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
			<div className="flex w-full max-w-sm flex-col gap-6">
				<a href="/" className="flex items-center gap-2 self-center font-medium">
					<div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
						{/* Logo or icon */}S
					</div>
					SkooHub
				</a>
				<div className="flex flex-col gap-6">
					<div className="flex flex-col gap-2 text-center">
						<h1 className="text-2xl font-bold">Set your password</h1>
						<p className="text-balance text-sm text-muted-foreground">
							Enter your new password below to activate your account.
						</p>
					</div>
					<ResetPasswordForm token={token} />
				</div>
			</div>
		</div>
	);
};

export default InviteAcceptView;

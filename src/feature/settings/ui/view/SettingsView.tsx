import React from "react";
import { PageLayout } from "@/components/layout/page-layout";
import ChangePasswordForm from "@/feature/auth/ui/components/ChangePasswordForm";

const SettingsView = () => {
	return (
		<PageLayout
			title="Settings"
			subtitle="Manage your account settings and preferences"
		>
			<div className="grid gap-6">
				<div className="rounded-xl border bg-card text-card-foreground shadow-sm">
					<div className="flex flex-col space-y-1.5 p-6">
						<h3 className="font-semibold leading-none tracking-tight">
							Security
						</h3>
						<p className="text-sm text-muted-foreground">
							Update your password and manage your account security.
						</p>
					</div>
					<div className="p-6 pt-0">
						<ChangePasswordForm />
					</div>
				</div>
			</div>
		</PageLayout>
	);
};

export default SettingsView;

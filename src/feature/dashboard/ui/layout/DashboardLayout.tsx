"use client";

import type { FC, ReactNode } from "react";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "../../../../components/layout/dashboard-layout/AppSidebar";
import Navbar from "../../../../components/layout/dashboard-layout/Navbar";

interface DashboardLayoutProps {
	children: ReactNode;
}

const DashboardLayout: FC<DashboardLayoutProps> = ({ children }) => {
	return (
		<SidebarProvider>
			<div className="relative flex min-h-screen w-full overflow-hidden bg-background">
				{/* Creative Background Elements */}
				<div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
					<div className="absolute top-[10%] left-[10%] w-140 h-140 bg-primary/(--blob-opacity) rounded-full blur-[80px] animate-blob filter" />
					<div className="absolute bottom-[10%] right-[10%] w-140 h-140 bg-accent/(--blob-opacity) rounded-full blur-[80px] animate-blob animation-delay-2000 filter" />
					<div className="absolute top-[40%] left-[40%] w-100 h-100 bg-purple-500/(--blob-opacity) rounded-full blur-[80px] animate-blob animation-delay-4000 filter" />
				</div>

				<AppSidebar className="z-20 relative" />

				<SidebarInset className="relative z-10 flex flex-col min-h-screen bg-transparent">
					<header className="flex h-16 shrink-0 items-center justify-between gap-4 border-b px-6 sticky top-0 glass z-30 transition-all duration-300">
						<div className="flex items-center gap-3">
							<div className="flex items-center justify-center p-1.5 rounded-xl bg-primary/10 hover:bg-primary/20 transition-colors cursor-pointer sidebar-trigger-container">
								<SidebarTrigger className="h-5 w-5 static!" />
							</div>
							<Separator
								orientation="vertical"
								className="h-4 bg-border/50 hidden sm:block"
							/>
							<Breadcrumb className="hidden md:block">
								<BreadcrumbList>
									<BreadcrumbItem>
										<BreadcrumbLink
											href="/dashboard"
											className="font-medium text-muted-foreground hover:text-primary transition-colors"
										>
											Dashboard
										</BreadcrumbLink>
									</BreadcrumbItem>
									<BreadcrumbSeparator />
									<BreadcrumbItem>
										<BreadcrumbPage className="font-bold text-foreground tracking-tight">
											Overview
										</BreadcrumbPage>
									</BreadcrumbItem>
								</BreadcrumbList>
							</Breadcrumb>
						</div>

						<div className="flex-1 max-w-2xl px-4">
							<Navbar />
						</div>
					</header>

					<main className="flex-1 p-6 md:p-10">
						<div className="w-full mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-1000 ease-out">
							{children}
						</div>
					</main>

					<footer className="p-6 text-center text-xs text-muted-foreground/60 border-t border-border/50 bg-background/20">
						<div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
							<p className="text-label-caps text-muted-foreground/40 leading-relaxed">
								© 2026 EduSynergy School Management System. All rights reserved.
							</p>
							<div className="flex items-center gap-6">
								<a
									href="https://github.com/"
									className="hover:text-primary transition-colors"
									type="button"
								>
									Documentation
								</a>
								<a
									href="/"
									className="hover:text-primary transition-colors"
									type="button"
								>
									Support
								</a>
								<a
									href="#/"
									className="hover:text-primary transition-colors"
									type="button"
								>
									Privacy Policy
								</a>
							</div>
						</div>
					</footer>
				</SidebarInset>
			</div>
		</SidebarProvider>
	);
};

export default DashboardLayout;

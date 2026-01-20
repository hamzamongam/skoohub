"use client";

import {
	Calendar,
	ChevronRight,
	DollarSign,
	GraduationCap,
	Sparkles,
	UserSquare2,
	Users,
} from "lucide-react";
import { type FC, useState } from "react";
import { PageLayout } from "@/components/layout/page-layout";
import { cn } from "@/lib/utils";
import { SetupProgress } from "../components/onboarding/SetupProgress";
import { WelcomeModal } from "../components/onboarding/WelcomeModal";
import StatsCard from "../components/StatsCard";

const AdminDashboardView: FC = () => {
	const [showOnboarding, setShowOnboarding] = useState(true);

	return (
		<PageLayout
			title={
				<>
					{showOnboarding ? "Welcome to your" : "Good morning,"} <br />
					<span className="text-gradient">Alex Johnson.</span>
				</>
			}
			subtitle={
				<>
					<Calendar className="size-4" />
					Thursday, January 1st, 2026
				</>
			}
			stats={
				<>
					<p className="text-label-caps">
						{showOnboarding ? "Initial Progress" : "Overall Score"}
					</p>
					<p className="text-heading-lg">
						{showOnboarding ? "25" : "98.4"}
						<span className="text-sm text-primary">%</span>
					</p>
				</>
			}
			actions={
				<button
					type="button"
					className="h-12 px-6 text-sm font-black text-background transition-all shadow-xl rounded-2xl bg-foreground shadow-foreground/10 hover:scale-[1.02] active:scale-[0.98]"
				>
					Generate Report
				</button>
			}
			animate={false} // Parent already animates
		>
			<WelcomeModal onStart={() => setShowOnboarding(true)} />

			{showOnboarding && (
				<div className="pt-4 pb-8">
					<SetupProgress />
				</div>
			)}

			<div className="grid grid-cols-1 gap-6 pt-4 md:grid-cols-2 lg:grid-cols-4">
				<StatsCard
					title="Total Students"
					value="1,280"
					icon={GraduationCap}
					trend={{ value: 12, isPositive: true }}
					description="124 new registrations this month"
				/>
				<StatsCard
					title="Active Teachers"
					value="84"
					icon={UserSquare2}
					trend={{ value: 4, isPositive: true }}
					description="Faculty attendance at 98%"
				/>
				<StatsCard
					title="Attendance Rate"
					value="94.2%"
					icon={Users}
					trend={{ value: 2.1, isPositive: false }}
					description="Slightly lower than last week"
				/>
				<StatsCard
					title="Library Usage"
					value="452"
					icon={DollarSign} // Placeholder, but redesigned
					trend={{ value: 15, isPositive: true }}
					description="Digital resources accessed"
					iconClassName="bg-amber-500/10 text-amber-600 shadow-amber-500/5 group-hover:bg-amber-500"
				/>
			</div>

			<div className="grid grid-cols-1 gap-8 pt-4 lg:grid-cols-3">
				<div className="space-y-6 lg:col-span-2">
					<div className="glass-card group flex h-[450px] flex-col justify-between rounded-[2.5rem] p-8">
						<div className="mb-8 flex items-center justify-between">
							<div className="space-y-1">
								<h3 className="text-heading-lg text-foreground">
									School Performance
								</h3>
								<p className="text-xs font-bold text-muted-foreground/60">
									Average students engagement per day
								</p>
							</div>
							<div className="flex rounded-xl bg-muted/30 p-1">
								<button
									type="button"
									className="rounded-lg bg-background px-3 py-1.5 text-xs font-bold shadow-sm"
								>
									Week
								</button>
								<button
									type="button"
									className="rounded-lg px-3 py-1.5 text-xs font-bold text-muted-foreground transition-colors hover:text-foreground"
								>
									Month
								</button>
							</div>
						</div>
						<div className="group-hover:gap-5 flex flex-1 items-end gap-4 px-2 pb-6 transition-all duration-700">
							{[45, 60, 40, 80, 55, 70, 90, 65, 85, 50].map((h, i) => (
								<div
									key={`perf-bar-${i}-${h}`}
									className="group/bar relative flex flex-1 flex-col items-center"
								>
									<div className="group-hover/bar:opacity-100 group-hover/bar:scale-100 absolute top-[-30px] transform scale-75 opacity-0 transition-all duration-300">
										<span className="rounded-lg bg-foreground px-2 py-1 text-[10px] font-black text-background">
											{h}%
										</span>
									</div>
									<div
										className="group-hover/bar:shadow-[0_0_20px_rgba(var(--primary),0.3)] w-full rounded-2xl bg-linear-to-t from-primary/10 via-primary/40 to-primary transition-all duration-500"
										style={{ height: `${h}%` }}
									/>
									<span className="group-hover/bar:text-primary mt-4 text-[9px] font-black uppercase tracking-tighter text-muted-foreground/30 transition-colors">
										D{i + 1}
									</span>
								</div>
							))}
						</div>
					</div>
				</div>

				<div className="space-y-6">
					<div className="glass-card rounded-[2.5rem] p-8 h-full flex flex-col">
						<div className="flex items-center justify-between mb-8">
							<h3 className="text-xl font-(--font-black) tracking-(--tracking-tighter) text-foreground">
								Recent Activity
							</h3>
							<button
								type="button"
								className="text-label-caps text-primary hover:underline"
							>
								View All
							</button>
						</div>
						<div className="flex-1 overflow-y-auto no-scrollbar space-y-6">
							{[
								{
									title: "Academic Milestone",
									desc: "Grade 10 finalized their project",
									time: "12m ago",
									color: "bg-blue-500",
								},
								{
									title: "Fee Verification",
									desc: "Transaction #1029 verified",
									time: "1h ago",
									color: "bg-emerald-500",
								},
								{
									title: "Staff Meeting",
									desc: "New curriculum discussion",
									time: "4h ago",
									color: "bg-amber-500",
								},
								{
									title: "Equipment Arrived",
									desc: "Science lab kit received",
									time: "Yesterday",
									color: "bg-purple-500",
								},
							].map((item, idx) => (
								<div
									key={item.title}
									className="flex gap-4 group/item cursor-pointer"
								>
									<div className="relative">
										<div
											className={cn(
												"size-3 rounded-full mt-1.5 ring-4 ring-background z-10 relative",
												item.color,
											)}
										/>
										{idx !== 3 && (
											<div className="absolute top-3 left-1/2 -translate-x-1/2 h-full w-[2px] bg-border/50 z-0" />
										)}
									</div>
									<div className="space-y-1 pb-4">
										<p className="text-xs font-(--font-black) tracking-(--tracking-tight) group-hover/item:text-primary transition-colors">
											{item.title}
										</p>
										<p className="text-[11px] font-medium text-muted-foreground/70 leading-relaxed">
											{item.desc}
										</p>
										<p className="text-label-caps text-muted-foreground/30!">
											{item.time}
										</p>
									</div>
								</div>
							))}
						</div>
						<div className="mt-8 pt-6 border-t border-border/50">
							<div className="flex items-center justify-between p-4 rounded-2xl bg-primary/5 border border-primary/10">
								<div className="flex items-center gap-3">
									<div className="size-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary">
										<Sparkles className="size-4" />
									</div>
									<div className="text-[10px]">
										<p className="font-black">Smart Insights</p>
										<p className="font-medium text-muted-foreground/70">
											Check AI predictions
										</p>
									</div>
								</div>
								<ChevronRight className="size-4 text-primary opacity-40" />
							</div>
						</div>
					</div>
				</div>
			</div>
		</PageLayout>
	);
};

export default AdminDashboardView;

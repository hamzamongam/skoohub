"use client";

import {
	BookOpen,
	CheckCircle2,
	ChevronRight,
	Circle,
	GraduationCap,
	School,
	Users,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface SetupStep {
	id: string;
	title: string;
	description: string;
	icon: React.ElementType;
	completed: boolean;
	url: string;
}

export function SetupProgress() {
	const [steps] = useState<SetupStep[]>([
		{
			id: "school-profile",
			title: "School Profile",
			description: "Basic info, logo, and contact details",
			icon: School,
			completed: true,
			url: "/dashboard/settings",
		},
		{
			id: "academic-config",
			title: "Academic Setup",
			description: "Sessions, branches, and class structure",
			icon: BookOpen,
			completed: false,
			url: "/dashboard/academics",
		},
		{
			id: "staff-invite",
			title: "Team Assembly",
			description: "Add teachers and department heads",
			icon: Users,
			completed: false,
			url: "/dashboard/staff",
		},
		{
			id: "student-import",
			title: "Student Directory",
			description: "Bulk import or add students one by one",
			icon: GraduationCap,
			completed: false,
			url: "/dashboard/students",
		},
	]);

	const completedCount = steps.filter((s) => s.completed).length;
	const progressPercentage = (completedCount / steps.length) * 100;

	return (
		<div className="glass-card overflow-hidden rounded-[2.5rem] border border-primary/20 bg-linear-to-br from-primary/5 via-background to-background p-8 shadow-xl shadow-primary/5">
			<div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
				<div className="space-y-2">
					<div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/10 text-[10px] font-black uppercase tracking-widest text-primary">
						<span className="relative flex h-2 w-2">
							<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
							<span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
						</span>
						Setup Progress
					</div>
					<h3 className="text-3xl font-black tracking-tighter">
						Finish setting up your school
					</h3>
					<p className="text-muted-foreground text-sm font-medium">
						Complete these tasks to unlock all features and start managing your
						school effectively.
					</p>
				</div>

				<div className="relative flex items-center justify-center size-24 md:size-32">
					<svg
						className="size-full -rotate-90 transform"
						aria-label="Setup progress chart"
					>
						<title>Setup progress chart</title>
						<circle
							cx="50%"
							cy="50%"
							r="45%"
							className="fill-none stroke-current text-muted/30"
							strokeWidth="8"
						/>
						<circle
							cx="50%"
							cy="50%"
							r="45%"
							className="fill-none stroke-current text-primary transition-all duration-1000 ease-out"
							strokeWidth="8"
							strokeDasharray="283"
							strokeDashoffset={283 - (283 * progressPercentage) / 100}
							strokeLinecap="round"
						/>
					</svg>
					<div className="absolute inset-0 flex flex-col items-center justify-center">
						<span className="text-2xl md:text-3xl font-black tracking-tighter">
							{Math.round(progressPercentage)}%
						</span>
						<span className="text-[10px] uppercase font-black text-muted-foreground">
							Complete
						</span>
					</div>
				</div>
			</div>

			<div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
				{steps.map((step) => (
					<div
						key={step.id}
						className={cn(
							"group relative flex flex-col gap-4 p-6 rounded-3xl border transition-all duration-300",
							step.completed
								? "bg-emerald-500/5 border-emerald-500/20 shadow-sm"
								: "bg-background border-border hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 cursor-pointer",
						)}
					>
						<div className="flex items-center justify-between">
							<div
								className={cn(
									"p-3 rounded-2xl shadow-inner",
									step.completed
										? "bg-emerald-500/20 text-emerald-600"
										: "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary",
								)}
							>
								<step.icon className="size-6" />
							</div>
							{step.completed ? (
								<CheckCircle2 className="size-6 text-emerald-600" />
							) : (
								<Circle className="size-6 text-muted-foreground" />
							)}
						</div>

						<div className="space-y-1">
							<h4
								className={cn(
									"font-black tracking-tight",
									step.completed ? "text-emerald-700" : "text-foreground",
								)}
							>
								{step.title}
							</h4>
							<p className="text-xs text-muted-foreground font-medium leading-relaxed">
								{step.description}
							</p>
						</div>

						<div className="mt-2 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest opacity-0 transform translate-x-[-10px] transition-all group-hover:opacity-100 group-hover:translate-x-0">
							<span
								className={step.completed ? "text-emerald-600" : "text-primary"}
							>
								{step.completed ? "View Details" : "Start Now"}
							</span>
							<ChevronRight
								className={cn(
									"size-3",
									step.completed ? "text-emerald-600" : "text-primary",
								)}
							/>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}

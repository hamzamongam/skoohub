"use client";

import type { FC } from "react";
import { cn } from "@/lib/utils";

interface ActivityItem {
	id: string;
	title: string;
	description: string;
	time: string;
	icon: string;
	type: "info" | "success" | "warning" | "error";
}

interface RecentActivityProps {
	activities: ActivityItem[];
	className?: string;
}

const RecentActivity: FC<RecentActivityProps> = ({ activities, className }) => {
	return (
		<div
			className={cn(
				"bg-background border rounded-2xl p-6 shadow-sm",
				className,
			)}
		>
			<div className="flex items-center justify-between mb-6">
				<h3 className="text-lg font-bold tracking-tight">Recent Activity</h3>
				<button
					type="button"
					className="text-sm font-semibold text-primary hover:underline"
				>
					View all
				</button>
			</div>
			<div className="space-y-6">
				{activities.map((activity, index) => (
					<div key={activity.id} className="flex gap-4 group">
						<div className="relative flex flex-col items-center">
							<div
								className={cn(
									"h-10 w-10 rounded-xl flex items-center justify-center text-lg z-10 border-2 border-background",
									activity.type === "info" && "bg-blue-100 text-blue-600",
									activity.type === "success" && "bg-green-100 text-green-600",
									activity.type === "warning" && "bg-amber-100 text-amber-600",
									activity.type === "error" && "bg-red-100 text-red-600",
								)}
							>
								{activity.icon}
							</div>
							{index < activities.length - 1 && (
								<div className="w-px h-full bg-border absolute top-10" />
							)}
						</div>
						<div className="flex-1 pb-2">
							<div className="flex items-center justify-between">
								<p className="text-sm font-bold text-foreground group-hover:text-primary transition-colors cursor-pointer">
									{activity.title}
								</p>
								<span className="text-xs text-muted-foreground font-medium">
									{activity.time}
								</span>
							</div>
							<p className="text-sm text-muted-foreground mt-1 leading-relaxed">
								{activity.description}
							</p>
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default RecentActivity;

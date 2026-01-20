"use client";

import type { LucideIcon } from "lucide-react";
import type { FC } from "react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
	title: string;
	value: string | number;
	icon: LucideIcon;
	description?: string;
	trend?: {
		value: number;
		isPositive: boolean;
	};
	className?: string;
	iconClassName?: string;
}

const StatsCard: FC<StatsCardProps> = ({
	title,
	value,
	icon: Icon,
	description,
	trend,
	className,
	iconClassName,
}) => {
	return (
		<div
			className={cn(
				"glass-card p-6 rounded-[2rem] flex flex-col justify-between h-full group relative overflow-hidden",
				className,
			)}
		>
			<div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-500 transform group-hover:scale-110">
				<Icon className="size-24" />
			</div>

			<div className="flex items-center justify-between mb-8 relative z-10">
				<div
					className={cn(
						"p-3.5 rounded-2xl bg-primary/10 text-primary shadow-sm shadow-primary/5 transition-all duration-500 group-hover:bg-primary group-hover:text-primary-foreground group-hover:shadow-lg group-hover:shadow-primary/30",
						iconClassName,
					)}
				>
					<Icon className="h-6 w-6" />
				</div>
				{trend && (
					<div
						className={cn(
							"text-xs font-black px-3 py-1.5 rounded-full shadow-sm",
							trend.isPositive
								? "bg-emerald-500/10 text-emerald-600 shadow-emerald-500/5"
								: "bg-rose-500/10 text-rose-600 shadow-rose-500/5",
						)}
					>
						{trend.isPositive ? "↑" : "↓"} {trend.value}%
					</div>
				)}
			</div>
			<div className="relative z-10">
				<p className="text-label-caps mb-1">{title}</p>
				<h3 className="text-heading-lg text-4xl! text-foreground group-hover:text-primary transition-colors duration-300">
					{value}
				</h3>
				{description && (
					<p className="text-[10px] text-muted-foreground mt-4 font-bold flex items-center gap-2">
						<span className="w-1.5 h-1.5 rounded-full bg-primary/40 animate-pulse" />
						{description}
					</p>
				)}
			</div>
		</div>
	);
};

export default StatsCard;

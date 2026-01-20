import type { FC, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
	title: ReactNode;
	subtitle?: ReactNode;
	actions?: ReactNode;
	stats?: ReactNode;
	className?: string;
	titleClassName?: string;
	gradientTitle?: boolean;
}

export const PageHeader: FC<PageHeaderProps> = ({
	title,
	subtitle,
	actions,
	stats,
	className,
	titleClassName,
	gradientTitle = true,
}) => {
	return (
		<div
			className={cn(
				"flex flex-col justify-between gap-6 pb-2 md:flex-row md:items-end w-full",
				className,
			)}
		>
			<div className="space-y-1">
				<h1 className={cn("text-hero", titleClassName)}>
					{gradientTitle && typeof title === "string" ? (
						<span className="text-gradient">{title}</span>
					) : (
						title
					)}
				</h1>
				{subtitle && (
					<div className="text-sm font-bold text-muted-foreground/60 flex items-center gap-2">
						{subtitle}
					</div>
				)}
			</div>

			{(actions || stats) && (
				<div className="flex items-center gap-3">
					{stats && (
						<>
							<div className="hidden text-right sm:block">{stats}</div>
							<div className="mx-2 hidden h-10 w-[2px] bg-border/50 sm:block" />
						</>
					)}
					{actions && <div className="flex items-center gap-3">{actions}</div>}
				</div>
			)}
		</div>
	);
};

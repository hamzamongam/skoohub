"use client";

import { Loader2 } from "lucide-react";
import * as React from "react";
import type { ButtonProps } from "@/components/ui/button";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type BaseButtonProps = ButtonProps & {
	isLoading?: boolean;
	loadingText?: string;
	leftIcon?: React.ReactNode;
	rightIcon?: React.ReactNode;
};

export const BaseButton = React.forwardRef<HTMLButtonElement, BaseButtonProps>(
	(
		{
			children,
			isLoading,
			loadingText,
			leftIcon,
			rightIcon,
			disabled,
			className,
			...props
		},
		ref,
	) => {
		return (
			<Button
				ref={ref}
				disabled={isLoading || disabled}
				className={cn("relative gap-2 h-12 flex cursor-pointer", className)}
				{...props}
			>
				{isLoading && (
					<Loader2
						className="size-4 animate-spin shrink-0"
						aria-hidden="true"
					/>
				)}
				{!isLoading && leftIcon && (
					<span className="shrink-0 transition-transform group-hover/button:scale-110">
						{leftIcon}
					</span>
				)}
				<span className="truncate">
					{isLoading && loadingText ? loadingText : children}
				</span>
				{!isLoading && rightIcon && (
					<span className="shrink-0 transition-transform group-hover/button:scale-110">
						{rightIcon}
					</span>
				)}
			</Button>
		);
	},
);
BaseButton.displayName = "BaseButton";

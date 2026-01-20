"use client";

import {
	BookOpen,
	LayoutGrid,
	Plus,
	UserPlus,
	UserSquare2,
} from "lucide-react";
import type { FC } from "react";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const QuickActionMenu: FC = () => {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger
				render={
					<Button
						variant="default"
						className="gap-2 rounded-xl h-10 shadow-lg shadow-primary/20"
					>
						<Plus className="h-4 w-4" />
						<span className="hidden sm:inline">Create New</span>
					</Button>
				}
			/>
			<DropdownMenuContent
				align="end"
				className="w-56 p-2 rounded-2xl shadow-xl border-primary/10"
			>
				<DropdownMenuGroup>
					<DropdownMenuLabel className="px-3 py-2 text-xs font-bold text-muted-foreground uppercase tracking-widest">
						Quick Actions
					</DropdownMenuLabel>
				</DropdownMenuGroup>
				<DropdownMenuSeparator />
				<DropdownMenuItem className="gap-3 p-3 rounded-xl cursor-pointer focus:bg-primary/10 focus:text-primary transition-colors">
					<div className="h-8 w-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-600">
						<UserPlus className="h-4 w-4" />
					</div>
					<div className="flex flex-col">
						<span className="text-sm font-bold">Add Student</span>
						<span className="text-[10px] text-muted-foreground">
							Register a new student
						</span>
					</div>
				</DropdownMenuItem>
				<DropdownMenuItem className="gap-3 p-3 rounded-xl cursor-pointer focus:bg-primary/10 focus:text-primary transition-colors">
					<div className="h-8 w-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-600">
						<UserSquare2 className="h-4 w-4" />
					</div>
					<div className="flex flex-col">
						<span className="text-sm font-bold">Add Teacher</span>
						<span className="text-[10px] text-muted-foreground">
							Hire new faculty member
						</span>
					</div>
				</DropdownMenuItem>
				<DropdownMenuItem className="gap-3 p-3 rounded-xl cursor-pointer focus:bg-primary/10 focus:text-primary transition-colors">
					<div className="h-8 w-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-600">
						<BookOpen className="h-4 w-4" />
					</div>
					<div className="flex flex-col">
						<span className="text-sm font-bold">New Class</span>
						<span className="text-[10px] text-muted-foreground">
							Schedule a new section
						</span>
					</div>
				</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DropdownMenuItem className="gap-3 p-3 rounded-xl cursor-pointer focus:bg-primary/10 transition-colors">
					<LayoutGrid className="h-4 w-4 text-muted-foreground" />
					<span className="text-sm font-medium">Bulk Import</span>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

export default QuickActionMenu;

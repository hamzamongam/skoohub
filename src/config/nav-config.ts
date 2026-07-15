import {
	// BarChart3,
	BookOpen,
	CreditCard,
	GraduationCap,
	LayoutDashboard,
	type LucideIcon,
	// LifeBuoy,
	// MessageSquare,
	// Package,
	// Settings,
	Trophy,
	UserSquare2,
} from "lucide-react";
import type { FileRouteTypes } from "../routeTree.gen";

type AppUrl = FileRouteTypes["to"] | (string & {});

interface SubMenuItem {
	title: string;
	url: AppUrl;
}

interface MainMenuItem {
	title: string;
	url: AppUrl;
	icon: LucideIcon;
	isActive?: boolean;
	items?: SubMenuItem[];
}

interface SidebarMenus {
	mainMenus: MainMenuItem[];
}

export const sidebarMenus: SidebarMenus = {
	mainMenus: [
		{
			title: "Dashboard",
			url: "/dashboard",
			icon: LayoutDashboard,
			isActive: true,
		},
		{
			title: "Academics",
			url: "/dashboard/academics",
			icon: BookOpen,
			items: [
				// {
				// 	title: "Branches",
				// 	url: "/dashboard/academics/branches",
				// },
				{
					title: "Sessions",
					url: "/dashboard/academics/sessions",
				},
				{
					title: "Classes",
					url: "/dashboard/classes",
				},
				{
					title: "Subjects",
					url: "/dashboard/academics/subjects",
				},
			],
		},
		{
			title: "Students",
			url: "/dashboard/students",
			icon: GraduationCap,
			items: [
				{
					title: "All Students",
					url: "/dashboard/students",
				},
				{
					title: "Admission",
					url: "/dashboard/students/add",
				},
				{
					title: "Attendance",
					url: "/dashboard/students/attendance",
				},
				// {
				// 	title: "Promotion",
				// 	url: "/dashboard/students/promotion",
				// },
				// {
				// 	title: "Certificates",
				// 	url: "/dashboard/students/certificates",
				// },
			],
		},
		{
			title: "Staff",
			url: "/dashboard/staff",
			icon: UserSquare2,
			items: [
				{
					title: "Directory",
					url: "/dashboard/staff",
				},
				// {
				// 	title: "Attendance",
				// 	url: "/dashboard/staff/attendance",
				// },
				// {
				// 	title: "Leave Management",
				// 	url: "/dashboard/staff/leave",
				// },
			],
		},
		{
			title: "Examination",
			url: "/dashboard/exams",
			icon: Trophy,
			items: [
				{
					title: "Exam Cycles",
					url: "/dashboard/exams",
				},
				{
					title: "Record Scores",
					url: "/dashboard/exams/scores",
				},
			],
		},
		{
			title: "Billing & Fees",
			url: "/dashboard/billing",
			icon: CreditCard,
			items: [
				{
					title: "Fee Categories",
					url: "/dashboard/billing/fees",
				},
				{
					title: "Invoices",
					url: "/dashboard/billing/invoices",
				},
			],
		},
	],
};

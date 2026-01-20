import {
	BarChart3,
	BookOpen,
	CreditCard,
	GraduationCap,
	LayoutDashboard,
	LifeBuoy,
	MessageSquare,
	Package,
	Settings,
	Trophy,
	UserSquare2,
} from "lucide-react";

export const data = {
	user: {
		name: "Alex Johnson",
		email: "alex.j@edusynergy.edu",
		avatar: "AJ",
	},
	navMain: [
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
				{
					title: "Branches",
					url: "/dashboard/academics/branches",
				},
				{
					title: "Sessions",
					url: "/dashboard/academics/sessions",
				},
				{
					title: "Classes",
					url: "/dashboard/academics/classes",
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
					url: "/dashboard/students/admission",
				},
				{
					title: "Promotion",
					url: "/dashboard/students/promotion",
				},
				{
					title: "Certificates",
					url: "/dashboard/students/certificates",
				},
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
				{
					title: "Attendance",
					url: "/dashboard/staff/attendance",
				},
				{
					title: "Leave Management",
					url: "/dashboard/staff/leave",
				},
			],
		},
		{
			title: "Finance",
			url: "/dashboard/finance",
			icon: CreditCard,
			items: [
				{
					title: "Fee Setup",
					url: "/dashboard/finance/fees",
				},
				{
					title: "Collection",
					url: "/dashboard/finance/collection",
				},
				{
					title: "Expenses",
					url: "/dashboard/finance/expenses",
				},
				{
					title: "Payroll",
					url: "/dashboard/finance/payroll",
				},
			],
		},
		{
			title: "Examination",
			url: "/dashboard/exams",
			icon: Trophy,
			items: [
				{
					title: "Exam Setup",
					url: "/dashboard/exams/setup",
				},
				{
					title: "Results",
					url: "/dashboard/exams/results",
				},
				{
					title: "Admit Cards",
					url: "/dashboard/exams/admit-cards",
				},
			],
		},
		{
			title: "Communication",
			url: "/dashboard/communication",
			icon: MessageSquare,
			items: [
				{
					title: "Notice Board",
					url: "/dashboard/communication/notices",
				},
				{
					title: "SMS/Email",
					url: "/dashboard/communication/messaging",
				},
			],
		},
		{
			title: "Resources",
			url: "/dashboard/resources",
			icon: Package,
			items: [
				{
					title: "Library",
					url: "/dashboard/resources/library",
				},
				{
					title: "Transport",
					url: "/dashboard/resources/transport",
				},
				{
					title: "Hostel",
					url: "/dashboard/resources/hostel",
				},
				{
					title: "Inventory",
					url: "/dashboard/resources/inventory",
				},
			],
		},
	],
	secondary: [
		{
			title: "Settings",
			url: "/dashboard/settings",
			icon: Settings,
		},
		{
			title: "Analytics",
			url: "/dashboard/analytics",
			icon: BarChart3,
		},
		{
			title: "Support",
			url: "/dashboard/support",
			icon: LifeBuoy,
		},
	],
};

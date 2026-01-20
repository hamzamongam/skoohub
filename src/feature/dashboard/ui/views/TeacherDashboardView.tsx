"use client";

import { AlertCircle, BookOpen, CheckCircle, Clock } from "lucide-react";
import type { FC } from "react";
import { cn } from "@/lib/utils";
import RecentActivity from "../components/RecentActivity";
import StatsCard from "../components/StatsCard";
import DashboardLayout from "../layout/DashboardLayout";

const TeacherDashboardView: FC = () => {
	return (
		<DashboardLayout>
			<div className="space-y-2">
				<h1 className="text-3xl font-extrabold tracking-tight text-foreground">
					Hello, <span className="text-primary italic font-serif">Teacher</span>
					.
				</h1>
				<p className="text-muted-foreground font-medium">
					You have 3 classes today. You're almost ready!
				</p>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
				<StatsCard
					title="Active Classes"
					value="4"
					icon={BookOpen}
					description="Total this semester"
				/>
				<StatsCard
					title="Grading Pending"
					value="24"
					icon={Clock}
					description="Assignments to review"
					iconClassName="bg-amber-500/10 text-amber-600"
				/>
				<StatsCard
					title="Avg. Performance"
					value="82%"
					icon={CheckCircle}
					trend={{ value: 5, isPositive: true }}
					description="Recent test average"
				/>
				<StatsCard
					title="Student Alerts"
					value="3"
					icon={AlertCircle}
					description="Require immediate attention"
					iconClassName="bg-red-500/10 text-red-600"
				/>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
				<div className="lg:col-span-2 space-y-6">
					<div className="bg-background border rounded-2xl p-6 shadow-sm overflow-hidden">
						<h3 className="text-lg font-bold tracking-tight mb-6">
							Upcoming Classes
						</h3>
						<div className="space-y-4">
							{[
								{
									name: "Mathematics 101",
									time: "09:00 AM - 10:30 AM",
									students: 32,
									room: "A-201",
									color: "bg-blue-500",
								},
								{
									name: "Physics Advance",
									time: "11:00 AM - 12:30 PM",
									students: 28,
									room: "Lab-01",
									color: "bg-purple-500",
								},
								{
									name: "Algebra II",
									time: "02:00 PM - 03:30 PM",
									students: 35,
									room: "B-105",
									color: "bg-emerald-500",
								},
							].map((cls) => (
								<div
									key={cls.name}
									className="flex items-center p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-all border border-transparent hover:border-border group"
								>
									<div
										className={cn("w-1 h-12 rounded-full mr-4", cls.color)}
									/>
									<div className="flex-1">
										<h4 className="font-bold text-foreground group-hover:text-primary transition-colors">
											{cls.name}
										</h4>
										<p className="text-xs text-muted-foreground font-medium mt-1">
											{cls.time}
										</p>
									</div>
									<div className="text-right">
										<p className="text-xs font-bold text-foreground">
											Room {cls.room}
										</p>
										<p className="text-[10px] text-muted-foreground mt-1 uppercase tracking-wider">
											{cls.students} Students
										</p>
									</div>
								</div>
							))}
						</div>
					</div>
				</div>

				<div>
					<RecentActivity
						activities={[
							{
								id: "1",
								title: "Assignment Submitted",
								description: 'Kevin Malone submitted "Calculus Basics"',
								time: "15 mins ago",
								icon: "📚",
								type: "success",
							},
							{
								id: "2",
								title: "Meeting Scheduled",
								description: "Parent-Teacher conference with Ross Geller",
								time: "2 hours ago",
								icon: "👥",
								type: "info",
							},
							{
								id: "3",
								title: "New Grade Released",
								description: "Mid-term results for Grade 9A Physics",
								time: "Yesterday",
								icon: "⭐",
								type: "info",
							},
						]}
					/>
				</div>
			</div>
		</DashboardLayout>
	);
};

export default TeacherDashboardView;

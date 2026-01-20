"use client";

import { BookOpen, Calendar, Trophy, Zap } from "lucide-react";
import type { FC } from "react";
import { cn } from "@/lib/utils";
import RecentActivity from "../components/RecentActivity";
import StatsCard from "../components/StatsCard";
import DashboardLayout from "../layout/DashboardLayout";

const StudentDashboardView: FC = () => {
	return (
		<DashboardLayout>
			<div className="space-y-2">
				<h1 className="text-3xl font-extrabold tracking-tight text-foreground">
					Welcome back,{" "}
					<span className="text-primary italic font-serif">Alex</span>.
				</h1>
				<p className="text-muted-foreground font-medium">
					You have 2 upcoming assignments this week. Stay focused!
				</p>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
				<StatsCard
					title="Attendance"
					value="98%"
					icon={Calendar}
					description="Keep it up!"
					iconClassName="bg-blue-500/10 text-blue-600"
				/>
				<StatsCard
					title="GPA"
					value="3.8"
					icon={Trophy}
					trend={{ value: 0.2, isPositive: true }}
					description="Cumulative grade point"
					iconClassName="bg-amber-500/10 text-amber-600"
				/>
				<StatsCard
					title="Courses"
					value="6"
					icon={BookOpen}
					description="Enrolled this term"
				/>
				<StatsCard
					title="Tasks"
					value="12"
					icon={Zap}
					description="Total pending items"
					iconClassName="bg-purple-500/10 text-purple-600"
				/>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
				<div className="lg:col-span-2 space-y-6">
					<div className="bg-background border rounded-2xl p-6 shadow-sm overflow-hidden">
						<h3 className="text-lg font-bold tracking-tight mb-6">
							Upcoming Assignments
						</h3>
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
							{[
								{
									title: "World War II Essay",
									subject: "History",
									date: "Tomorrow",
									urgency: "High",
									color: "border-red-500 bg-red-50/50",
								},
								{
									title: "Organic Chemistry Lab",
									subject: "Science",
									date: "Friday",
									urgency: "Medium",
									color: "border-amber-500 bg-amber-50/50",
								},
								{
									title: "Literature Review",
									subject: "English",
									date: "Jan 4th",
									urgency: "Low",
									color: "border-blue-500 bg-blue-50/50",
								},
								{
									title: "Trigonometry Quiz",
									subject: "Math",
									date: "Jan 5th",
									urgency: "Low",
									color: "border-emerald-500 bg-emerald-50/50",
								},
							].map((task) => (
								<div
									key={task.title}
									className={cn(
										"p-4 rounded-2xl border-l-4 shadow-sm hover:shadow-md transition-all cursor-pointer",
										task.color,
									)}
								>
									<p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
										{task.subject}
									</p>
									<h4 className="font-bold text-foreground mt-1">
										{task.title}
									</h4>
									<div className="flex items-center justify-between mt-4">
										<span className="text-xs font-semibold text-muted-foreground">
											Due {task.date}
										</span>
										<span
											className={cn(
												"text-[10px] font-bold px-2 py-0.5 rounded-full uppercase",
												task.urgency === "High"
													? "bg-red-500 text-white"
													: "bg-muted text-muted-foreground",
											)}
										>
											{task.urgency}
										</span>
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
								title: "Assignment Graded",
								description: 'You got an A in "Introduction to Algorithms"',
								time: "1 hour ago",
								icon: "✅",
								type: "success",
							},
							{
								id: "2",
								title: "New Library Book",
								description: '"Dune" by Frank Herbert is ready for pickup',
								time: "4 hours ago",
								icon: "📖",
								type: "info",
							},
							{
								id: "3",
								title: "Schedule Change",
								description: "Sports day moved to upcoming Friday",
								time: "Yesterday",
								icon: "🏃",
								type: "warning",
							},
						]}
					/>
				</div>
			</div>
		</DashboardLayout>
	);
};

export default StudentDashboardView;

import { Calendar, Clock } from "lucide-react";
import type { FC } from "react";
import { ContainerCard } from "@/components/base/ContainerCard";

const DAYS = [
	"Monday",
	"Tuesday",
	"Wednesday",
	"Thursday",
	"Friday",
	"Saturday",
];

const SUBJECTS = [
	{ subject: "Mathematics", teacher: "Dr. Smith", room: "Room 101" },
	{ subject: "Physics", teacher: "Prof. Johnson", room: "Lab A" },
	{ subject: "English", teacher: "Ms. Davis", room: "Room 203" },
	{ subject: "History", teacher: "Mr. Wilson", room: "Room 105" },
	{ subject: "Chemistry", teacher: "Ms. Brown", room: "Lab B" },
];

export const StudentTimeTable: FC = () => {
	// Simple mock data for demonstration
	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<h3 className="text-xl font-black flex items-center gap-2">
					<Calendar className="size-5 text-primary" />
					Weekly Schedule
				</h3>
				<div className="text-sm font-medium text-muted-foreground flex items-center gap-2">
					<Clock className="size-4" />
					Class Hours: 08:00 AM - 02:30 PM
				</div>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
				{DAYS.map((day) => (
					<ContainerCard
						key={day}
						className="p-4 border-none shadow-md bg-muted/20 hover:bg-muted/30 transition-colors"
					>
						<h4 className="font-black text-primary uppercase tracking-widest text-xs mb-4 border-b border-primary/10 pb-2">
							{day}
						</h4>
						<div className="space-y-4">
							{[1, 2, 3].map((period) => {
								const sub =
									SUBJECTS[Math.floor(Math.random() * SUBJECTS.length)];
								return (
									<div
										key={period}
										className="flex flex-col gap-1 p-3 rounded-xl bg-background border shadow-sm"
									>
										<div className="flex justify-between items-start">
											<span className="text-xs font-black text-muted-foreground/60">
												Period {period}
											</span>
											<span className="text-[10px] font-bold bg-primary/5 text-primary px-2 py-0.5 rounded-full uppercase tracking-tighter">
												{period === 1
													? "08:00 - 09:30"
													: period === 2
														? "10:00 - 11:30"
														: "12:00 - 01:30"}
											</span>
										</div>
										<p className="font-bold text-sm">{sub.subject}</p>
										<div className="flex justify-between items-center mt-1">
											<span className="text-[11px] text-muted-foreground">
												{sub.teacher}
											</span>
											<span className="text-[10px] font-black uppercase text-muted-foreground/40">
												{sub.room}
											</span>
										</div>
									</div>
								);
							})}
						</div>
					</ContainerCard>
				))}
			</div>
		</div>
	);
};

export default StudentTimeTable;

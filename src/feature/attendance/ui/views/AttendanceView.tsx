import { type FC, useState, useEffect } from "react";
import { toast } from "sonner";
import {
	Check,
	AlertCircle,
	Clock,
	ShieldAlert,
	CalendarIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { BaseButton } from "@/components/base/button";
import { BaseSelect } from "@/components/base/select";
import { BaseInput } from "@/components/base/input";
import { orpc } from "@/server/orpc/client";
import { useQuery } from "@tanstack/react-query";
import { useOrpcMutation } from "@/hooks/useOrpcMutation";
import type { ClassSchemaOutputType } from "@/feature/class/contract/class.schema";
import type { AttendanceResponse } from "@/feature/attendance/contract/attendance.schema";

const AttendanceView: FC = () => {
	const [selectedClassId, setSelectedClassId] = useState<string>("");
	const [selectedDate, setSelectedDate] = useState<string>(
		new Date().toISOString().split("T")[0],
	);

	// State to store local edits before saving to server
	const [attendanceRecords, setAttendanceRecords] = useState<
		{
			studentId: string;
			studentName: string;
			rollNumber: string | null;
			status: "PRESENT" | "ABSENT" | "LATE" | "EXCUSED";
			remarks: string;
		}[]
	>([]);

	// 1. Fetch classes to populate class selector dropdown
	const { data: classesData, isLoading: isLoadingClasses } = useQuery(
		orpc.class.list.queryOptions(),
	);
	const classes = classesData?.data ?? [];

	// 2. Fetch attendance roster when class and date are chosen
	const {
		data: attendanceData,
		isLoading: isLoadingRoster,
		refetch,
	} = useQuery({
		...orpc.attendance.get.queryOptions({
			input: { classId: selectedClassId, date: selectedDate },
		}),
		enabled: !!selectedClassId && !!selectedDate,
	});

	// Synchronize local state with fetched database roster
	useEffect(() => {
		if (attendanceData?.data) {
			setAttendanceRecords(
				attendanceData.data.map((r: AttendanceResponse) => ({
					studentId: r.studentId,
					studentName: r.studentName,
					rollNumber: r.rollNumber,
					status: r.status,
					remarks: r.remarks ?? "",
				})),
			);
		} else {
			setAttendanceRecords([]);
		}
	}, [attendanceData]);

	// 3. Mutation to save attendance
	const { mutate: markAttendance, isPending: isSaving } = useOrpcMutation(
		orpc.attendance.mark.mutationOptions({
			onSuccess: () => {
				refetch();
			},
		}),
		{
			successMessage: "Attendance saved successfully!",
		},
	);

	const handleStatusChange = (
		studentId: string,
		status: "PRESENT" | "ABSENT" | "LATE" | "EXCUSED",
	) => {
		setAttendanceRecords((prev) =>
			prev.map((rec) =>
				rec.studentId === studentId ? { ...rec, status } : rec,
			),
		);
	};

	const handleRemarksChange = (studentId: string, remarks: string) => {
		setAttendanceRecords((prev) =>
			prev.map((rec) =>
				rec.studentId === studentId ? { ...rec, remarks } : rec,
			),
		);
	};

	const handleMarkAllPresent = () => {
		setAttendanceRecords((prev) =>
			prev.map((rec) => ({ ...rec, status: "PRESENT" as const })),
		);
		toast.info("All students marked as Present locally. Click Save to submit.");
	};

	const handleSave = () => {
		if (!selectedClassId || !selectedDate) return;

		markAttendance({
			classId: selectedClassId,
			date: selectedDate,
			records: attendanceRecords.map((r) => ({
				studentId: r.studentId,
				status: r.status,
				remarks: r.remarks || null,
			})),
		});
	};

	// Convert classes list to BaseSelect options format
	const classOptions = classes.map((c: ClassSchemaOutputType) => ({
		label: c.name,
		value: c.id,
	}));

	return (
		<div className="space-y-6 p-6">
			{/* Header */}
			<div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">
						Student Attendance
					</h1>
					<p className="text-muted-foreground">
						Mark and manage student attendance records for your classes.
					</p>
				</div>
			</div>

			{/* Filters Bar */}
			<div className="bg-card border rounded-2xl p-6 shadow-sm flex flex-col md:flex-row items-end gap-4">
				<div className="w-full md:w-64 space-y-2">
					<label className="text-sm font-medium">Select Class</label>
					<BaseSelect
						value={selectedClassId}
						onChange={(val) => setSelectedClassId(val)}
						placeholder={
							isLoadingClasses ? "Loading classes..." : "Choose a Class"
						}
						data={classOptions}
					/>
				</div>

				<div className="w-full md:w-64 space-y-2">
					<label className="text-sm font-medium">Select Date</label>
					<div className="relative">
						<BaseInput
							type="date"
							value={selectedDate}
							onChange={(e) => setSelectedDate(e.target.value)}
							className="pr-10"
						/>
						<CalendarIcon className="absolute right-3 top-3 h-4 w-4 text-muted-foreground pointer-events-none" />
					</div>
				</div>

				{selectedClassId && attendanceRecords.length > 0 && (
					<BaseButton
						type="button"
						variant="outline"
						className="w-full md:w-auto h-10"
						onClick={handleMarkAllPresent}
					>
						Mark All Present
					</BaseButton>
				)}
			</div>

			{/* Roster Table */}
			{selectedClassId ? (
				<div className="bg-card border rounded-2xl overflow-hidden shadow-sm">
					{isLoadingRoster ? (
						<div className="p-12 text-center text-muted-foreground">
							Loading class roster...
						</div>
					) : attendanceRecords.length === 0 ? (
						<div className="p-12 text-center text-muted-foreground">
							No students found in this class. Add students under Directory
							first.
						</div>
					) : (
						<div className="divide-y">
							{/* Table Header */}
							<div className="grid grid-cols-12 gap-4 px-6 py-3 bg-muted/20 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
								<div className="col-span-2 md:col-span-1">Roll No</div>
								<div className="col-span-5 md:col-span-3">Student Name</div>
								<div className="col-span-5 md:col-span-5 text-center">
									Status
								</div>
								<div className="col-span-12 md:col-span-3">Remarks</div>
							</div>

							{/* Table Body */}
							<div className="divide-y">
								{attendanceRecords.map((record) => (
									<div
										key={record.studentId}
										className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-muted/5 transition-colors"
									>
										{/* Roll number */}
										<div className="col-span-2 md:col-span-1 text-sm font-medium">
											{record.rollNumber || "—"}
										</div>

										{/* Student Name */}
										<div className="col-span-5 md:col-span-3 text-sm font-semibold">
											{record.studentName}
										</div>

										{/* Toggle Buttons */}
										<div className="col-span-5 md:col-span-5 flex items-center justify-center gap-1.5 md:gap-2">
											{/* PRESENT */}
											<button
												type="button"
												onClick={() =>
													handleStatusChange(record.studentId, "PRESENT")
												}
												className={cn(
													"flex-1 flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg text-xs font-medium border transition-all",
													record.status === "PRESENT"
														? "bg-emerald-500/10 border-emerald-500 text-emerald-600 dark:text-emerald-400 font-semibold"
														: "border-muted bg-transparent text-muted-foreground hover:bg-muted/10",
												)}
											>
												<Check className="h-3.5 w-3.5" />
												<span className="hidden sm:inline">Present</span>
											</button>

											{/* ABSENT */}
											<button
												type="button"
												onClick={() =>
													handleStatusChange(record.studentId, "ABSENT")
												}
												className={cn(
													"flex-1 flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg text-xs font-medium border transition-all",
													record.status === "ABSENT"
														? "bg-rose-500/10 border-rose-500 text-rose-600 dark:text-rose-400 font-semibold"
														: "border-muted bg-transparent text-muted-foreground hover:bg-muted/10",
												)}
											>
												<AlertCircle className="h-3.5 w-3.5" />
												<span className="hidden sm:inline">Absent</span>
											</button>

											{/* LATE */}
											<button
												type="button"
												onClick={() =>
													handleStatusChange(record.studentId, "LATE")
												}
												className={cn(
													"flex-1 flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg text-xs font-medium border transition-all",
													record.status === "LATE"
														? "bg-amber-500/10 border-amber-500 text-amber-600 dark:text-amber-400 font-semibold"
														: "border-muted bg-transparent text-muted-foreground hover:bg-muted/10",
												)}
											>
												<Clock className="h-3.5 w-3.5" />
												<span className="hidden sm:inline">Late</span>
											</button>

											{/* EXCUSED */}
											<button
												type="button"
												onClick={() =>
													handleStatusChange(record.studentId, "EXCUSED")
												}
												className={cn(
													"flex-1 flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg text-xs font-medium border transition-all",
													record.status === "EXCUSED"
														? "bg-slate-500/10 border-slate-500 text-slate-600 dark:text-slate-400 font-semibold"
														: "border-muted bg-transparent text-muted-foreground hover:bg-muted/10",
												)}
											>
												<ShieldAlert className="h-3.5 w-3.5" />
												<span className="hidden sm:inline">Excused</span>
											</button>
										</div>

										{/* Remarks Input */}
										<div className="col-span-12 md:col-span-3">
											<BaseInput
												placeholder="Add note (optional)"
												value={record.remarks}
												onChange={(e) =>
													handleRemarksChange(record.studentId, e.target.value)
												}
												className="h-9 text-xs"
											/>
										</div>
									</div>
								))}
							</div>

							{/* Actions Footer */}
							<div className="flex justify-end p-6 bg-muted/5">
								<BaseButton
									type="button"
									onClick={handleSave}
									isLoading={isSaving}
									disabled={isSaving}
									className="w-full sm:w-auto px-8"
								>
									Save Attendance
								</BaseButton>
							</div>
						</div>
					)}
				</div>
			) : (
				<div className="bg-card border border-dashed rounded-2xl p-16 text-center text-muted-foreground">
					Please select a class and date from the controls above to load the
					roster.
				</div>
			)}
		</div>
	);
};

export default AttendanceView;

import type { AttendanceStatus } from "prisma/generated/client";
import { logger } from "@/lib/logger";
import { toSuccessResponse } from "@/server/orpc/utils";
import type { AttendanceRepository } from "../repo/attendance.repo";
import type {
	AttendanceRecord,
	AttendanceResponse,
	AttendanceReportResponse,
} from "../contract/attendance.schema";

export class AttendanceService {
	constructor(private repo: AttendanceRepository) {}

	/**
	 * Marks attendance for a class on a specific date.
	 */
	async mark(classId: string, dateStr: string, records: AttendanceRecord[]) {
		logger.info(
			{ classId, dateStr, count: records.length },
			"Marking class attendance",
		);

		// Parse date string as UTC midnight to avoid timezone shifting
		const date = new Date(`${dateStr}T00:00:00.000Z`);

		await this.repo.markAttendance(
			classId,
			date,
			records.map((r) => ({
				studentId: r.studentId,
				status: r.status as AttendanceStatus,
				remarks: r.remarks,
			})),
		);

		return toSuccessResponse(null, "Attendance marked successfully");
	}

	/**
	 * Retrieves the attendance roster for a class on a specific date.
	 * Merges existing attendance records with the full student roster of the class.
	 */
	async get(classId: string, dateStr: string): Promise<AttendanceResponse[]> {
		logger.debug({ classId, dateStr }, "Fetching class attendance roster");

		const date = new Date(`${dateStr}T00:00:00.000Z`);

		// 1. Fetch all students in the class
		const students = await this.repo.findStudentsByClass(classId);

		// 2. Fetch marked attendance for this class and date
		const markedAttendance = await this.repo.findAttendanceByClassAndDate(
			classId,
			date,
		);

		// Create a lookup map of studentId -> attendance record
		const attendanceMap = new Map(
			markedAttendance.map((a) => [a.studentId, a]),
		);

		// 3. Merge rosters: return marked status or default to PRESENT
		return students.map((student) => {
			const marked = attendanceMap.get(student.id);

			return {
				id: marked?.id ?? `temp-${student.id}`,
				date,
				status: (marked?.status ?? "PRESENT") as any,
				remarks: marked?.remarks ?? null,
				studentId: student.id,
				studentName: student.user.name,
				rollNumber: student.rollNumber,
			};
		});
	}

	/**
	 * Generates an attendance summary report for a single student.
	 */
	async getReport(studentId: string): Promise<AttendanceReportResponse> {
		logger.debug({ studentId }, "Generating student attendance report");

		const records = await this.repo.findAttendanceByStudent(studentId);

		const totalDays = records.length;
		const presentDays = records.filter((r) => r.status === "PRESENT").length;
		const absentDays = records.filter((r) => r.status === "ABSENT").length;
		const lateDays = records.filter((r) => r.status === "LATE").length;
		const excusedDays = records.filter((r) => r.status === "EXCUSED").length;

		// Attendance % treats Late as fully present or partially present, let's treat it as present for simplicity
		const percentage =
			totalDays > 0
				? Math.round(((presentDays + lateDays) / totalDays) * 100)
				: 100;

		return {
			totalDays,
			presentDays,
			absentDays,
			lateDays,
			excusedDays,
			percentage,
			records: records.map((r) => ({
				id: r.id,
				date: r.date,
				status: r.status as any,
				remarks: r.remarks,
			})),
		};
	}
}

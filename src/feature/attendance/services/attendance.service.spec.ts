import { beforeEach, describe, expect, it, vi } from "vitest";
import { AttendanceService } from "./attendance.service";
import { AttendanceRepository } from "../repo/attendance.repo";

describe("AttendanceService", () => {
	let service: AttendanceService;
	let repo: AttendanceRepository;

	beforeEach(() => {
		repo = new AttendanceRepository();
		service = new AttendanceService(repo);
		vi.clearAllMocks();
	});

	describe("mark", () => {
		it("should mark attendance successfully", async () => {
			const classId = "class-1";
			const dateStr = "2026-06-13";
			const records = [
				{
					studentId: "student-1",
					status: "PRESENT" as const,
					remarks: "On time",
				},
				{ studentId: "student-2", status: "ABSENT" as const },
			];

			const mockMarkAttendance = vi
				.spyOn(repo, "markAttendance")
				.mockResolvedValue([] as any);

			const result = await service.mark(classId, dateStr, records);

			expect(mockMarkAttendance).toHaveBeenCalledWith(
				classId,
				new Date("2026-06-13T00:00:00.000Z"),
				records,
			);
			expect(result).toEqual({
				success: true,
				message: "Attendance marked successfully",
				data: null,
			});
		});
	});

	describe("get", () => {
		it("should return merged class roster and marked attendance status", async () => {
			const classId = "class-1";
			const dateStr = "2026-06-13";
			const mockDate = new Date("2026-06-13T00:00:00.000Z");

			// Mock roster containing 2 students
			const mockStudents = [
				{ id: "student-1", rollNumber: "01", user: { name: "Alice" } },
				{ id: "student-2", rollNumber: "02", user: { name: "Bob" } },
			];

			// Mock marked attendance showing Alice was Absent, Bob is unmarked (not in the list)
			const mockMarked = [
				{
					id: "attendance-1",
					studentId: "student-1",
					status: "ABSENT",
					remarks: "Sick leave",
				},
			];

			vi.spyOn(repo, "findStudentsByClass").mockResolvedValue(
				mockStudents as any,
			);
			vi.spyOn(repo, "findAttendanceByClassAndDate").mockResolvedValue(
				mockMarked as any,
			);

			const result = await service.get(classId, dateStr);

			expect(repo.findStudentsByClass).toHaveBeenCalledWith(classId);
			expect(repo.findAttendanceByClassAndDate).toHaveBeenCalledWith(
				classId,
				mockDate,
			);

			expect(result).toHaveLength(2);
			// Alice should show ABSENT status with remarks
			expect(result[0]).toEqual({
				id: "attendance-1",
				date: mockDate,
				status: "ABSENT",
				remarks: "Sick leave",
				studentId: "student-1",
				studentName: "Alice",
				rollNumber: "01",
			});
			// Bob should default to PRESENT status with null remarks
			expect(result[1]).toEqual({
				id: "temp-student-2",
				date: mockDate,
				status: "PRESENT",
				remarks: null,
				studentId: "student-2",
				studentName: "Bob",
				rollNumber: "02",
			});
		});
	});

	describe("getReport", () => {
		it("should calculate attendance statistics correctly for a student", async () => {
			const studentId = "student-1";

			// Alice had 4 records: 2 Present, 1 Late, 1 Absent
			const mockRecords = [
				{ id: "a1", date: new Date(), status: "PRESENT", remarks: null },
				{ id: "a2", date: new Date(), status: "PRESENT", remarks: null },
				{ id: "a3", date: new Date(), status: "LATE", remarks: "Traffic" },
				{ id: "a4", date: new Date(), status: "ABSENT", remarks: "Skipped" },
			];

			vi.spyOn(repo, "findAttendanceByStudent").mockResolvedValue(
				mockRecords as any,
			);

			const result = await service.getReport(studentId);

			expect(repo.findAttendanceByStudent).toHaveBeenCalledWith(studentId);
			expect(result.totalDays).toBe(4);
			expect(result.presentDays).toBe(2);
			expect(result.absentDays).toBe(1);
			expect(result.lateDays).toBe(1);
			expect(result.excusedDays).toBe(0);
			// Percentage formula in service is Math.round(((Present + Late) / Total) * 100)
			// ((2 + 1) / 4) * 100 = 75%
			expect(result.percentage).toBe(75);
			expect(result.records).toHaveLength(4);
		});
	});
});

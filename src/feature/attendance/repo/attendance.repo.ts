import type { AttendanceStatus } from "prisma/generated/client";
import { prisma } from "@/db/prisma";

export class AttendanceRepository {
	/**
	 * Batch upserts attendance records for a class on a specific date.
	 */
	async markAttendance(
		classId: string,
		date: Date,
		records: {
			studentId: string;
			status: AttendanceStatus;
			remarks?: string | null;
		}[],
	) {
		return await prisma.$transaction(
			records.map((record) =>
				prisma.attendance.upsert({
					where: {
						studentId_date: {
							studentId: record.studentId,
							date,
						},
					},
					update: {
						status: record.status,
						remarks: record.remarks ?? null,
					},
					create: {
						studentId: record.studentId,
						classId,
						date,
						status: record.status,
						remarks: record.remarks ?? null,
					},
				}),
			),
		);
	}

	/**
	 * Fetches all student profiles registered in a given class.
	 */
	async findStudentsByClass(classId: string) {
		return await prisma.studentProfile.findMany({
			where: { classId },
			include: {
				user: true,
			},
			orderBy: {
				rollNumber: "asc",
			},
		});
	}

	/**
	 * Fetches existing attendance records for a class on a specific date.
	 */
	async findAttendanceByClassAndDate(classId: string, date: Date) {
		return await prisma.attendance.findMany({
			where: {
				classId,
				date,
			},
			include: {
				student: {
					include: {
						user: true,
					},
				},
			},
		});
	}

	/**
	 * Fetches all attendance records for a single student.
	 */
	async findAttendanceByStudent(studentId: string) {
		return await prisma.attendance.findMany({
			where: { studentId },
			orderBy: { date: "desc" },
		});
	}

	/**
	 * Executes operations inside a transaction.
	 */
	async transaction<T>(fn: (tx: any) => Promise<T>): Promise<T> {
		return await prisma.$transaction(fn);
	}
}

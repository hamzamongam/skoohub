import { moveTempImageToPermanent } from "@/lib/file-utils";
import { logger } from "@/lib/logger";
import { toSuccessResponse } from "@/server/orpc/utils";
import { ConflictError } from "@/utils/errors";
import type { StudentRepository } from "../repo/student.repo";

/**
 * StudentService handles business logic for student management.
 */
export class StudentService {
	constructor(private repo: StudentRepository) {}

	/**
	 * Creates a student record.
	 * Checks for existing email before creation.
	 */
	async create(data: Parameters<StudentRepository["create"]>[0]) {
		logger.debug({ email: data.email }, "Creating student");

		const existing = await this.repo.findByEmail(data.email);
		if (existing) {
			throw new ConflictError(`User with email "${data.email}" already exists`);
		}

		let finalImage = data.image;
		if (data.image) {
			finalImage = await moveTempImageToPermanent(data.image);
		}

		const student = await this.repo.create({
			...data,
			image: finalImage,
			role: "student",
		});

		logger.info({ studentId: student.id }, "Student created successfully");
		return toSuccessResponse(student, "Student created successfully");
	}

	/**
	 * Lists all students for a given school.
	 */
	async list(schoolId: string) {
		logger.debug({ schoolId }, "Listing students for school");
		const students = await this.repo.findAllBySchoolId(schoolId);
		return toSuccessResponse(students);
	}

	/**
	 * Deletes a student record.
	 */
	async delete(id: string) {
		logger.debug({ id }, "Deleting student");
		const result = await this.repo.delete(id);
		return toSuccessResponse(result, "Student deleted successfully");
	}
}

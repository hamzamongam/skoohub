import crypto from "node:crypto";
import { UploadService } from "@/feature/upload/upload.service";
import { logger } from "@/lib/logger";
import { auth } from "@/server/auth";
import { toSuccessResponse } from "@/server/orpc/utils";
import {
	ConflictError,
	NotFoundError,
	UnauthorizedError,
} from "@/utils/errors";
import type {
	StudentSchemaInputType,
	StudentSchemaOutputType,
} from "../contract/student.shema";
import type { StudentRepository } from "../repo/student.repo";
import type { StudentModel } from "../types/server.type";

/**
 * StudentService handles business logic for student management.
 */
export class StudentService {
	constructor(private repo: StudentRepository) {}
	private uploadService = new UploadService();
	/**
	 * Creates a student record.
	 * Checks for existing email before creation.
	 */
	async create(data: StudentSchemaInputType, schoolId?: string) {
		logger.debug({ email: data.email }, "Creating student");

		const existing = await this.repo.findByEmail(data.email);
		if (existing) {
			throw new ConflictError(`User with email "${data.email}" already exists`);
		}
		if (!schoolId) {
			throw new UnauthorizedError(`School ID is required`);
		}

		const tempPassword = crypto.randomUUID();

		// Separate User data from StudentProfile data
		const { name, email, image, ...profileData } = data;

		let imageUrl: string | null = null;
		let imageKey: string | null = null;
		if (image) {
			if (typeof image === "string") {
				imageUrl = image;
			} else {
				const result = await this.uploadService.createUploadUrl({
					file: image,
					folder: "students",
				});
				imageUrl = result.url;
				imageKey = result.key;
			}
		}

		const { user } = await auth.api.createUser({
			body: {
				data: {
					schoolId,
					image: imageUrl,
				},
				email,
				password: tempPassword,
				name,
				role: "student",
			},
		});

		const student = await this.repo.create({
			...profileData,
			imageKey,
			userId: user.id ?? null,
		});

		logger.info({ student }, "Student created successfully");

		// Trigger password reset flow for the new user (Invitation)
		const baseUrl = process.env.BETTER_AUTH_URL || "http://localhost:3000";

		try {
			await auth.api.requestPasswordReset({
				body: {
					email,
					redirectTo: `${baseUrl}/auth/reset-password`,
				},
			});
			logger.info(
				{ email: data.email },
				"Invitation email sent via Password Reset flow",
			);
		} catch (error) {
			logger.error(
				{ email: data.email, error },
				"Failed to send invitation email",
			);
		}

		return toSuccessResponse(
			this.formatStudentOutput(student),
			"Student created successfully",
		);
	}

	/**
	 * Lists all students for a given school.
	 */
	async list(schoolId: string) {
		logger.debug({ schoolId }, "Listing students for school");
		const students = await this.repo.listBySchoolId(schoolId);
		return toSuccessResponse(students.map((s) => this.formatStudentOutput(s)));
	}

	/**
	 * Deletes a student record.
	 */
	async delete(id: string) {
		logger.debug({ id }, "Deleting student");
		const result = await this.repo.deleteUser(id);
		return toSuccessResponse(result, "Student deleted successfully");
	}

	async get(id: string) {
		logger.debug({ id }, "Getting student");
		const student = await this.repo.findStudentById(id);
		if (!student) {
			throw new Error("Student not found");
		}
		return toSuccessResponse(this.formatStudentOutput(student));
	}

	async update(userId: string, data: StudentSchemaInputType) {
		logger.debug({ userId }, "Updating student");
		// Separate User data from StudentProfile data
		const { name, email, phone, image, ...profileData } = data;

		// Fetch current student to get existing imageKey
		const currentStudent = await this.repo.findStudentById(userId);

		let imageUrl: string | null | undefined;
		let imageKey: string | null | undefined;

		if (image) {
			if (typeof image === "string") {
				imageUrl = image;
				// imageKey remains undefined (do not update)
			} else {
				// New file uploaded
				if ((currentStudent as any)?.imageKey) {
					await this.uploadService.deleteImage(
						(currentStudent as any).imageKey,
					);
				}
				const result = await this.uploadService.createUploadUrl({
					file: image,
					folder: "students",
				});
				imageUrl = result.url;
				imageKey = result.key;
			}
		} else if (image === null) {
			// Image removed
			if ((currentStudent as any)?.imageKey) {
				await this.uploadService.deleteImage((currentStudent as any).imageKey);
			}
			imageUrl = null;
			imageKey = null;
		}

		const student = await this.repo.update(userId, {
			...profileData,
			name,
			image: imageUrl,
			phone,
			...(imageKey !== undefined && { imageKey }),
		});

		if (!student) {
			throw new NotFoundError("Student not found");
		}
		return toSuccessResponse(
			this.formatStudentOutput(student),
			"Student updated successfully",
		);
	}

	private formatStudentOutput(student: StudentModel): StudentSchemaOutputType {
		const { user, ...studentProfile } = student;
		return {
			...studentProfile,
			class: {
				id: studentProfile.class?.id ?? "",
				name: studentProfile.class?.name ?? "",
			},
			...user,
			id: user.id, // Ensure we use the User ID
			isActive: true, // TODO: Get from user if available, defaulting to true as per schema
			schoolId: user.schoolId,
		};
	}
}

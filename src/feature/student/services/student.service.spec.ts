import { beforeEach, describe, expect, it, vi } from "vitest";
import { auth } from "@/server/auth";
import { ConflictError } from "@/utils/errors";
import { StudentService } from "./student.service";

vi.mock("@/server/auth", () => ({
	auth: {
		api: {
			createUser: vi.fn(),
		},
	},
}));

describe("StudentService", () => {
	let service: StudentService;
	let repo: any;

	beforeEach(() => {
		repo = {
			findByEmail: vi.fn(),
			create: vi.fn(),
			listBySchoolId: vi.fn(),
			deleteUser: vi.fn(),
			update: vi.fn(),
			findUserById: vi.fn(),
		};
		service = new StudentService(repo);
		vi.clearAllMocks();
	});

	describe("create", () => {
		it("should create a student successfully", async () => {
			const data = {
				name: "John Doe",
				email: "john@test.com",
				schoolId: "school-1",
				classId: "class-1",
			};
			const mockUser = {
				id: "user-1",
				name: data.name,
				email: data.email,
				role: "student",
				schoolId: data.schoolId,
				classId: data.classId,
				class: {
					id: "class-1",
					name: "Class 1",
				},
			};
			const mockStudent = {
				user: mockUser,
				id: "student-1", // This is profile ID technically, likely uuid
				userId: "user-1",
			};

			repo.findByEmail.mockResolvedValue(null);
			repo.create.mockResolvedValue(mockStudent);
			(auth.api.createUser as any).mockResolvedValue({
				user: mockUser,
			});

			const result = await service.create(data, data.schoolId);

			expect(repo.findByEmail).toHaveBeenCalledWith(data.email);
			expect(repo.create).toHaveBeenCalledWith(
				expect.objectContaining({
					userId: "user-1",
				}),
			);
			expect(result).toEqual({
				success: true,
				message: "Student created successfully",
				data: {
					name: "John Doe",
					email: "john@test.com",
					role: "student",
					schoolId: "school-1",
					userId: "user-1",
					isActive: true,
					classId: "class-1",
					class: {
						id: "class-1",
						name: "Class 1",
					},
					id: "user-1", // formatStudentOutput overwrites profile ID with User ID
				},
			});
		});

		it("should throw ConflictError if email already exists", async () => {
			const data = {
				name: "John Doe",
				email: "john@test.com",
				schoolId: "school-1",
			};
			repo.findByEmail.mockResolvedValue({ id: "student-1" });

			await expect(service.create(data)).rejects.toThrow(ConflictError);
			expect(repo.create).not.toHaveBeenCalled();
		});
	});

	describe("list", () => {
		it("should return a list of students", async () => {
			const schoolId = "school-1";
			const mockUser = {
				id: "user-1",
				name: "John Doe",
				schoolId,
				classId: "class-1",
				class: {
					id: "class-1",
					name: "Class 1",
				},
			};
			const mockStudents = [
				{
					user: mockUser,
					id: "student-1",
				},
			];
			repo.listBySchoolId.mockResolvedValue(mockStudents);

			const result = await service.list(schoolId);

			expect(repo.listBySchoolId).toHaveBeenCalledWith(schoolId);
			expect(result).toEqual({
				success: true,
				message: "Action completed successfully",
				data: [
					{
						id: "user-1",
						name: "John Doe",
						schoolId,
						isActive: true,
						classId: "class-1",
						class: {
							id: "class-1",
							name: "Class 1",
						},
					},
				],
			});
		});
	});

	describe("delete", () => {
		it("should delete a student successfully", async () => {
			const id = "student-1";
			const mockDeleted = { id };
			repo.deleteUser.mockResolvedValue(mockDeleted);

			const result = await service.delete(id);

			expect(repo.deleteUser).toHaveBeenCalledWith(id);
			expect(result).toEqual({
				success: true,
				message: "Student deleted successfully",
				data: mockDeleted,
			});
		});
	});
});

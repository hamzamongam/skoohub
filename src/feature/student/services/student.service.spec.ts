import { beforeEach, describe, expect, it, vi } from "vitest";
import { ConflictError } from "@/utils/errors";
import { StudentService } from "./student.service";

describe("StudentService", () => {
	let service: StudentService;
	let repo: any;

	beforeEach(() => {
		repo = {
			findByEmail: vi.fn(),
			create: vi.fn(),
			findAllBySchoolId: vi.fn(),
			delete: vi.fn(),
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
			};
			const mockStudent = { id: "student-1", ...data, role: "student" };

			repo.findByEmail.mockResolvedValue(null);
			repo.create.mockResolvedValue(mockStudent);

			const result = await service.create(data);

			expect(repo.findByEmail).toHaveBeenCalledWith(data.email);
			expect(repo.create).toHaveBeenCalledWith(expect.objectContaining(data));
			expect(result).toEqual({
				success: true,
				message: "Student created successfully",
				data: mockStudent,
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
			const mockStudents = [{ id: "student-1", name: "John Doe" }];
			repo.findAllBySchoolId.mockResolvedValue(mockStudents);

			const result = await service.list(schoolId);

			expect(repo.findAllBySchoolId).toHaveBeenCalledWith(schoolId);
			expect(result).toEqual({
				success: true,
				message: "Action completed successfully",
				data: mockStudents,
			});
		});
	});

	describe("delete", () => {
		it("should delete a student successfully", async () => {
			const id = "student-1";
			const mockDeleted = { id };
			repo.delete.mockResolvedValue(mockDeleted);

			const result = await service.delete(id);

			expect(repo.delete).toHaveBeenCalledWith(id);
			expect(result).toEqual({
				success: true,
				message: "Student deleted successfully",
				data: mockDeleted,
			});
		});
	});
});

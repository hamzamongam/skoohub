import { beforeEach, describe, expect, it, vi } from "vitest";
import { NotFoundError } from "@/utils/errors";
import { OnboardingRepository } from "../repo/onboarding.repo";
import { OnboardingService } from "./onboarding.service";

describe("OnboardingService", () => {
	let service: OnboardingService;
	let repo: OnboardingRepository;

	beforeEach(() => {
		repo = new OnboardingRepository();
		service = new OnboardingService(repo);
		vi.clearAllMocks();
	});

	describe("setupAcademicStructure", () => {
		it("should setup academic year and terms successfully", async () => {
			const schoolId = "school-1";
			const input = {
				yearName: "2025-2026",
				startDate: new Date("2025-09-01"),
				endDate: new Date("2026-06-30"),
				terms: [
					{
						name: "Term 1",
						startDate: new Date("2025-09-01"),
						endDate: new Date("2025-12-20"),
					},
				],
				gradingSystem: "GPA",
			};

			const mockAcademicYear = { id: "ay-1", ...input };

			// Mock transaction and internal calls
			vi.spyOn(repo, "transaction").mockImplementation(async (fn: any) => {
				const tx = {
					academicYear: {
						create: vi.fn().mockResolvedValue(mockAcademicYear),
						updateMany: vi.fn().mockResolvedValue({ count: 0 }),
					},
					school: { update: vi.fn().mockResolvedValue({}) },
				};
				return await fn(tx);
			});

			const result = await service.setupAcademicStructure(schoolId, input);

			expect(repo.transaction).toHaveBeenCalled();
			expect(repo.transaction).toHaveBeenCalled();
			expect(result).toEqual({
				success: true,
				message: "Academic structure saved",
				data: mockAcademicYear,
			});
		});
	});

	describe("setupClasses", () => {
		it("should setup grades and sections successfully", async () => {
			const schoolId = "school-1";
			const input = {
				grades: [{ name: "Grade 1", level: 1, sections: ["A", "B"] }],
			};

			vi.spyOn(repo, "transaction").mockImplementation(async (fn: any) => {
				const tx = {
					gradeLevel: { create: vi.fn().mockResolvedValue({}) },
					school: { update: vi.fn().mockResolvedValue({}) },
				};
				return await fn(tx);
			});

			const result = await service.setupClasses(schoolId, input);

			expect(repo.transaction).toHaveBeenCalled();
			expect(result.success).toBe(true);
			expect(result.message).toBe("Classes configured successfully");
			expect(result.data).toBeNull();
		});
	});

	describe("inviteStaff", () => {
		it("should create invitations and finalize onboarding successfully", async () => {
			const schoolId = "school-1";
			const inviterId = "user-1";
			const emails = ["teacher@test.com"];

			vi.spyOn(repo, "findSchoolById").mockResolvedValue({
				id: schoolId,
			} as any);
			vi.spyOn(repo, "createInvitation").mockResolvedValue({} as any);
			vi.spyOn(repo, "updateSchoolStatus").mockResolvedValue({} as any);

			const result = await service.inviteStaff(schoolId, inviterId, emails);

			expect(repo.findSchoolById).toHaveBeenCalledWith(schoolId);
			expect(repo.createInvitation).toHaveBeenCalled();
			expect(repo.updateSchoolStatus).toHaveBeenCalledWith(
				schoolId,
				"COMPLETED",
			);
			expect(repo.updateSchoolStatus).toHaveBeenCalledWith(
				schoolId,
				"COMPLETED",
			);
			expect(result.success).toBe(true);
			expect(result.message).toBe("Staff invitations sent");
			expect(result.data).toBeNull();
		});

		it("should throw NotFoundError if school does not exist", async () => {
			vi.spyOn(repo, "findSchoolById").mockResolvedValue(null);

			await expect(
				service.inviteStaff("none", "1", ["a@b.com"]),
			).rejects.toThrow(NotFoundError);
		});
	});
});

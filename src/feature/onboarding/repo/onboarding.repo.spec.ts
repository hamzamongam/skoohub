import { beforeEach, describe, expect, it, vi } from "vitest";
import { prisma } from "@/db/prisma";
import { OnboardingRepository } from "./onboarding.repo";

vi.mock("@/db/prisma", () => ({
	prisma: {
		academicYear: { create: vi.fn() },
		school: { update: vi.fn(), findUnique: vi.fn() },
		class: { create: vi.fn() },
		invitation: { create: vi.fn() },
		$transaction: vi.fn(),
	},
}));

describe("OnboardingRepository", () => {
	let repo: OnboardingRepository;

	beforeEach(() => {
		repo = new OnboardingRepository();
		vi.clearAllMocks();
	});

	it("should create an academic year", async () => {
		const data = {
			name: "2025",
			startDate: new Date(),
			endDate: new Date(),
			schoolId: "s1",
		};
		await repo.createAcademicYear(data as any);
		expect(prisma.academicYear.create).toHaveBeenCalledWith({ data });
	});

	it("should update school status", async () => {
		const schoolId = "s1";
		const status = "ACTIVE" as any;
		await repo.updateSchoolStatus(schoolId, status);
		expect(prisma.school.update).toHaveBeenCalledWith({
			where: { id: schoolId },
			data: { onboardingStatus: status },
		});
	});

	it("should create a class", async () => {
		const data = { name: "Grade 1-A", grade: "Grade 1", section: "A", medium: "English", schoolId: "s1" };
		await repo.createClass(data as any);
		expect(prisma.class.create).toHaveBeenCalledWith({ data });
	});

	it("should find school by id", async () => {
		const id = "s1";
		await repo.findSchoolById(id);
		expect(prisma.school.findUnique).toHaveBeenCalledWith({ where: { id } });
	});

	it("should create an invitation", async () => {
		const data = {
			email: "test@test.com",
			organizationId: "s1",
			status: "pending",
			expiresAt: new Date(),
			inviterId: "u1",
		};
		await repo.createInvitation(data as any);
		expect(prisma.invitation.create).toHaveBeenCalledWith({ data });
	});

	it("should execute a transaction", async () => {
		const mockFn = vi.fn();
		await repo.transaction(mockFn);
		expect(prisma.$transaction).toHaveBeenCalledWith(mockFn);
	});
});

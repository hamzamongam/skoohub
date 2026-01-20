import { beforeEach, describe, expect, it, vi } from "vitest";

describe("onboardingRouter", () => {
	beforeEach(() => {
		vi.resetModules();
		vi.clearAllMocks();
	});

	it("should call onboardingService.setupAcademicStructure in the setupAcademicStructure handler", async () => {
		const mockSetup = vi.fn();
		vi.doMock("../services/onboarding.service", () => ({
			OnboardingService: vi.fn().mockImplementation(() => ({
				setupAcademicStructure: mockSetup,
			})),
		}));

		const { onboardingRouter } = await import("./onboarding.router");

		const input = {
			yearName: "2025-2026",
			startDate: new Date("2025-01-01"),
			endDate: new Date("2025-12-31"),
			terms: [],
			gradingSystem: "GPA",
		};
		const schoolId = "s1";
		mockSetup.mockResolvedValue({
			success: true,
			data: { id: "ay1" },
		} as any);

		const result = await onboardingRouter.setupAcademicStructure[
			"~orpc"
		].handler({
			input,
			context: { schoolId },
		} as any);

		expect(mockSetup).toHaveBeenCalledWith(schoolId, input);
		expect(result).toEqual({
			success: true,
			data: { id: "ay1" },
		});
	});

	it("should call onboardingService.setupClasses in the setupClasses handler", async () => {
		const mockSetup = vi.fn();
		vi.doMock("../services/onboarding.service", () => ({
			OnboardingService: vi.fn().mockImplementation(() => ({
				setupClasses: mockSetup,
			})),
		}));

		const { onboardingRouter } = await import("./onboarding.router");

		const input = { grades: [] };
		const schoolId = "s1";
		mockSetup.mockResolvedValue({
			success: true,
			data: null,
		} as any);

		const result = await onboardingRouter.setupClasses["~orpc"].handler({
			input,
			context: { schoolId },
		} as any);

		expect(mockSetup).toHaveBeenCalledWith(schoolId, input);
		expect(result.success).toBe(true);
	});

	it("should call onboardingService.inviteStaff in the inviteStaff handler", async () => {
		const mockInvite = vi.fn();
		vi.doMock("../services/onboarding.service", () => ({
			OnboardingService: vi.fn().mockImplementation(() => ({
				inviteStaff: mockInvite,
			})),
		}));

		const { onboardingRouter } = await import("./onboarding.router");

		const input = { emails: ["test@test.com"] };
		const schoolId = "s1";
		const userId = "u1";
		mockInvite.mockResolvedValue({
			success: true,
			data: null,
		} as any);

		const result = await onboardingRouter.inviteStaff["~orpc"].handler({
			input,
			context: { schoolId, user: { id: userId } },
		} as any);

		expect(mockInvite).toHaveBeenCalledWith(schoolId, userId, input.emails);
		expect(result.success).toBe(true);
	});
});

// @vitest-environment jsdom
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import OnboardingWizard from "./OnboardingWizard";

// Hoist mocks to ensure they are available before modules load
const { mockMutate, mockUseOrpcMutation, mockMutationOptions } = vi.hoisted(
	() => {
		let registeredOnSuccess: any = null;

		const mockMutate = vi.fn().mockImplementation((variables) => {
			console.log("mockMutate called with", variables);
			console.log("registeredOnSuccess is", typeof registeredOnSuccess);
			if (registeredOnSuccess) {
				registeredOnSuccess({ success: true, data: {} });
			}
		});

		const mockUseOrpcMutation = vi.fn().mockImplementation((options) => {
			console.log("useOrpcMutation called with options", typeof options?.onSuccess);
			if (options && options.onSuccess) {
				registeredOnSuccess = options.onSuccess;
			}
			return {
				mutate: mockMutate,
				isPending: false,
			};
		});

		const mockMutationOptions = vi.fn().mockImplementation((opts) => opts);

		return { mockMutate, mockUseOrpcMutation, mockMutationOptions };
	},
);

vi.mock("@/hooks/useOrpcMutation", () => ({
	useOrpcMutation: mockUseOrpcMutation,
}));

vi.mock("@/server/orpc/client", () => ({
	orpc: {
		onboarding: {
			setupAcademicStructure: {
				mutationOptions: mockMutationOptions,
			},
			setupClasses: {
				mutationOptions: mockMutationOptions,
			},
			inviteStaff: {
				mutationOptions: mockMutationOptions,
			},
		},
	},
}));

vi.mock("@tanstack/react-query", () => ({
	useQueryClient: () => ({
		invalidateQueries: vi.fn().mockResolvedValue(undefined),
	}),
}));

vi.mock("@tanstack/react-router", () => ({
	useNavigate: () => vi.fn(),
	useRouter: () => ({
		navigate: vi.fn(),
	}),
}));

describe("OnboardingWizard Integration Flow", () => {
	const onCompleteMock = vi.fn();

	beforeEach(() => {
		vi.clearAllMocks();
		onCompleteMock.mockReset();
	});

	it("should progress through Step 1, Step 2, and Step 3 successfully", async () => {
		render(<OnboardingWizard onComplete={onCompleteMock} />);

		// ==========================================
		// STEP 1: Academic Year
		// ==========================================
		expect(screen.getByText("Academic Year Structure")).toBeInTheDocument();
		expect(screen.getByLabelText(/Academic Year Name/i)).toBeInTheDocument();

		// Submit Step 1
		const saveStep1Btn = screen.getByRole("button", {
			name: /Save & Continue/i,
		});
		await userEvent.click(saveStep1Btn);

		// Assert Step 1 mutation was called
		expect(mockMutate).toHaveBeenCalledWith(
			expect.objectContaining({
				yearName: expect.any(String),
				gradingSystem: "PERCENTAGE",
			}),
		);

		// Wait for Step 2 to be rendered
		// ==========================================
		// STEP 2: Classes, Sections & Subjects Setup
		// ==========================================
		expect(await screen.findByRole("heading", { name: "Classes & Sections", level: 1 })).toBeInTheDocument();
		expect(await screen.findByText("Default School Subjects")).toBeInTheDocument();

		// Verify default pre-selected subjects are present as checked
		const mathCheckbox = (await screen.findByLabelText(
			"Mathematics",
		)) as HTMLInputElement;
		const scienceCheckbox = (await screen.findByLabelText(
			"Science",
		)) as HTMLInputElement;
		const physicalEdCheckbox = (await screen.findByLabelText(
			"Physical Education",
		)) as HTMLInputElement;

		expect(mathCheckbox.checked).toBe(true);
		expect(scienceCheckbox.checked).toBe(true);
		expect(physicalEdCheckbox.checked).toBe(false);

		// Toggle a checkbox
		await userEvent.click(physicalEdCheckbox);
		expect(physicalEdCheckbox.checked).toBe(true);

		// Submit Step 2
		const saveStep2Btn = screen.getByRole("button", {
			name: /Save & Continue/i,
		});
		await userEvent.click(saveStep2Btn);

		// Assert Step 2 mutation payload
		expect(mockMutate).toHaveBeenLastCalledWith(
			expect.objectContaining({
				grades: expect.any(Array),
				defaultSubjects: expect.arrayContaining([
					"Mathematics",
					"Science",
					"English",
					"Social Studies",
					"Physical Education",
				]),
			}),
		);

		// Wait for Step 3 to be rendered
		// ==========================================
		// STEP 3: Staff Invitations
		// ==========================================
		expect(await screen.findByText("Invite Staff Members")).toBeInTheDocument();

		// Verify skip behavior completes onboarding with empty emails list
		const skipBtn = await screen.findByRole("button", {
			name: /Skip & Finish/i,
		});
		await userEvent.click(skipBtn);

		expect(mockMutate).toHaveBeenLastCalledWith({
			emails: [],
		});

		// Wait for completion callback
		await waitFor(() => {
			expect(onCompleteMock).toHaveBeenCalledTimes(1);
		});
	});
});

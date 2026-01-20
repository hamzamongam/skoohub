import { beforeEach, describe, expect, it, vi } from "vitest";

describe("authRouter", () => {
	beforeEach(() => {
		vi.resetModules();
		vi.clearAllMocks();
	});

	it("should call authService.login in the login handler", async () => {
		const mockLogin = vi.fn();
		vi.doMock("../services/auth.service", () => ({
			AuthService: vi.fn().mockImplementation(() => ({
				login: mockLogin,
			})),
		}));

		const { authRouter } = await import("./auth.router");

		const input = { email: "test@example.com", password: "password123" };
		const mockResp = { user: { id: "1" }, session: { id: "s1" } };
		mockLogin.mockResolvedValue({
			success: true,
			data: mockResp,
		} as any);

		const result = await authRouter.login["~orpc"].handler({
			input,
			context: {},
		} as any);

		expect(mockLogin).toHaveBeenCalledWith(input);
		expect(result).toEqual({
			success: true,
			data: mockResp,
		});
	});

	it("should call authService.signUp in the signUp handler", async () => {
		const mockSignUp = vi.fn();
		vi.doMock("../services/auth.service", () => ({
			AuthService: vi.fn().mockImplementation(() => ({
				signUp: mockSignUp,
			})),
		}));

		const { authRouter } = await import("./auth.router");

		const input = {
			email: "new@test.com",
			name: "New User",
			password: "password123",
		};
		const mockUser = { id: "user-1", name: input.name, email: input.email };
		mockSignUp.mockResolvedValue({
			success: true,
			data: mockUser,
		} as any);

		const result = await authRouter.signUp["~orpc"].handler({
			input,
			context: {},
		} as any);

		expect(mockSignUp).toHaveBeenCalledWith(input);
		expect(result).toEqual({
			success: true,
			data: mockUser,
		});
	});

	it("should call authService.createSchoolProfile in the createSchoolProfile handler", async () => {
		const mockCreateProfile = vi.fn();
		vi.doMock("../services/auth.service", () => ({
			AuthService: vi.fn().mockImplementation(() => ({
				createSchoolProfile: mockCreateProfile,
			})),
		}));

		const { authRouter } = await import("./auth.router");

		const userId = "user-1";
		const input = { schoolName: "Test School", logo: "logo.png" };
		const mockResp = { school: { id: "s1" } }; // Removed success: true from inner object as it's part of wrapper now
		mockCreateProfile.mockResolvedValue({
			success: true,
			data: mockResp,
		} as any);

		const result = await authRouter.createSchoolProfile["~orpc"].handler({
			input,
			context: { user: { id: userId } },
		} as any);

		expect(mockCreateProfile).toHaveBeenCalledWith(userId, input);
		expect(result).toEqual({
			success: true,
			data: mockResp,
		});
	});

	it("should call authService.me in the me handler", async () => {
		const mockMe = vi.fn();
		vi.doMock("../services/auth.service", () => ({
			AuthService: vi.fn().mockImplementation(() => ({
				me: mockMe,
			})),
		}));

		const { authRouter } = await import("./auth.router");

		const headers = new Headers();
		const mockResp = { user: { id: "1" }, session: { id: "s1" } };
		mockMe.mockResolvedValue({
			success: true,
			data: mockResp,
		} as any);

		const result = await authRouter.me["~orpc"].handler({
			input: undefined,
			context: { headers },
		} as any);

		expect(mockMe).toHaveBeenCalledWith(headers);
		expect(result).toEqual({
			success: true,
			data: mockResp,
		});
	});
});

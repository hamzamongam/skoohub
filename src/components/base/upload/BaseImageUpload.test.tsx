// @vitest-environment jsdom
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { uploadStudentImage } from "@/feature/upload/upload.server";
import { BaseImageUpload } from "./BaseImageUpload";

// Mock the server action
vi.mock("@/feature/upload/upload.server", () => ({
	uploadStudentImage: vi.fn(),
}));

// Mock URL.createObjectURL and revokeObjectURL
global.URL.createObjectURL = vi.fn(() => "blob:http://localhost/mock-url");
global.URL.revokeObjectURL = vi.fn();

describe("BaseImageUpload", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("renders empty state correctly", () => {
		render(<BaseImageUpload />);
		expect(screen.getByText("Click to upload image")).toBeInTheDocument();
		expect(screen.getByText(/SVG, PNG, JPG or GIF/)).toBeInTheDocument();
	});

	it("renders with initial value (string)", () => {
		render(<BaseImageUpload value="https://example.com/image.jpg" />);
		const img = screen.getByAltText("Profile preview");
		expect(img).toBeInTheDocument();
		expect(img).toHaveAttribute("src", "https://example.com/image.jpg");
	});

	it("handles manual upload mode (no server call)", async () => {
		const onChange = vi.fn();
		const { container } = render(
			<BaseImageUpload manualUpload onChange={onChange} />,
		);

		const file = new File(["dummy content"], "test.png", { type: "image/png" });
		const input = container.querySelector(
			'input[type="file"]',
		) as HTMLInputElement;
		expect(input).toBeInTheDocument();

		if (input) {
			await userEvent.upload(input, file);
		}

		expect(global.URL.createObjectURL).toHaveBeenCalledWith(file);
		expect(onChange).toHaveBeenCalledWith(file);
		expect(screen.getByAltText("Profile preview")).toBeInTheDocument();
	});

	it("handles server upload (default mode)", async () => {
		const onChange = vi.fn();
		(uploadStudentImage as any).mockResolvedValue({
			url: "https://server.com/uploaded.png",
		});

		const { container } = render(<BaseImageUpload onChange={onChange} />);

		const file = new File(["dummy content"], "test.png", { type: "image/png" });
		const input = container.querySelector(
			'input[type="file"]',
		) as HTMLInputElement;

		if (input) {
			await userEvent.upload(input, file);
		}

		expect(uploadStudentImage).toHaveBeenCalled();

		await waitFor(() => {
			expect(onChange).toHaveBeenCalledWith("https://server.com/uploaded.png");
		});

		expect(screen.getByAltText("Profile preview")).toHaveAttribute(
			"src",
			"https://server.com/uploaded.png",
		);
	});

	it("validates file type", async () => {
		const { container } = render(<BaseImageUpload />);
		const file = new File(["content"], "test.txt", { type: "text/plain" });
		const input = container.querySelector(
			'input[type="file"]',
		) as HTMLInputElement;

		if (input) {
			// Bypass userEvent checks for accept attribute to test the component's validation logic
			fireEvent.change(input, { target: { files: [file] } });
		}

		// Wait for potential async state update if any
		await waitFor(() => {
			expect(
				screen.getByText("Only image files are allowed."),
			).toBeInTheDocument();
		});
		expect(uploadStudentImage).not.toHaveBeenCalled();
	});

	it("removes image", async () => {
		const onChange = vi.fn();
		render(
			<BaseImageUpload
				value="https://example.com/image.jpg"
				onChange={onChange}
			/>,
		);

		const removeBtn = screen.getByRole("button");
		await userEvent.click(removeBtn);
		expect(onChange).toHaveBeenCalledWith(null);
		expect(screen.queryByAltText("Profile preview")).not.toBeInTheDocument();
	});
});

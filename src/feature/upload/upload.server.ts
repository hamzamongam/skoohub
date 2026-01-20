import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { createServerFn } from "@tanstack/react-start";
import { zodValidator } from "@tanstack/zod-adapter";
import { z } from "zod";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export const uploadStudentImage = createServerFn({ method: "POST" })
	.inputValidator(zodValidator(z.instanceof(FormData)))
	.handler(async ({ data: formData }) => {
		const file = formData.get("file") as File | null;

		if (!file) {
			throw new Error("No file received");
		}

		if (!ALLOWED_TYPES.includes(file.type)) {
			throw new Error("Invalid file type. Only images are allowed.");
		}

		if (file.size > MAX_FILE_SIZE) {
			throw new Error("File size exceeds 5MB limit.");
		}

		// Create directory if it doesn't exist
		// Path: public/uploads/temp
		const uploadDir = join(process.cwd(), "public", "uploads", "temp");
		await mkdir(uploadDir, { recursive: true });

		const buffer = await file.arrayBuffer();
		const timestamp = Date.now();
		// Sanitize filename
		const safeName = file.name.replace(/[^a-z0-9.]/gi, "_").toLowerCase();
		const fileName = `${timestamp}-${safeName}`;
		const filePath = join(uploadDir, fileName);

		await writeFile(filePath, Buffer.from(buffer));

		// Return public URL (temp)
		return { url: `/uploads/temp/${fileName}` };
	});

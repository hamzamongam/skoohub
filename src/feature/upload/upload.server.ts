import { PutObjectCommand } from "@aws-sdk/client-s3";
import { createServerFn } from "@tanstack/react-start";
import { zodValidator } from "@tanstack/zod-adapter";
import { z } from "zod";
import { R2_BUCKET_NAME, R2_PUBLIC_URL, r2 } from "@/server/r2";

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

		const buffer = await file.arrayBuffer();
		const timestamp = Date.now();
		const safeName = file.name.replace(/[^a-z0-9.]/gi, "_").toLowerCase();
		const fileName = `${timestamp}-${safeName}`;
		const key = `uploads/${fileName}`;

		try {
			await r2.send(
				new PutObjectCommand({
					Bucket: R2_BUCKET_NAME,
					Key: key,
					Body: Buffer.from(buffer),
					ContentType: file.type,
				}),
			);

			return { url: `${R2_PUBLIC_URL}/${key}` };
		} catch (error) {
			console.error("R2 Upload Error:", error);
			throw new Error("Failed to upload image to storage.");
		}
	});

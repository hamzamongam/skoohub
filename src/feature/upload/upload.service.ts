import {
	DeleteObjectCommand,
	PutObjectCommand,
	S3Client,
} from "@aws-sdk/client-s3";

export class UploadService {
	private r2 = new S3Client({
		region: "auto",
		endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
		credentials: {
			accessKeyId: process.env.R2_ACCESS_KEY_ID || "",
			secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || "",
		},
	});

	async createUploadUrl({
		file,
		folder,
	}: {
		file: File;
		folder: "students" | "teachers";
	}) {
		const timestamp = Date.now();
		const safeName = file.name.replace(/[^a-z0-9.]/gi, "_").toLowerCase();
		const fileName = `${timestamp}-${safeName}`;
		const key = `${folder}/${fileName}`;
		const buffer = await file.arrayBuffer();

		try {
			await this.r2.send(
				new PutObjectCommand({
					Bucket: process.env.R2_BUCKET_NAME!,
					Key: key,
					Body: Buffer.from(buffer),
					ContentType: file.type,
				}),
			);

			return { url: `${process.env.R2_PUBLIC_URL}/${key}`, key };
		} catch (error) {
			console.error("R2 Upload Error:", error);
			throw new Error("Failed to upload image to storage.");
		}
	}

	async deleteImage(key: string) {
		try {
			await this.r2.send(
				new DeleteObjectCommand({
					Bucket: process.env.R2_BUCKET_NAME!,
					Key: key,
				}),
			);
		} catch (error) {
			console.error("R2 Delete Error:", error);
			// We likely don't want to throw here to avoid blocking the main operation,
			// or at least we should log it effectively.
			// Throwing might be okay if we want to ensure consistency, but often image deletion is best-effort.
			throw new Error("Failed to delete image from storage.");
		}
	}
}

import { rename, stat } from "node:fs/promises";
import { basename, join } from "node:path";

/**
 * Moves a temporary uploaded file to the permanent students directory.
 * @param tempUrl The URL of the temporary file (e.g., /uploads/temp/file.jpg)
 * @returns The new permanent URL (e.g., /uploads/students/file.jpg)
 */
export async function moveTempImageToPermanent(
	tempUrl: string,
): Promise<string> {
	// If it's not a temp url, return as is (could be already permanent or external)
	if (!tempUrl.startsWith("/uploads/temp/")) {
		return tempUrl;
	}

	const fileName = basename(tempUrl);
	const tempPath = join(process.cwd(), "public", "uploads", "temp", fileName);
	const targetDir = join(process.cwd(), "public", "uploads", "students");
	const targetPath = join(targetDir, fileName);

	try {
		// Check if file exists
		await stat(tempPath);

		// Move file
		await rename(tempPath, targetPath);

		return `/uploads/students/${fileName}`;
	} catch (error) {
		console.error(`Failed to move temp image: ${error}`);
		// If move fails (e.g. file not found), return the original URL
		// or throw error depending on strictness. Returning original for now.
		return tempUrl;
	}
}

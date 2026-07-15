import { logger } from "@/lib/logger";

/**
 * Mock Email Service
 * Logs emails to the console for development.
 * Replace with Resend/SendGrid in production.
 */

interface EmailOptions {
	to: string;
	subject: string;
	html: string;
	text?: string;
}

export const sendEmail = async (options: EmailOptions) => {
	const apiKey = process.env.RESEND_API_KEY;
	const fromEmail = process.env.RESEND_FROM || "SkooHub <onboarding@resend.dev>";

	if (apiKey) {
		logger.info(
			{
				to: options.to,
				subject: options.subject,
			},
			"📧 Sending email via Resend API",
		);

		try {
			const response = await fetch("https://api.resend.com/emails", {
				method: "POST",
				headers: {
					Authorization: `Bearer ${apiKey}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					from: fromEmail,
					to: [options.to],
					subject: options.subject,
					html: options.html,
					text: options.text,
				}),
			});

			if (!response.ok) {
				const errorData = await response.json().catch(() => ({}));
				logger.error(
					{ errorData, status: response.status },
					"❌ Failed to send email via Resend API",
				);
				throw new Error(
					errorData?.message || `Resend API returned status ${response.status}`,
				);
			}

			const data = await response.json();
			logger.info({ id: data.id }, "📧 Email sent successfully via Resend API");
			return { success: true, id: data.id };
		} catch (error) {
			logger.error({ error }, "❌ Error sending email via Resend API");
			throw error;
		}
	}

	logger.info(
		{
			to: options.to,
			subject: options.subject,
		},
		"📧 [Mock Email Service] Sending Email (RESEND_API_KEY is not set)",
	);

	// Log the "Magic Link" or content clearly for the developer
	console.log("\n================ [ MOCK EMAIL ] ================");
	console.log(`To: ${options.to}`);
	console.log(`Subject: ${options.subject}`);
	console.log("------------------------------------------------");
	console.log(options.text || "No text content");
	if (options.html.includes("href=")) {
		// Extract link for convenience?
		const match = options.html.match(/href="([^"]+)"/);
		if (match) {
			console.log("🔗 LINK:", match[1]);
		}
	}
	console.log("================================================\n");

	return { success: true };
};

export const sendInvitationEmail = async (
	email: string,
	url: string,
	name?: string,
) => {
	const subject = "Welcome to SkooHub - Set your password";
	const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Welcome ${name || "Student"},</h2>
      <p>Your account has been created.</p>
      <p>Please click the link below to verify your account and set your password:</p>
      <a href="${url}" style="display: inline-block; padding: 12px 24px; background-color: #0070f3; color: white; text-decoration: none; border-radius: 5px;">Set Password</a>
      <p>Or copy this link: ${url}</p>
    </div>
  `;
	const text = `Welcome ${name || "Student"},\n\nPlease visit the following link to set your password:\n${url}`;

	return sendEmail({ to: email, subject, html, text });
};

export const sendResetPasswordEmail = async (
	email: string,
	url: string,
	name?: string,
) => {
	const subject = "Reset your password - SkooHub";
	const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Hello ${name || "User"},</h2>
      <p>We received a request to reset your password.</p>
      <p>Click the link below to choose a new password:</p>
      <a href="${url}" style="display: inline-block; padding: 12px 24px; background-color: #0070f3; color: white; text-decoration: none; border-radius: 5px;">Reset Password</a>
      <p>Or copy this link: ${url}</p>
      <p>If you did not request a password reset, you can safely ignore this email.</p>
    </div>
  `;
	const text = `Hello ${name || "User"},\n\nWe received a request to reset your password.\nPlease visit the following link to choose a new password:\n${url}\n\nIf you did not request a password reset, you can safely ignore this email.`;

	return sendEmail({ to: email, subject, html, text });
};

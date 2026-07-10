import nodemailer from "nodemailer";

/**
 * Email delivery layer — Nodemailer + Gmail SMTP.
 *
 * Sends mail through YOUR Gmail account using an App Password (Google
 * requires App Passwords for SMTP; your normal password won't work).
 *
 * Setup (one time):
 *   1. Turn on 2-Step Verification: https://myaccount.google.com/security
 *   2. Create an App Password: https://myaccount.google.com/apppasswords
 *      (pick "Mail" + your device name → copy the 16-char password)
 *   3. Add to .env:
 *        GMAIL_USER=shobhithbj@gmail.com
 *        GMAIL_APP_PASSWORD=xxxx xxxx xxxx xxxx
 *   4. Restart the dev server.
 *
 * The message lands in your inbox (you send to yourself), with
 * reply-to set to the visitor so you can answer them directly.
 *
 * If the Gmail creds aren't set, falls back to logging the message to
 * the server console so the form never crashes.
 */

export interface ContactPayload {
  name: string;
  email: string;
  message: string;
}

export interface SendResult {
  ok: boolean;
  provider: "gmail" | "console";
  id?: string;
  error?: string;
}

/** Inbox that receives the contact messages (you). */
const OWNER_EMAIL = process.env.OWNER_EMAIL || "shobhithbj@gmail.com";

export async function sendContactEmail(
  payload: ContactPayload
): Promise<SendResult> {
  const { name, email, message } = payload;

  const gmailUser = process.env.GMAIL_USER;
  const gmailPass = process.env.GMAIL_APP_PASSWORD;

  // --- Gmail SMTP ------------------------------------------------------
  if (gmailUser && gmailPass) {
    try {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: gmailUser,
          pass: gmailPass,
        },
      });

      const info = await transporter.sendMail({
        // From your own Gmail (so it lands in your inbox / sent mail)
        from: `Portfolio Contact <${gmailUser}>`,
        to: OWNER_EMAIL,
        replyTo: `${name} <${email}>`,
        subject: `New portfolio message from ${name}`,
        text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
        html: `
          <div style="font-family: -apple-system, sans-serif; max-width: 560px; margin: 0 auto; padding: 24px;">
            <h2 style="margin: 0 0 16px; color: #1a1a1a;">New message from your portfolio</h2>
            <p style="margin: 0 0 8px;"><strong>Name:</strong> ${escapeHtml(name)}</p>
            <p style="margin: 0 0 8px;"><strong>Email:</strong> <a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></p>
            <hr style="border: 0; border-top: 1px solid #e5e5e5; margin: 16px 0;" />
            <p style="white-space: pre-wrap; line-height: 1.6; color: #333;">${escapeHtml(message)}</p>
          </div>
        `,
      });

      return { ok: true, provider: "gmail", id: info.messageId };
    } catch (err) {
      return {
        ok: false,
        provider: "gmail",
        error: err instanceof Error ? err.message : "Gmail SMTP request failed",
      };
    }
  }

  // --- Dev fallback — log to console ------------------------------------
  console.log("\n========== NEW CONTACT MESSAGE ==========");
  console.log(`Name:    ${name}`);
  console.log(`Email:   ${email}`);
  console.log(`Message: ${message}`);
  console.log("==========================================\n");
  return { ok: true, provider: "console" };
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

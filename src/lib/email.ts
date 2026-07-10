import { Resend } from "resend";

/**
 * Email delivery layer.
 *
 * Strategy:
 *  1. If RESEND_API_KEY is set → send via Resend (best DX, 3,000/mo free).
 *  2. Else if WEB3FORMS_ACCESS_KEY is set → send via Web3Forms (free,
 *     no signup needed for the access key you paste in).
 *  3. Else → log to server console (dev fallback so nothing crashes).
 *
 * The email lands in your inbox (shobhithbj@gmail.com by default) with
 * the visitor's name, email, and message — plus a reply-to so you can
 * answer them directly.
 */

export interface ContactPayload {
  name: string;
  email: string;
  message: string;
}

export interface SendResult {
  ok: boolean;
  provider: "resend" | "web3forms" | "console";
  id?: string;
  error?: string;
}

/** Inbox that receives the contact messages (you). */
const OWNER_EMAIL = process.env.OWNER_EMAIL || "shobhithbj@gmail.com";

export async function sendContactEmail(
  payload: ContactPayload
): Promise<SendResult> {
  const { name, email, message } = payload;

  // --- 1. Resend (preferred) -------------------------------------------
  if (process.env.RESEND_API_KEY) {
    try {
      const resend = new Resend(process.env.RESEND_API_KEY);
      const { data, error } = await resend.emails.send({
        // "onboarding@resend.dev" is Resend's shared testing sender —
        // replace with your verified domain once you add one.
        from: process.env.RESEND_FROM || "Portfolio <onboarding@resend.dev>",
        to: [OWNER_EMAIL],
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
      if (error) {
        return { ok: false, provider: "resend", error: error.message };
      }
      return { ok: true, provider: "resend", id: data?.id };
    } catch (err) {
      return {
        ok: false,
        provider: "resend",
        error: err instanceof Error ? err.message : "Resend request failed",
      };
    }
  }

  // --- 2. Web3Forms (free fallback) ------------------------------------
  if (process.env.WEB3FORMS_ACCESS_KEY) {
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: process.env.WEB3FORMS_ACCESS_KEY,
          subject: `New portfolio message from ${name}`,
          from_name: "Portfolio Contact",
          replyto: email,
          name,
          email,
          message,
        }),
      });
      const data = await res.json();
      if (!data.success) {
        return { ok: false, provider: "web3forms", error: data.message };
      }
      return { ok: true, provider: "web3forms", id: String(data.message_id ?? "") };
    } catch (err) {
      return {
        ok: false,
        provider: "web3forms",
        error: err instanceof Error ? err.message : "Web3Forms request failed",
      };
    }
  }

  // --- 3. Dev fallback — log to console --------------------------------
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

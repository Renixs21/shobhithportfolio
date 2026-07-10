import { NextResponse } from "next/server";
import { z } from "zod";
import { sendContactEmail } from "@/lib/email";

const schema = z.object({
  name: z.string().min(2, "Name is too short").max(80),
  email: z.string().email("Enter a valid email"),
  message: z.string().min(10, "Tell me a little more").max(2000),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, errors: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { name, email, message } = parsed.data;

    // Deliver the message to the owner's inbox. The provider is chosen
    // automatically based on which env vars are set (see lib/email.ts).
    const result = await sendContactEmail({ name, email, message });

    if (!result.ok) {
      return NextResponse.json(
        {
          ok: false,
          error: "Could not deliver message right now. Please try again.",
          provider: result.provider,
          detail: result.error,
        },
        { status: 502 }
      );
    }

    const id = `tx-${Date.now().toString(36)}-${Math.random()
      .toString(36)
      .slice(2, 7)}`;

    return NextResponse.json({
      ok: true,
      id,
      provider: result.provider,
      receivedAt: new Date().toISOString(),
      echo: { name, email, preview: message.slice(0, 80) },
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Malformed request" },
      { status: 400 }
    );
  }
}

import { NextResponse } from "next/server";
import { z } from "zod";

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

    // In a production deployment this would persist to a database or
    // forward to an inbox / notification service. Here we acknowledge.
    const { name, email, message } = parsed.data;
    const id = `tx-${Date.now().toString(36)}-${Math.random()
      .toString(36)
      .slice(2, 7)}`;

    return NextResponse.json({
      ok: true,
      id,
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

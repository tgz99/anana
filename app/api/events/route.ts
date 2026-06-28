import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { name, source, sessionId, referrer } = await req.json();
    if (!name || !sessionId) {
      return NextResponse.json({ error: "missing fields" }, { status: 400 });
    }
    await prisma.event.create({
      data: {
        name,
        source: source ?? null,
        sessionId,
        referrer: referrer ?? null,
        ua: req.headers.get("user-agent") ?? null,
      },
    });
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (err) {
    console.error("[events]", err);
    return NextResponse.json({ error: "internal error" }, { status: 500 });
  }
}

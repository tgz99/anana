import { NextResponse } from "next/server";

const PIN = "000000";
const COOKIE = "vt_auth";

export async function POST(req: Request) {
  const { pin } = await req.json();

  if (pin !== PIN) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE, "granted", {
    httpOnly: true,
    sameSite: "strict",
    maxAge: 60 * 60 * 8, // 8 hours
    path: "/",
  });
  return res;
}

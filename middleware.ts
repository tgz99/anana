import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const COOKIE = "vt_auth";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Unlock page and API routes pass through freely
  if (pathname === "/viewtraffic/unlock" || pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/viewtraffic")) {
    const auth = request.cookies.get(COOKIE)?.value;
    if (auth !== "granted") {
      const url = request.nextUrl.clone();
      url.pathname = "/viewtraffic/unlock";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/viewtraffic/:path*"],
};

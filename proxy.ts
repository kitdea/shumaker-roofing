import { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  const host = request.headers.get("host");

  if (host === "www.shumakerroofing.com") {
    const url = request.nextUrl.clone();
    url.host = "shumakerroofing.com";
    return NextResponse.redirect(url, { status: 301 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/((?!_next|favicon.ico).*)",
};

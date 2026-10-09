import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const APEX_HOST = "hemloc.co";

export function proxy(request: NextRequest) {
  const hostHeader = request.headers.get("host") ?? "";
  const hostname = hostHeader.split(":")[0]?.toLowerCase() ?? "";

  if (hostname === `www.${APEX_HOST}`) {
    const url = request.nextUrl.clone();
    url.protocol = "https:";
    url.host = APEX_HOST;
    return NextResponse.redirect(url, 308);
  }

  const response = NextResponse.next();
  if (hostname === APEX_HOST) {
    response.headers.set(
      "Strict-Transport-Security",
      "max-age=31536000; includeSubDomains",
    );
  }
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"],
};

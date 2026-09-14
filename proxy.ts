import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { searchParams, pathname } = request.nextUrl;
  const code = searchParams.get("code");

  // Only forward to /auth/callback if it has not already been processed by the callback route
  if (
    code &&
    !pathname.startsWith("/auth/callback") &&
    !searchParams.has("fallback")
  ) {
    const callbackUrl = new URL("/auth/callback", request.url);
    callbackUrl.searchParams.set("code", code);

    // Sanitize 'next' parameter to prevent Open Redirects
    const rawNext = searchParams.get("next");
    let safeNext = "/auth";
    if (
      rawNext &&
      rawNext.startsWith("/") &&
      !rawNext.startsWith("//") &&
      !rawNext.startsWith("/\\")
    ) {
      safeNext = rawNext;
    } else if (pathname !== "/") {
      safeNext = pathname;
    }
    callbackUrl.searchParams.set("next", safeNext);

    return NextResponse.redirect(callbackUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, icon.svg
     */
    "/((?!_next/static|_next/image|favicon.ico|icon.svg).*)",
  ],
};

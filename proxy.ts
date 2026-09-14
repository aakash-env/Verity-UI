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

    // Preserve any 'next' parameter if specified, or use the current pathname
    const next = searchParams.get("next");
    if (next) {
      callbackUrl.searchParams.set("next", next);
    } else if (pathname !== "/") {
      callbackUrl.searchParams.set("next", pathname);
    }

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

import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

const ALLOWED_HOSTS = new Set([
  "localhost:3000",
  "127.0.0.1:3000",
  "verity-ui-blocks.vercel.app",
]);

/**
 * Validates and sanitizes the post-login destination URL to prevent Open Redirects.
 * Only relative single-slash paths on the same origin are allowed.
 */
function getSafeNextPath(rawNext: string | null): string {
  if (!rawNext) return "/auth";
  if (
    rawNext.startsWith("/") &&
    !rawNext.startsWith("//") &&
    !rawNext.startsWith("/\\")
  ) {
    try {
      const dummyUrl = new URL(rawNext, "http://localhost");
      return dummyUrl.pathname + dummyUrl.search + dummyUrl.hash;
    } catch {
      return "/auth";
    }
  }
  return "/auth";
}

/**
 * Validates the origin against an approved host allowlist to prevent Host Header Poisoning.
 */
function getSafeRedirectOrigin(request: Request, fallbackOrigin: string): string {
  const forwardedHost = request.headers.get("x-forwarded-host");
  if (!forwardedHost) return fallbackOrigin;

  const isAllowed =
    ALLOWED_HOSTS.has(forwardedHost) ||
    forwardedHost.endsWith(".vercel.app") ||
    forwardedHost.endsWith(".amplifyapp.com");

  if (isAllowed) {
    const forwardedProto = request.headers.get("x-forwarded-proto") || "https";
    return `${forwardedProto}://${forwardedHost}`;
  }

  return fallbackOrigin;
}

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");
  const errorDescription = searchParams.get("error_description");

  const safeOrigin = getSafeRedirectOrigin(request, origin);
  const safeNext = getSafeNextPath(searchParams.get("next"));

  if (error || errorDescription) {
    console.error("Supabase auth redirect error:", error, errorDescription);
    return NextResponse.redirect(
      `${safeOrigin}/?auth_error=${encodeURIComponent(
        errorDescription || error || "auth_failed"
      )}`
    );
  }

  if (code) {
    const supabaseUrl =
      process.env.NEXT_PUBLIC_SUPABASE_URL || "https://bgomwhwwkcebsdjndyrj.supabase.co";
    const supabaseAnonKey =
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
      "sb_publishable_poRoEipUmIxUmAzE3CIO9w_V5Bdhe1b";

    const redirectUrl = `${safeOrigin}${safeNext}`;
    const cookieStore = await cookies();
    const response = NextResponse.redirect(redirectUrl);

    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(
          cookiesToSet: Array<{
            name: string;
            value: string;
            options?: Parameters<Awaited<ReturnType<typeof cookies>>["set"]>[2];
          }>
        ) {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
            response.cookies.set(name, value, options);
          });
        },
      },
    });

    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
    if (!exchangeError) {
      return response;
    } else {
      console.error("Auth callback exchange error:", exchangeError);
      const fallbackUrl = new URL(redirectUrl);
      fallbackUrl.searchParams.set("code", code);
      fallbackUrl.searchParams.set("fallback", "1");
      return NextResponse.redirect(fallbackUrl.toString());
    }
  }

  return NextResponse.redirect(`${safeOrigin}/?auth_error=true`);
}

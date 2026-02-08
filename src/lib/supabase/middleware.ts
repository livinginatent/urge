import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // IMPORTANT: Do not write any logic between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make your app
  // very slow.

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Handle auth code on root URL - redirect to auth callback
  // This happens when Supabase password reset or email confirmation lands on /
  const code = request.nextUrl.searchParams.get("code");
  if (request.nextUrl.pathname === "/" && code) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth/callback";
    // Preserve the code parameter
    return NextResponse.redirect(url);
  }

  // Redirect authenticated users away from auth pages
  // Respect the `redirect` query param if present (e.g., /login?redirect=/subscribe)
  if (
    user &&
    (request.nextUrl.pathname.startsWith("/login") ||
      request.nextUrl.pathname.startsWith("/register") ||
      request.nextUrl.pathname.startsWith("/verify-email"))
  ) {
    const redirectTo = request.nextUrl.searchParams.get("redirect");
    const url = request.nextUrl.clone();
    url.pathname = redirectTo || "/dashboard";
    url.search = ""; // Clear query params (including the redirect param itself)
    return NextResponse.redirect(url);
  }

  // Redirect unauthenticated users from protected routes
  // Public routes that don't require auth (middleware passes through):
  // - / (landing page)
  // - /login, /register, /forgot-password, /reset-password, /verify-email (auth pages)
  // - /auth/* (OAuth callbacks)
  // - /api/* (API routes including webhooks)
  // - /checkout/* (payment routes)
  // - /subscribe (handles its own auth check via requireAuth)
  // - /blog (blog listing and individual posts)
  if (
    !user &&
    !request.nextUrl.pathname.startsWith("/login") &&
    !request.nextUrl.pathname.startsWith("/register") &&
    !request.nextUrl.pathname.startsWith("/forgot-password") &&
    !request.nextUrl.pathname.startsWith("/reset-password") &&
    !request.nextUrl.pathname.startsWith("/verify-email") &&
    !request.nextUrl.pathname.startsWith("/auth") &&
    !request.nextUrl.pathname.startsWith("/api") &&
    !request.nextUrl.pathname.startsWith("/checkout") &&
    !request.nextUrl.pathname.startsWith("/subscribe") &&
    !request.nextUrl.pathname.startsWith("/terms") &&
    !request.nextUrl.pathname.startsWith("/privacy") &&
    !request.nextUrl.pathname.startsWith("/contact") &&
    !request.nextUrl.pathname.startsWith("/blog") &&
    request.nextUrl.pathname !== "/"
  ) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    // Preserve the original destination so we can return after login/register
    url.searchParams.set(
      "redirect",
      `${request.nextUrl.pathname}${request.nextUrl.search}`,
    );
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

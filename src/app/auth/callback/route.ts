import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";
  const type = searchParams.get("type"); // Supabase sends type=recovery for password reset

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error) {
      const forwardedHost = request.headers.get("x-forwarded-host");
      const isLocalEnv = process.env.NODE_ENV === "development";
      
      // Determine redirect destination
      // If type=recovery or next=/reset-password, go to reset password page
      // Also check if the session was created via recovery (password reset)
      let redirectPath = next;
      if (type === "recovery" || next === "/reset-password") {
        redirectPath = "/reset-password";
      }
      
      // Build the redirect URL
      const getRedirectUrl = (base: string) => `${base}${redirectPath}`;
      
      if (isLocalEnv) {
        return NextResponse.redirect(getRedirectUrl(origin));
      } else if (forwardedHost) {
        return NextResponse.redirect(getRedirectUrl(`https://${forwardedHost}`));
      } else {
        return NextResponse.redirect(getRedirectUrl(origin));
      }
    }
  }

  // Return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/login?error=Could not authenticate user`);
}

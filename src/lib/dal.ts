import "server-only";

import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

/**
 * Data Access Layer (DAL) for authentication
 * Following Next.js best practices: https://nextjs.org/docs/app/guides/authentication
 * 
 * Use this to verify sessions in:
 * - Server Components
 * - Server Actions
 * - Route Handlers
 * 
 * DO NOT use in layouts for auth checks (they don't re-render on navigation)
 */

export const verifySession = cache(async () => {
  const supabase = await createClient();
  
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  return {
    isAuth: true,
    userId: user.id,
    email: user.email,
  };
});

export const getUser = cache(async () => {
  const session = await verifySession();
  
  if (!session) {
    return null;
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  return user;
});

/**
 * Require authentication - redirects to login if not authenticated
 * Use this at the top of protected pages/actions
 */
export async function requireAuth() {
  const session = await verifySession();
  
  if (!session) {
    redirect("/login");
  }
  
  return session;
}

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

/**
 * Client-side auth handler that detects password recovery events
 * and redirects to the reset-password page.
 * 
 * This is needed because Supabase puts recovery info in the URL hash
 * which can't be read server-side.
 */
export function AuthHandler() {
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();

    // Check URL hash for recovery type (Supabase puts type=recovery in hash)
    const hash = window.location.hash;
    if (hash.includes("type=recovery") || hash.includes("type=signup")) {
      // Let Supabase handle the hash, then redirect
      supabase.auth.onAuthStateChange((event, session) => {
        if (event === "PASSWORD_RECOVERY") {
          router.push("/reset-password");
        } else if (event === "SIGNED_IN" && hash.includes("type=recovery")) {
          // Fallback: if we detected recovery in hash but event is SIGNED_IN
          router.push("/reset-password");
        }
      });
    }

    // Also listen for PASSWORD_RECOVERY event in case it fires
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        router.push("/reset-password");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  return null;
}

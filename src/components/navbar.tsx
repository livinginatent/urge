import Link from "next/link";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { LogoutButton } from "@/components/logout-button";

export async function NavBar() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-[#27272a] bg-[#050505]/95 backdrop-blur">
      <div className="max-w-5xl mx-auto flex items-center justify-between px-6 py-4">
        <Link href="/" className="text-white font-bold text-sm tracking-[0.3em] uppercase hover:text-[#E11D48] transition-colors">
          URGE
        </Link>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Button
                variant="ghost"
                size="sm"
                className="border-2 border-[#27272a] rounded-none px-4 text-xs tracking-[0.25em]"
                asChild
              >
                <Link href="/dashboard">DASHBOARD</Link>
              </Button>
              <LogoutButton />
            </>
          ) : (
            <>
              <Button
                variant="ghost"
                size="sm"
                className="border-2 border-[#27272a] rounded-none px-4 text-xs tracking-[0.25em]"
                asChild
              >
                <Link href="/login">LOGIN</Link>
              </Button>
              <Button
                variant="commitment"
                size="sm"
                className="rounded-none px-5 text-xs tracking-[0.25em]"
                asChild
              >
                <Link href="/register">REGISTER</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

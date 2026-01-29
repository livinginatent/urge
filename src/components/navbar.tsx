import Link from "next/link";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { LogoutButton } from "@/components/logout-button";

export async function NavBar() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-[#27272a] bg-[#050505]/95 backdrop-blur w-full overflow-x-hidden">
      <div className="max-w-5xl mx-auto flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between px-4 sm:px-6 py-3 sm:py-4 w-full">
        <Link
          href="/"
          className="text-white font-bold text-xs sm:text-sm tracking-[0.3em] uppercase hover:text-[#E11D48] transition-colors"
        >
          URGE
        </Link>

        <div className="flex items-center gap-2 sm:gap-3 self-start sm:self-auto">
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
              <Button
                variant="ghost"
                size="sm"
                className="border-2 border-[#27272a] rounded-none px-3 text-xs tracking-[0.25em]"
                asChild
              >
                <Link href="/dashboard/settings">⚙</Link>
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

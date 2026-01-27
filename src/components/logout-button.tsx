"use client";

import { logout } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";

export function LogoutButton() {
  return (
    <form action={logout}>
      <Button
        type="submit"
        variant="destructive"
        size="sm"
        className="rounded-none px-5 text-xs tracking-[0.25em]"
      >
        LOGOUT
      </Button>
    </form>
  );
}

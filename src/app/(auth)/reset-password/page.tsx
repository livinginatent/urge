"use client";

import { useActionState } from "react";
import Link from "next/link";
import { resetPassword } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { PasswordInput } from "@/components/ui/password-input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

export default function ResetPasswordPage() {
  const [state, action, pending] = useActionState(resetPassword, undefined);

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12 bg-[#050505]">
      <Card className="max-w-md w-full">
        <CardHeader>
          <CardTitle className="text-3xl text-center">
            <span className="text-[#E11D48]">NEW</span> PASSWORD
          </CardTitle>
          <CardDescription className="text-center">
            Enter your new password below.
          </CardDescription>
        </CardHeader>

        <form action={action}>
          <CardContent className="space-y-6">
            {/* Success message */}
            {state?.success && (
              <div className="p-3 border-2 border-green-500 bg-green-500/10 text-green-500 text-sm font-mono">
                Password updated successfully! You can now log in.
              </div>
            )}

            {/* Error message */}
            {state?.message && !state?.success && (
              <div className="p-3 border-2 border-[#E11D48] bg-[#E11D48]/10 text-[#E11D48] text-sm font-mono">
                {state.message}
              </div>
            )}

            {!state?.success && (
              <>
                {/* Password */}
                <div className="space-y-2">
                  <label
                    htmlFor="password"
                    className="text-[#a1a1aa] text-xs uppercase tracking-widest"
                  >
                    New Password
                  </label>
                  <PasswordInput
                    id="password"
                    name="password"
                    autoComplete="new-password"
                    placeholder="Min. 8 characters"
                  />
                  {state?.errors?.password && (
                    <div className="text-[#E11D48] text-xs font-mono space-y-1">
                      {state.errors.password.map((error) => (
                        <p key={error}>• {error}</p>
                      ))}
                    </div>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                  <label
                    htmlFor="confirmPassword"
                    className="text-[#a1a1aa] text-xs uppercase tracking-widest"
                  >
                    Confirm Password
                  </label>
                  <PasswordInput
                    id="confirmPassword"
                    name="confirmPassword"
                    autoComplete="new-password"
                    placeholder="Confirm your password"
                  />
                  {state?.errors?.confirmPassword && (
                    <p className="text-[#E11D48] text-xs font-mono">
                      {state.errors.confirmPassword[0]}
                    </p>
                  )}
                </div>
              </>
            )}
          </CardContent>

          <CardFooter className="flex-col gap-4">
            {!state?.success ? (
              <Button
                type="submit"
                variant="commitment"
                size="xl"
                className="w-full"
                disabled={pending}
              >
                {pending ? "UPDATING..." : "UPDATE PASSWORD"}
              </Button>
            ) : (
              <Button
                type="button"
                variant="commitment"
                size="xl"
                className="w-full"
                asChild
              >
                <Link href="/login">LOG IN</Link>
              </Button>
            )}
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

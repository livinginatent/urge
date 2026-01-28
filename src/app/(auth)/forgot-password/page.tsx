"use client";

import { useActionState } from "react";
import Link from "next/link";
import { forgotPassword } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

export default function ForgotPasswordPage() {
  const [state, action, pending] = useActionState(forgotPassword, undefined);

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12 bg-[#050505]">
      <Card className="max-w-md w-full">
        <CardHeader>
          <CardTitle className="text-3xl text-center">
            <span className="text-[#E11D48]">RESET</span> PASSWORD
          </CardTitle>
          <CardDescription className="text-center">
            Enter your email and we&apos;ll send you a reset link.
          </CardDescription>
        </CardHeader>

        <form action={action}>
          <CardContent className="space-y-6">
            {/* Success message */}
            {state?.success && (
              <div className="p-3 border-2 border-green-500 bg-green-500/10 text-green-500 text-sm font-mono">
                Check your email for a password reset link.
              </div>
            )}

            {/* Error message */}
            {state?.message && !state?.success && (
              <div className="p-3 border-2 border-[#E11D48] bg-[#E11D48]/10 text-[#E11D48] text-sm font-mono">
                {state.message}
              </div>
            )}

            {/* Email */}
            {!state?.success && (
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="text-[#a1a1aa] text-xs uppercase tracking-widest"
                >
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  className="w-full h-12 px-4 bg-[#0a0a0a] border-2 border-[#27272a] text-white font-mono placeholder:text-[#52525b] focus:border-[#E11D48] focus:outline-none transition-colors"
                />
                {state?.errors?.email && (
                  <p className="text-[#E11D48] text-xs font-mono">
                    {state.errors.email[0]}
                  </p>
                )}
              </div>
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
                {pending ? "SENDING..." : "SEND RESET LINK"}
              </Button>
            ) : (
              <Button
                type="button"
                variant="outline"
                size="xl"
                className="w-full"
                asChild
              >
                <Link href="/login">BACK TO LOGIN</Link>
              </Button>
            )}

            <p className="text-[#52525b] text-xs text-center">
              Remember your password?{" "}
              <Link href="/login" className="text-[#E11D48] hover:underline">
                Log in
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

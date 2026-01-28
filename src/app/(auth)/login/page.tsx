"use client";

import { Suspense, useActionState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { login } from "@/app/actions/auth";
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

function LoginForm() {
  const [state, action, pending] = useActionState(login, undefined);
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") ?? "";

  return (
    <Card className="max-w-md w-full">
      <CardHeader>
        <CardTitle className="text-3xl text-center">
          <span className="text-[#E11D48]">LOG</span> IN
        </CardTitle>
        <CardDescription className="text-center">
          Welcome back. Time to stay accountable.
        </CardDescription>
      </CardHeader>

      <form action={action}>
        <input type="hidden" name="redirect" value={redirectTo} />
        <CardContent className="space-y-6">
          {/* Error message */}
          {state?.message && (
            <div className="p-3 border-2 border-[#E11D48] bg-[#E11D48]/10 text-[#E11D48] text-sm font-mono">
              {state.message}
            </div>
          )}

          {/* Email */}
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

          {/* Password */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="text-[#a1a1aa] text-xs uppercase tracking-widest"
              >
                Password
              </label>
              <Link
                href="/forgot-password"
                className="text-[#52525b] text-xs hover:text-[#E11D48] transition-colors"
              >
                Forgot password?
              </Link>
            </div>
            <PasswordInput
              id="password"
              name="password"
              autoComplete="current-password"
              placeholder="••••••••"
            />
            {state?.errors?.password && (
              <p className="text-[#E11D48] text-xs font-mono">
                {state.errors.password[0]}
              </p>
            )}
          </div>
        </CardContent>

        <CardFooter className="flex-col gap-4">
          <Button
            type="submit"
            variant="commitment"
            size="xl"
            className="w-full"
            disabled={pending}
          >
            {pending ? "LOGGING IN..." : "LOG IN"}
          </Button>

          <p className="text-[#52525b] text-xs text-center">
            Don&apos;t have an account?{" "}
            <Link
              href={redirectTo ? `/register?redirect=${encodeURIComponent(redirectTo)}` : "/register"}
              className="text-[#E11D48] hover:underline"
            >
              Register
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12 bg-[#050505]">
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    </div>
  );
}

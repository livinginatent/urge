"use client";

import { Suspense, useActionState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { register } from "@/app/actions/auth";
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

function RegisterForm() {
  const [state, action, pending] = useActionState(register, undefined);
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") ?? "";
  const router = useRouter();

  // Handle redirect on successful registration
  useEffect(() => {
    if (state?.success && state?.redirectTo) {
      router.push(state.redirectTo);
    }
  }, [state, router]);

  return (
    <Card className="max-w-md w-full">
      <CardHeader>
        <CardTitle className="text-3xl text-center">
          <span className="text-[#E11D48]">MAKE</span> THE COMMITMENT
        </CardTitle>
        <CardDescription className="text-center">
          $2/month. That&apos;s the cost of discipline.
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

          {/* Username */}
          <div className="space-y-2">
            <label
              htmlFor="username"
              className="text-[#a1a1aa] text-xs uppercase tracking-widest"
            >
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              placeholder="your_username"
              className="w-full h-12 px-4 bg-[#0a0a0a] border-2 border-[#27272a] text-white font-mono placeholder:text-[#52525b] focus:border-[#E11D48] focus:outline-none transition-colors"
            />
            {state?.errors?.username && (
              <p className="text-[#E11D48] text-xs font-mono">
                {state.errors.username[0]}
              </p>
            )}
          </div>

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
            <label
              htmlFor="password"
              className="text-[#a1a1aa] text-xs uppercase tracking-widest"
            >
              Password
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
        </CardContent>

        <CardFooter className="flex-col gap-4">
          <Button
            type="submit"
            variant="commitment"
            size="xl"
            className="w-full"
            disabled={pending}
          >
            {pending ? "CREATING ACCOUNT..." : "START NOW"}
          </Button>

          <p className="text-[#52525b] text-xs text-center">
            Already have an account?{" "}
            <Link
              href={redirectTo ? `/login?redirect=${encodeURIComponent(redirectTo)}` : "/login"}
              className="text-[#E11D48] hover:underline"
            >
              Log in
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12 bg-[#050505]">
      <Suspense fallback={null}>
        <RegisterForm />
      </Suspense>
    </div>
  );
}

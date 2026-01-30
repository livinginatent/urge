"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  return (
    <Card className="max-w-md w-full">
      <CardHeader>
        <CardTitle className="text-3xl text-center">
          CHECK YOUR <span className="text-[#E11D48]">EMAIL</span>
        </CardTitle>
        <CardDescription className="text-center">
          We&apos;ve sent you a verification link
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="space-y-4">
          <p className="text-[#a1a1aa] text-sm font-mono text-center">
            We&apos;ve sent a verification email to:
          </p>
          {email && (
            <p className="text-white text-sm font-mono text-center border-2 border-[#27272a] p-3 bg-[#0a0a0a]">
              {email}
            </p>
          )}
          <p className="text-[#a1a1aa] text-sm font-mono text-center">
            Click the link in the email to verify your account and complete your registration.
          </p>
        </div>

        <div className="border-2 border-[#27272a] p-4 bg-[#0a0a0a] space-y-2">
          <p className="text-[#52525b] text-xs font-mono uppercase tracking-widest">
            Didn&apos;t receive the email?
          </p>
          <ul className="text-[#a1a1aa] text-xs font-mono space-y-1 list-disc list-inside">
            <li>Check your spam folder</li>
            <li>Make sure you entered the correct email address</li>
            <li>Wait a few minutes and try again</li>
          </ul>
        </div>
      </CardContent>

      <CardFooter className="flex-col gap-4">
        <Link
          href="/login"
          className="text-[#E11D48] hover:underline text-sm font-mono"
        >
          Back to login
        </Link>
      </CardFooter>
    </Card>
  );
}

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12 bg-[#050505]">
      <Suspense fallback={null}>
        <VerifyEmailContent />
      </Suspense>
    </div>
  );
}

"use client";

import * as React from "react";
import { useActionState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { PasswordInput } from "@/components/ui/password-input";
import { changePassword, deleteAccount } from "@/app/actions/auth";
import type { ChangePasswordFormState, DeleteAccountFormState } from "@/lib/definitions";

type SettingsContentProps = {
  customerPortalUrl: string | null;
  hasSubscription: boolean;
};

export function SettingsContent({ customerPortalUrl, hasSubscription }: SettingsContentProps) {
  const [passwordState, passwordAction, passwordPending] = useActionState<
    ChangePasswordFormState,
    FormData
  >(changePassword, undefined);

  const [deleteState, deleteAction, deletePending] = useActionState<
    DeleteAccountFormState,
    FormData
  >(deleteAccount, undefined);

  const [showDeleteConfirm, setShowDeleteConfirm] = React.useState(false);

  return (
    <div className="min-h-screen bg-[#050505] pt-24 pb-12 px-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/dashboard"
            className="text-[#52525b] text-xs tracking-[0.2em] uppercase hover:text-white transition-colors mb-4 inline-block"
          >
            ← BACK TO DASHBOARD
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
            Settings
          </h1>
          <p className="text-[#52525b] mt-2">Manage your account.</p>
        </div>

        {/* Change Password */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-xl">Change Password</CardTitle>
            <CardDescription>Update your account password.</CardDescription>
          </CardHeader>
          <form action={passwordAction}>
            <CardContent className="space-y-4">
              {passwordState?.success && (
                <div className="p-3 border-2 border-green-600 bg-green-600/10 text-green-500 text-sm">
                  {passwordState.message}
                </div>
              )}
              {passwordState?.message && !passwordState?.success && (
                <div className="p-3 border-2 border-[#E11D48] bg-[#E11D48]/10 text-[#E11D48] text-sm">
                  {passwordState.message}
                </div>
              )}

              <div className="space-y-1">
                <label
                  htmlFor="currentPassword"
                  className="block text-[10px] tracking-[0.25em] text-[#52525b] uppercase"
                >
                  Current Password
                </label>
                <PasswordInput
                  id="currentPassword"
                  name="currentPassword"
                  required
                  className="w-full bg-[#050505] border-2 border-[#27272a] text-sm text-[#a1a1aa] px-3 py-2 focus:outline-none focus:border-[#E11D48] font-mono"
                />
                {passwordState?.errors?.currentPassword && (
                  <p className="text-[#E11D48] text-xs mt-1">
                    {passwordState.errors.currentPassword[0]}
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <label
                  htmlFor="newPassword"
                  className="block text-[10px] tracking-[0.25em] text-[#52525b] uppercase"
                >
                  New Password
                </label>
                <PasswordInput
                  id="newPassword"
                  name="newPassword"
                  required
                  className="w-full bg-[#050505] border-2 border-[#27272a] text-sm text-[#a1a1aa] px-3 py-2 focus:outline-none focus:border-[#E11D48] font-mono"
                />
                {passwordState?.errors?.newPassword && (
                  <p className="text-[#E11D48] text-xs mt-1">
                    {passwordState.errors.newPassword[0]}
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <label
                  htmlFor="confirmPassword"
                  className="block text-[10px] tracking-[0.25em] text-[#52525b] uppercase"
                >
                  Confirm New Password
                </label>
                <PasswordInput
                  id="confirmPassword"
                  name="confirmPassword"
                  required
                  className="w-full bg-[#050505] border-2 border-[#27272a] text-sm text-[#a1a1aa] px-3 py-2 focus:outline-none focus:border-[#E11D48] font-mono"
                />
                {passwordState?.errors?.confirmPassword && (
                  <p className="text-[#E11D48] text-xs mt-1">
                    {passwordState.errors.confirmPassword[0]}
                  </p>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button
                type="submit"
                variant="default"
                disabled={passwordPending}
              >
                {passwordPending ? "UPDATING..." : "UPDATE PASSWORD"}
              </Button>
            </CardFooter>
          </form>
        </Card>

        {/* Manage Subscription */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-xl">Subscription</CardTitle>
            <CardDescription>
              Manage your subscription, update payment method, or cancel.
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-3">
            {customerPortalUrl ? (
              <Button variant="outline" asChild>
                <a href={customerPortalUrl}>MANAGE SUBSCRIPTION</a>
              </Button>
            ) : hasSubscription ? (
              <div className="space-y-2">
                <p className="text-[#a1a1aa] text-sm">
                  Your subscription is active, but the customer portal is temporarily unavailable.
                </p>
                <p className="text-[#52525b] text-xs">
                  To manage your subscription, contact{" "}
                  <a
                    href="mailto:support@urges.app"
                    className="text-[#E11D48] hover:underline"
                  >
                    support@urges.app
                  </a>
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-[#52525b] text-sm">No active subscription.</p>
                <Button variant="commitment" asChild>
                  <Link href="/subscribe">START FREE TRIAL</Link>
                </Button>
              </div>
            )}
          </CardFooter>
        </Card>

        {/* Delete Account */}
        <Card className="border-[#E11D48]">
          <CardHeader>
            <CardTitle className="text-xl text-[#E11D48]">Danger Zone</CardTitle>
            <CardDescription>
              Permanently delete your account and all associated data. This
              action cannot be undone.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!showDeleteConfirm ? (
              <Button
                type="button"
                variant="destructive"
                onClick={() => setShowDeleteConfirm(true)}
              >
                DELETE MY ACCOUNT
              </Button>
            ) : (
              <form action={deleteAction} className="space-y-4">
                {deleteState?.message && (
                  <div className="p-3 border-2 border-[#E11D48] bg-[#E11D48]/10 text-[#E11D48] text-sm">
                    {deleteState.message}
                  </div>
                )}

                <div className="p-4 border-2 border-[#E11D48] bg-[#E11D48]/5">
                  <p className="text-sm text-[#a1a1aa] mb-4">
                    This will permanently delete:
                  </p>
                  <ul className="text-sm text-[#52525b] space-y-1 mb-4">
                    <li>• Your account</li>
                    <li>• All your streak data</li>
                    <li>• All relapse history</li>
                    <li>• All urge logs</li>
                  </ul>
                  <p className="text-sm text-white font-semibold">
                    Type &quot;DELETE&quot; to confirm:
                  </p>
                </div>

                <div className="space-y-1">
                  <input
                    type="text"
                    name="confirmation"
                    placeholder="DELETE"
                    className="w-full bg-[#050505] border-2 border-[#E11D48] text-sm text-[#a1a1aa] px-3 py-2 focus:outline-none font-mono"
                  />
                  {deleteState?.errors?.confirmation && (
                    <p className="text-[#E11D48] text-xs mt-1">
                      {deleteState.errors.confirmation[0]}
                    </p>
                  )}
                </div>

                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowDeleteConfirm(false)}
                  >
                    CANCEL
                  </Button>
                  <Button
                    type="submit"
                    variant="destructive"
                    disabled={deletePending}
                  >
                    {deletePending ? "DELETING..." : "PERMANENTLY DELETE"}
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

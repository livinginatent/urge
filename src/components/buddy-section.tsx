"use client";

import { useState, useTransition } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BuddyProgressCard } from "@/components/buddy-progress-card";
import { inviteBuddy, removeBuddy, type BuddyProgress, type SentBuddyInvite } from "@/app/actions/buddy";

interface BuddySectionProps {
  buddies: BuddyProgress[];
  pendingInvites: SentBuddyInvite[];
  maxBuddies?: number;
}

export function BuddySection({
  buddies,
  pendingInvites,
  maxBuddies = 2,
}: BuddySectionProps) {
  const [isPending, startTransition] = useTransition();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const totalBuddySlots = buddies.length + pendingInvites.length;
  const canAddMore = totalBuddySlots < maxBuddies;

  const handleInvite = (formData: FormData) => {
    setError(null);
    setSuccess(null);

    startTransition(async () => {
      const result = await inviteBuddy(formData);
      if (result.success) {
        setSuccess(result.message || "Invite sent!");
        setEmail("");
      } else {
        setError(result.error || "Failed to send invite");
      }
    });
  };

  const handleCancelInvite = (inviteId: string) => {
    startTransition(async () => {
      await removeBuddy(inviteId);
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span>Accountability Buddies</span>
          <span className="text-sm font-normal text-[#52525b]">
            ({buddies.length}/{maxBuddies})
          </span>
        </CardTitle>
        <CardDescription>
          Track progress together. Their journey is visible to you, and yours to them.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Buddy Progress Cards */}
        {buddies.length > 0 && (
          <div className="grid gap-4 md:grid-cols-2">
            {buddies.map((buddy) => (
              <BuddyProgressCard key={buddy.id} buddy={buddy} />
            ))}
          </div>
        )}

        {/* Pending Invites */}
        {pendingInvites.length > 0 && (
          <div className="space-y-2">
            <p className="text-[#52525b] text-xs uppercase tracking-widest">
              Pending Invites
            </p>
            <div className="space-y-2">
              {pendingInvites.map((invite) => (
                <div
                  key={invite.id}
                  className="flex items-center justify-between p-3 border-2 border-[#27272a] bg-[#0a0a0a]"
                >
                  <div>
                    <p className="text-[#a1a1aa] text-sm font-mono">
                      {invite.inviteeEmail}
                    </p>
                    <p className="text-[#52525b] text-xs">Waiting for response...</p>
                  </div>
                  <button
                    onClick={() => handleCancelInvite(invite.id)}
                    disabled={isPending}
                    className="text-[#52525b] hover:text-[#E11D48] text-xs uppercase tracking-widest transition-colors disabled:opacity-50"
                  >
                    CANCEL
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Add Buddy Form */}
        {canAddMore ? (
          <div className="space-y-3">
            <p className="text-[#52525b] text-xs uppercase tracking-widest">
              Add a Buddy
            </p>
            <form action={handleInvite} className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter buddy's email"
                required
                className="flex-1 px-4 py-3 bg-[#0a0a0a] border-2 border-[#27272a] text-white placeholder:text-[#52525b] font-mono text-sm focus:border-[#E11D48] focus:outline-none transition-colors"
              />
              <Button
                type="submit"
                variant="outline"
                disabled={isPending || !email}
                className="whitespace-nowrap"
              >
                {isPending ? "SENDING..." : "SEND INVITE"}
              </Button>
            </form>

            {error && (
              <p className="text-[#E11D48] text-sm font-mono">{error}</p>
            )}
            {success && (
              <p className="text-green-500 text-sm font-mono">{success}</p>
            )}

            <p className="text-[#52525b] text-xs">
              Your buddy will need to accept the invite from their settings page.
            </p>
          </div>
        ) : (
          <div className="p-4 border-2 border-[#27272a] bg-[#0a0a0a] text-center">
            <p className="text-[#52525b] text-sm">
              You&apos;ve reached the maximum of {maxBuddies} buddies.
            </p>
          </div>
        )}

        {/* Empty State */}
        {buddies.length === 0 && pendingInvites.length === 0 && (
          <div className="text-center py-4">
            <p className="text-[#52525b] text-sm mb-2">
              No accountability buddies yet.
            </p>
            <p className="text-[#52525b] text-xs">
              Add up to {maxBuddies} buddies to track each other&apos;s progress.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

"use client";

import { useTransition } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { acceptBuddyRequest, declineBuddyRequest, type PendingBuddyRequest } from "@/app/actions/buddy";

interface PendingBuddyRequestsProps {
  requests: PendingBuddyRequest[];
}

export function PendingBuddyRequests({ requests }: PendingBuddyRequestsProps) {
  const [isPending, startTransition] = useTransition();

  const handleAccept = (requestId: string) => {
    startTransition(async () => {
      await acceptBuddyRequest(requestId);
    });
  };

  const handleDecline = (requestId: string) => {
    startTransition(async () => {
      await declineBuddyRequest(requestId);
    });
  };

  if (requests.length === 0) {
    return null;
  }

  return (
    <Card className="mb-8 border-[#E11D48]">
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          Buddy Requests
          <span className="text-sm font-normal text-[#E11D48] bg-[#E11D48]/10 px-2 py-0.5 border border-[#E11D48]">
            {requests.length}
          </span>
        </CardTitle>
        <CardDescription>
          People who want you as their accountability buddy.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {requests.map((request) => (
          <div
            key={request.id}
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 border-2 border-[#27272a] bg-[#0a0a0a]"
          >
            <div>
              <p className="text-white font-mono">{request.inviterUsername}</p>
              <p className="text-[#52525b] text-xs">{request.inviterEmail}</p>
              <p className="text-[#52525b] text-xs mt-1">
                Sent {new Date(request.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleAccept(request.id)}
                disabled={isPending}
              >
                ACCEPT
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDecline(request.id)}
                disabled={isPending}
                className="text-[#52525b] hover:text-[#E11D48]"
              >
                DECLINE
              </Button>
            </div>
          </div>
        ))}
        <p className="text-[#52525b] text-xs">
          Accepting makes your progress visible to them, and theirs to you.
        </p>
      </CardContent>
    </Card>
  );
}

"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { removeBuddy, type BuddyProgress } from "@/app/actions/buddy";
import { useState, useTransition } from "react";

interface BuddyProgressCardProps {
  buddy: BuddyProgress;
}

export function BuddyProgressCard({ buddy }: BuddyProgressCardProps) {
  const [isPending, startTransition] = useTransition();
  const [showConfirm, setShowConfirm] = useState(false);

  const handleRemove = () => {
    startTransition(async () => {
      await removeBuddy(buddy.id);
      setShowConfirm(false);
    });
  };

  // Calculate streak display
  const formatStreak = (days: number) => {
    if (days === 0) return "0 days";
    if (days === 1) return "1 day";
    return `${days} days`;
  };

  return (
    <Card className="relative group">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg text-white font-mono">
            {buddy.username}
          </CardTitle>
          {!showConfirm ? (
            <button
              onClick={() => setShowConfirm(true)}
              className="text-[#52525b] hover:text-[#E11D48] text-xs uppercase tracking-widest transition-colors"
            >
              ✕
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={handleRemove}
                disabled={isPending}
                className="text-[#E11D48] hover:text-[#be123c] text-xs uppercase tracking-widest transition-colors disabled:opacity-50"
              >
                {isPending ? "..." : "REMOVE"}
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                className="text-[#52525b] hover:text-white text-xs uppercase tracking-widest transition-colors"
              >
                CANCEL
              </button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {/* Streak Display */}
        <div className="mb-4">
          <p className="text-[#52525b] text-xs uppercase tracking-widest mb-1">
            Current Streak
          </p>
          <p className="text-2xl font-bold text-[#E11D48]">
            {formatStreak(buddy.streakDays)}
          </p>
        </div>

        {/* Day History Circles */}
        <div>
          <p className="text-[#52525b] text-xs uppercase tracking-widest mb-2">
            Last 14 Days
          </p>
          <div className="flex flex-wrap gap-1.5">
            {buddy.dayHistory.map((clean, index) => (
              <div
                key={index}
                className={`w-4 h-4 border-2 ${
                  clean
                    ? "bg-white border-white"
                    : "bg-[#E11D48] border-[#E11D48]"
                }`}
                title={clean ? "Clean day" : "Relapse day"}
              />
            ))}
          </div>
          <div className="flex items-center gap-4 mt-2 text-[10px] text-[#52525b]">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-white border border-[#ffffff]" />
              <span>Clean</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-[#E11D48]" />
              <span>Relapse</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

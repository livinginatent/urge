"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";

const TRIGGER_OPTIONS = [
  "Stress",
  "Boredom",
  "Social Setting",
  "Loneliness",
  "Anxiety",
  "Habit/Routine",
  "Emotional Trigger",
  "Other",
] as const;

type RelapseFormProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { trigger?: string; feeling?: string }) => void;
};

export function RelapseForm({ isOpen, onClose, onSubmit }: RelapseFormProps) {
  const [trigger, setTrigger] = React.useState<string>("");
  const [customTrigger, setCustomTrigger] = React.useState<string>("");
  const [feeling, setFeeling] = React.useState<string>("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const showCustomTrigger = trigger === "Other";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const finalTrigger = showCustomTrigger && customTrigger.trim() 
      ? customTrigger.trim() 
      : trigger || undefined;

    onSubmit({
      trigger: finalTrigger,
      feeling: feeling.trim() || undefined,
    });
  };

  const handleClose = () => {
    setTrigger("");
    setCustomTrigger("");
    setFeeling("");
    setIsSubmitting(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#050505]/95 backdrop-blur-sm p-4">
      <Card className="max-w-md w-full border-2 border-[#E11D48]">
        <CardHeader>
          <CardTitle className="text-xl">Record Your Relapse</CardTitle>
          <p className="text-[#52525b] text-xs mt-2">
            Help yourself understand what happened. This is optional but valuable.
          </p>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label
                htmlFor="trigger"
                className="block text-[10px] tracking-[0.25em] text-[#52525b] uppercase"
              >
                What Triggered This?
              </label>
              <select
                id="trigger"
                value={trigger}
                onChange={(e) => setTrigger(e.target.value)}
                className="w-full bg-[#050505] border-2 border-[#27272a] text-sm text-[#a1a1aa] px-3 py-2 focus:outline-none focus:border-[#E11D48] font-mono"
              >
                <option value="">Select a trigger...</option>
                {TRIGGER_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>

              {showCustomTrigger && (
                <input
                  type="text"
                  value={customTrigger}
                  onChange={(e) => setCustomTrigger(e.target.value)}
                  placeholder="Describe the trigger..."
                  className="w-full bg-[#050505] border-2 border-[#27272a] text-sm text-[#a1a1aa] px-3 py-2 focus:outline-none focus:border-[#E11D48] font-mono mt-2"
                />
              )}
            </div>

            <div className="space-y-2">
              <label
                htmlFor="feeling"
                className="block text-[10px] tracking-[0.25em] text-[#52525b] uppercase"
              >
                How Do You Feel Now? <span className="text-[#52525b]">(Optional)</span>
              </label>
              <textarea
                id="feeling"
                value={feeling}
                onChange={(e) => {
                  if (e.target.value.length <= 200) {
                    setFeeling(e.target.value);
                  }
                }}
                rows={4}
                maxLength={200}
                placeholder="Be honest. This helps you learn..."
                className="w-full bg-[#050505] border-2 border-[#27272a] text-sm text-[#a1a1aa] px-3 py-2 focus:outline-none focus:border-[#E11D48] font-mono resize-none"
              />
              <p className="text-[10px] text-[#52525b] text-right">
                {feeling.length}/200
              </p>
            </div>
          </CardContent>

          <CardFooter className="flex gap-3 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              SKIP
            </Button>
            <Button
              type="submit"
              variant="destructive"
              disabled={isSubmitting}
            >
              {isSubmitting ? "RECORDING..." : "RECORD RELAPSE"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

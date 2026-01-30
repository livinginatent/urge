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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#050505]/95 backdrop-blur-sm p-3 sm:p-4 overflow-y-auto">
      <Card className="max-w-md w-full border-2 border-[#E11D48] my-auto max-h-[90vh] sm:max-h-none flex flex-col">
        <CardHeader className="flex-shrink-0">
          <CardTitle className="text-lg sm:text-xl">Record Your Relapse</CardTitle>
          <p className="text-[#52525b] text-xs mt-2">
            Help yourself understand what happened. This is optional but valuable.
          </p>
        </CardHeader>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
          <CardContent className="space-y-4 sm:space-y-5 flex-1 overflow-y-auto">
            <div className="space-y-2">
              <label
                htmlFor="trigger"
                className="block text-[10px] sm:text-xs tracking-[0.25em] text-[#52525b] uppercase"
              >
                What Triggered This?
              </label>
              <select
                id="trigger"
                value={trigger}
                onChange={(e) => setTrigger(e.target.value)}
                className="w-full bg-[#050505] border-2 border-[#27272a] text-sm sm:text-base text-[#a1a1aa] px-3 sm:px-4 py-2.5 sm:py-3 focus:outline-none focus:border-[#E11D48] font-mono min-h-[44px]"
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
                  className="w-full bg-[#050505] border-2 border-[#27272a] text-sm sm:text-base text-[#a1a1aa] px-3 sm:px-4 py-2.5 sm:py-3 focus:outline-none focus:border-[#E11D48] font-mono mt-2 min-h-[44px]"
                />
              )}
            </div>

            <div className="space-y-2">
              <label
                htmlFor="feeling"
                className="block text-[10px] sm:text-xs tracking-[0.25em] text-[#52525b] uppercase"
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
                className="w-full bg-[#050505] border-2 border-[#27272a] text-sm sm:text-base text-[#a1a1aa] px-3 sm:px-4 py-2.5 sm:py-3 focus:outline-none focus:border-[#E11D48] font-mono resize-none min-h-[100px]"
              />
              <p className="text-[10px] sm:text-xs text-[#52525b] text-right">
                {feeling.length}/200
              </p>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-end flex-shrink-0 pt-4 sm:pt-0">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
              className="w-full sm:w-auto min-h-[44px]"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="destructive"
              disabled={isSubmitting}
              className="w-full sm:w-auto min-h-[44px]"
            >
              {isSubmitting ? "RECORDING..." : "RECORD RELAPSE"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

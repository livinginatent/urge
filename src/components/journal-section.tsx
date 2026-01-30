"use client";

import * as React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { createJournal, deleteJournal } from "@/app/actions/journal";

type Journal = {
  id: string;
  content: string;
  createdAt: Date;
};

type JournalSectionProps = {
  initialJournals: Journal[];
  todayCount: number;
};

const MAX_JOURNALS_PER_DAY = 3;
const MAX_CONTENT_LENGTH = 500;

export function JournalSection({ initialJournals, todayCount }: JournalSectionProps) {
  const [journals, setJournals] = React.useState<Journal[]>(initialJournals);
  const [content, setContent] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [remainingToday, setRemainingToday] = React.useState(MAX_JOURNALS_PER_DAY - todayCount);
  const [deletingId, setDeletingId] = React.useState<string | null>(null);

  const canWrite = remainingToday > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || isSubmitting || !canWrite) return;

    setIsSubmitting(true);
    setError(null);

    const result = await createJournal(content);

    if (result.error) {
      setError(result.error);
      setIsSubmitting(false);
      return;
    }

    // Optimistically add to list
    const newJournal: Journal = {
      id: crypto.randomUUID(),
      content: content.trim(),
      createdAt: new Date(),
    };

    setJournals([newJournal, ...journals]);
    setContent("");
    setRemainingToday((prev) => prev - 1);
    setIsSubmitting(false);
  };

  const handleDelete = async (journalId: string) => {
    setDeletingId(journalId);
    
    const result = await deleteJournal(journalId);
    
    if (result.error) {
      setError(result.error);
      setDeletingId(null);
      return;
    }

    // Check if this journal was from today
    const journalToDelete = journals.find((j) => j.id === journalId);
    if (journalToDelete) {
      const journalDate = new Date(journalToDelete.createdAt);
      const today = new Date();
      const isToday =
        journalDate.getDate() === today.getDate() &&
        journalDate.getMonth() === today.getMonth() &&
        journalDate.getFullYear() === today.getFullYear();

      if (isToday) {
        setRemainingToday((prev) => prev + 1);
      }
    }

    setJournals(journals.filter((j) => j.id !== journalId));
    setDeletingId(null);
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString([], { 
      hour: "2-digit", 
      minute: "2-digit",
      hour12: true 
    });
  };

  const formatDate = (date: Date) => {
    const d = new Date(date);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (d.toDateString() === today.toDateString()) {
      return "Today";
    } else if (d.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    }
    return d.toLocaleDateString([], { month: "short", day: "numeric" });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <CardTitle>Daily Journal</CardTitle>
            <CardDescription>Reflect on your journey. Up to 3 entries per day.</CardDescription>
          </div>
          <div className="text-xs text-[#52525b] border border-[#27272a] px-2 py-1">
            {remainingToday}/{MAX_JOURNALS_PER_DAY} remaining today
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Write new entry */}
        {canWrite ? (
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="relative">
              <textarea
                value={content}
                onChange={(e) => {
                  if (e.target.value.length <= MAX_CONTENT_LENGTH) {
                    setContent(e.target.value);
                    setError(null);
                  }
                }}
                rows={4}
                maxLength={MAX_CONTENT_LENGTH}
                placeholder="What's on your mind? How are you feeling today?"
                className="w-full bg-[#050505] border-2 border-[#27272a] text-sm text-[#a1a1aa] px-4 py-3 focus:outline-none focus:border-[#E11D48] font-mono resize-none"
              />
              <span className="absolute bottom-2 right-2 text-[10px] text-[#52525b]">
                {content.length}/{MAX_CONTENT_LENGTH}
              </span>
            </div>

            {error && (
              <p className="text-[#E11D48] text-xs">{error}</p>
            )}

            <Button
              type="submit"
              variant="outline"
              disabled={!content.trim() || isSubmitting}
              className="w-full sm:w-auto"
            >
              {isSubmitting ? "SAVING..." : "SAVE ENTRY"}
            </Button>
          </form>
        ) : (
          <div className="text-center py-6 border-2 border-dashed border-[#27272a]">
            <p className="text-[#52525b] text-sm">
              You&apos;ve written all 3 journal entries for today.
            </p>
            <p className="text-[#52525b] text-xs mt-1">
              Come back tomorrow to write more.
            </p>
          </div>
        )}

        {/* Journal entries */}
        {journals.length > 0 && (
          <div className="space-y-4 pt-4 border-t border-[#27272a]">
            <h4 className="text-xs tracking-[0.25em] text-[#52525b] uppercase">
              Recent Entries
            </h4>
            <ul className="space-y-4">
              {journals.map((journal) => (
                <li
                  key={journal.id}
                  className="group py-3 border-b border-[#27272a] last:border-0"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <span className="w-2 h-2 bg-[#27272a] group-hover:bg-[#E11D48] transition-colors mt-1.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-[#a1a1aa] text-sm whitespace-pre-wrap break-words">
                          {journal.content}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-[#52525b] text-xs">
                            {formatDate(journal.createdAt)} at {formatTime(journal.createdAt)}
                          </span>
                          <button
                            onClick={() => handleDelete(journal.id)}
                            disabled={deletingId === journal.id}
                            className="text-[#52525b] hover:text-[#E11D48] text-xs opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50"
                          >
                            {deletingId === journal.id ? "deleting..." : "delete"}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {journals.length === 0 && canWrite && (
          <p className="text-[#52525b] text-sm text-center py-4">
            No journal entries yet. Start writing to track your thoughts.
          </p>
        )}
      </CardContent>
    </Card>
  );
}

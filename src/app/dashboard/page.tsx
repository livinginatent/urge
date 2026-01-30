import type { Relapse, Journal } from "@prisma/client";
import { requireAuth } from "@/lib/dal";
import { prisma } from "@/lib/prisma";
import { startStreak } from "@/app/actions/streak";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { UrgeCounter } from "@/components/urge-counter";
import { CircuitBreaker } from "@/components/CircuitBreaker";
import { RelapseButton } from "@/components/relapse-button";
import { JournalSection } from "@/components/journal-section";

export default async function DashboardPage() {
  // This will redirect to /login?redirect=/dashboard if not authenticated
  const session = await requireAuth("/dashboard");

  // Fetch user data including relapses and recent journals
  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    include: {
      streak: true,
      relapses: {
        orderBy: { createdAt: "desc" },
        take: 5,
      },
      journals: {
        orderBy: { createdAt: "desc" },
        take: 10,
      },
    },
  });

  const streak = user?.streak;
  const recentRelapses: Relapse[] = user?.relapses ?? [];
  const recentJournals: Journal[] = user?.journals ?? [];
  
  // Get total relapse count
  const totalRelapses = await prisma.relapse.count({
    where: { userId: session.userId },
  });

  // Get today's journal count for the limit
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);

  const todayJournalCount = await prisma.journal.count({
    where: {
      userId: session.userId,
      createdAt: {
        gte: todayStart,
        lte: todayEnd,
      },
    },
  });

  // Calculate streak seconds from startedAt (fallback to days if missing)
  const now = new Date();
  const streakSeconds = streak?.startedAt
    ? Math.max(0, Math.floor((now.getTime() - streak.startedAt.getTime()) / 1000))
    : streak?.currentStreak
      ? streak.currentStreak * 24 * 60 * 60
      : 0;

  // Keep currentStreak (days) in sync if startedAt exists
  if (streak?.startedAt) {
    const computedDays = Math.floor(streakSeconds / (24 * 60 * 60));
    if (computedDays !== streak.currentStreak) {
      await prisma.streak.update({
        where: { userId: session.userId },
        data: { currentStreak: computedDays },
      });
    }
  }

  // Subscription info (derived directly from user – avoid extra queries)
  const hasActiveSubscription =
    user?.isPaidUser ||
    user?.subscriptionStatus === "ACTIVE";

  return (
    <div className="min-h-screen bg-[#050505] pt-24 pb-12 px-6 overflow-x-hidden w-full">
      <div className="max-w-4xl mx-auto w-full">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-2">
            Welcome back, <span className="text-[#E11D48]">{user?.username || "Warrior"}</span>
          </h1>
          <p className="text-[#52525b]">Stay strong. Every moment counts.</p>
        </div>

        {/* Subscription Status Banner */}
        {hasActiveSubscription ? (
          <div className="mb-8 p-4 border-2 border-[#27272a] bg-[#0a0a0a]">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <p className="text-[#E11D48] font-bold text-sm uppercase tracking-widest">
                  SUBSCRIPTION ACTIVE
                </p>
              </div>
              {/* Future: Add manage subscription link */}
            </div>
          </div>
        ) : (
          <div className="mb-8 p-4 border-2 border-[#E11D48] bg-[#E11D48]/10">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <p className="text-[#E11D48] font-bold text-sm uppercase tracking-widest">
                  NO ACTIVE SUBSCRIPTION
                </p>
                <p className="text-[#a1a1aa] text-sm mt-1">
                  Subscribe to unlock all features
                </p>
              </div>
              <Button variant="commitment" size="lg" asChild>
                <a href="/subscribe">SUBSCRIBE</a>
              </Button>
            </div>
          </div>
        )}

        {/* Main Features - Blurred when no active subscription */}
        <div className="relative">
          {/* Blur overlay when no subscription */}
          {!hasActiveSubscription && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-[#050505]/80 backdrop-blur-sm">
              <div className="text-center p-8 border-2 border-[#E11D48] bg-[#0a0a0a] max-w-md mx-4">
                <p className="text-[#E11D48] font-bold text-lg uppercase tracking-widest mb-4">
                  SUBSCRIPTION REQUIRED
                </p>
                <p className="text-[#a1a1aa] text-sm mb-6">
                  Subscribe to unlock all features and track your progress
                </p>
                <Button variant="commitment" size="lg" asChild>
                  <a href="/subscribe">SUBSCRIBE</a>
                </Button>
              </div>
            </div>
          )}

          {/* Main Content - Blurred when no subscription */}
          <div className={!hasActiveSubscription ? "blur-sm pointer-events-none select-none" : ""}>
            {/* Main Counter */}
            <Card className="mb-8">
              <CardContent className="py-12">
                <UrgeCounter
                  key={streakSeconds}
                  startFrom={streakSeconds}
                  label={streakSeconds > 0 ? "CURRENT STREAK" : "START MY STREAK"}
                  autoStart={streakSeconds > 0 && hasActiveSubscription}
                  showDaysMonths
                  onStart={startStreak}
                />
              </CardContent>
            </Card>

            {/* Action Buttons */}
            {streakSeconds > 0 && (
              <div className="flex flex-wrap justify-center gap-4 mb-12">
                <RelapseButton />
              </div>
            )}

            {/* Stats Grid */}
            <div className="grid md:grid-cols-3 gap-4 mb-12">
              <Card>
                <CardHeader>
                  <CardDescription className="text-xs uppercase tracking-widest">
                    Current Streak
                  </CardDescription>
                  <CardTitle className="text-4xl text-[#E11D48]">
                    {streak?.currentStreak || 0} <span className="text-lg text-[#52525b]">days</span>
                  </CardTitle>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <CardDescription className="text-xs uppercase tracking-widest">
                    Longest Streak
                  </CardDescription>
                  <CardTitle className="text-4xl text-white">
                    {streak?.longestStreak || 0} <span className="text-lg text-[#52525b]">days</span>
                  </CardTitle>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <CardDescription className="text-xs uppercase tracking-widest">
                    Total Relapses
                  </CardDescription>
                  <CardTitle className="text-4xl text-white">
                    {totalRelapses} <span className="text-lg text-[#52525b]">times</span>
                  </CardTitle>
                </CardHeader>
              </Card>
            </div>

            {/* Help My Urge Button */}
           
        <CircuitBreaker noContent={false}/>

            {/* Daily Journal */}
            <div className="my-8">
              <JournalSection 
                initialJournals={recentJournals} 
                todayCount={todayJournalCount} 
              />
            </div>

            {/* Relapse History */}
            <Card>
              <CardHeader>
                <CardTitle>Relapse History</CardTitle>
                <CardDescription>Your journey back to strength</CardDescription>
              </CardHeader>
              <CardContent>
                {recentRelapses.length === 0 ? (
                  <p className="text-[#52525b] text-sm">No relapses yet. Keep your streak going!</p>
                ) : (
                  <ul className="space-y-4">
                    {recentRelapses.map((relapse) => {
                      const relapseWithDetails = relapse as Relapse & {
                        trigger?: string | null;
                        feeling?: string | null;
                      };
                      return (
                        <li
                          key={relapse.id}
                          className="py-3 border-b border-[#27272a] last:border-0"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex items-start gap-3 flex-1">
                              <span className="w-2 h-2 bg-[#E11D48] mt-1.5" />
                              <div className="flex-1 space-y-1">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="text-[#a1a1aa] text-sm">
                                    Lost {relapse.streakDays} day{relapse.streakDays !== 1 ? "s" : ""} streak
                                  </span>
                                  {relapseWithDetails.trigger && (
                                    <span className="text-[#52525b] text-xs border border-[#27272a] px-2 py-0.5">
                                      {relapseWithDetails.trigger}
                                    </span>
                                  )}
                                </div>
                                {relapseWithDetails.feeling && (
                                  <p className="text-[#52525b] text-xs italic">
                                    &quot;{relapseWithDetails.feeling}&quot;
                                  </p>
                                )}
                              </div>
                            </div>
                            <span className="text-[#52525b] text-xs whitespace-nowrap">
                              {new Date(relapse.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

import type { Relapse, Journal } from "@prisma/client";
import { requireAuth } from "@/lib/dal";
import { prisma } from "@/lib/prisma";
import { startStreak } from "@/app/actions/streak";
import { getBuddyProgressForUser, getSentBuddyInvitesForUser } from "@/app/actions/buddy";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { UrgeCounter } from "@/components/urge-counter";
import { CircuitBreaker } from "@/components/CircuitBreaker";
import { RelapseButton } from "@/components/relapse-button";
import { JournalSection } from "@/components/journal-section";
import { BuddySection } from "@/components/buddy-section";
import { InsightsSection } from "@/components/insights-section";

const MS_IN_DAY = 1000 * 60 * 60 * 24;

function startOfWeek(date: Date) {
  const adjusted = new Date(date);
  const day = adjusted.getDay();
  const diff = (day + 6) % 7;
  adjusted.setDate(adjusted.getDate() - diff);
  adjusted.setHours(0, 0, 0, 0);
  return adjusted;
}

function dateKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

export default async function DashboardPage() {
  // This will redirect to /login?redirect=/dashboard if not authenticated
  const session = await requireAuth("/dashboard");
  const userId = session.userId;

  // Calculate today's date boundaries once
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);

  const now = new Date();
  const insightsStart = new Date(now);
  insightsStart.setDate(insightsStart.getDate() - 90);
  insightsStart.setHours(0, 0, 0, 0);
  const journal30Start = new Date(now);
  journal30Start.setDate(journal30Start.getDate() - 30);
  journal30Start.setHours(0, 0, 0, 0);

  // Fetch all data in parallel to minimize DB round-trips
  const [
    user,
    totalRelapses,
    todayJournalCount,
    buddyProgress,
    sentBuddyInvites,
    allRelapses,
    allJournals,
  ] = await Promise.all([
    // User with related data
    prisma.user.findUnique({
      where: { id: userId },
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
    }),
    // Total relapse count
    prisma.relapse.count({
      where: { userId },
    }),
    // Today's journal count
    prisma.journal.count({
      where: {
        userId,
        createdAt: {
          gte: todayStart,
          lte: todayEnd,
        },
      },
    }),
    // Buddy progress (using optimized function that skips session check)
    getBuddyProgressForUser(userId),
    // Sent invites (using optimized function that skips session check)
    getSentBuddyInvitesForUser(userId),
    // All relapses for insights
    prisma.relapse.findMany({
      where: { userId },
      select: {
        createdAt: true,
        trigger: true,
        streakDays: true,
      },
      orderBy: { createdAt: "desc" },
    }),
    // All journals for insights
    prisma.journal.findMany({
      where: { userId },
      select: { createdAt: true },
    }),
  ]);

  const streak = user?.streak;
  const recentRelapses: Relapse[] = user?.relapses ?? [];
  const recentJournals: Journal[] = user?.journals ?? [];

  // Calculate streak seconds from startedAt (fallback to days if missing)
  const streakSeconds = streak?.startedAt
    ? Math.max(0, Math.floor((now.getTime() - streak.startedAt.getTime()) / 1000))
    : streak?.currentStreak
      ? streak.currentStreak * 24 * 60 * 60
      : 0;

  // Keep currentStreak (days) in sync if startedAt exists
  // Always update longestStreak if current streak exceeds it
  if (streak) {
    let currentDays: number;
    let needsUpdate = false;
    const updateData: { currentStreak?: number; longestStreak?: number } = {};

    if (streak.startedAt) {
      // Calculate calendar days (not 24-hour periods)
      // Set both dates to midnight to get accurate day count
      const startDate = new Date(streak.startedAt);
      startDate.setHours(0, 0, 0, 0);
      const todayDate = new Date(now);
      todayDate.setHours(0, 0, 0, 0);
      
      // Calculate difference in milliseconds, then convert to days
      const diffTime = todayDate.getTime() - startDate.getTime();
      currentDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      
      // Update currentStreak if it's out of sync
      if (currentDays !== streak.currentStreak) {
        updateData.currentStreak = currentDays;
        needsUpdate = true;
      }
    } else {
      // Use stored currentStreak value
      currentDays = streak.currentStreak ?? 0;
    }

    // Always check and update longestStreak if current streak exceeds it
    const currentLongestStreak = streak.longestStreak ?? 0;
    const newLongestStreak = Math.max(currentLongestStreak, currentDays);
    
    if (newLongestStreak !== currentLongestStreak) {
      updateData.longestStreak = newLongestStreak;
      needsUpdate = true;
    }

    // Only update if something changed
    if (needsUpdate) {
      await prisma.streak.update({
        where: { userId },
        data: updateData,
      });
      // Re-fetch streak to get updated values for display
      const updatedStreak = await prisma.streak.findUnique({
        where: { userId },
      });
      if (updatedStreak) {
        // Update the local reference so UI shows correct values
        Object.assign(streak, updatedStreak);
      }
    }
  }

  const relapsesForInsights = allRelapses.filter(
    (relapse) => relapse.createdAt >= insightsStart
  );
  const journalsForInsights = allJournals.filter(
    (journal) => journal.createdAt >= insightsStart
  );

  const timeBlocks = [
    { label: "0-3", start: 0, end: 3 },
    { label: "4-7", start: 4, end: 7 },
    { label: "8-11", start: 8, end: 11 },
    { label: "12-15", start: 12, end: 15 },
    { label: "16-19", start: 16, end: 19 },
    { label: "20-23", start: 20, end: 23 },
  ];

  const relapseByTimeBlock = timeBlocks.map((block) => ({
    label: block.label,
    count: relapsesForInsights.filter((relapse) => {
      const hour = relapse.createdAt.getHours();
      return hour >= block.start && hour <= block.end;
    }).length,
  }));

  const weeks = Array.from({ length: 8 }, (_, index) => {
    const weekStart = startOfWeek(new Date(now.getTime() - (7 - index) * 7 * MS_IN_DAY));
    return {
      key: dateKey(weekStart),
      label: weekStart.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      start: weekStart,
    };
  });

  const weeklyMap = new Map(
    weeks.map((week) => [week.key, { week: week.label, journals: 0, relapses: 0 }])
  );

  journalsForInsights.forEach((journal) => {
    const key = dateKey(startOfWeek(journal.createdAt));
    const entry = weeklyMap.get(key);
    if (entry) {
      entry.journals += 1;
    }
  });

  relapsesForInsights.forEach((relapse) => {
    const key = dateKey(startOfWeek(relapse.createdAt));
    const entry = weeklyMap.get(key);
    if (entry) {
      entry.relapses += 1;
    }
  });

  const weeklyActivity = weeks.map((week) => weeklyMap.get(week.key)!);

  const triggerCounts = Array.from(
    relapsesForInsights.reduce((map, relapse) => {
      const trigger = relapse.trigger?.trim() || "Unspecified";
      map.set(trigger, (map.get(trigger) ?? 0) + 1);
      return map;
    }, new Map<string, number>())
  )
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([trigger, count]) => ({ trigger, count }));

  const journalTimes = journalsForInsights
    .map((journal) => journal.createdAt.getTime())
    .sort((a, b) => a - b);

  const hasJournalInWindow = (start: number, end: number) => {
    let left = 0;
    let right = journalTimes.length - 1;
    let firstValid = -1;

    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      if (journalTimes[mid] >= start) {
        firstValid = mid;
        right = mid - 1;
      } else {
        left = mid + 1;
      }
    }

    if (firstValid === -1) {
      return false;
    }

    return journalTimes[firstValid] <= end;
  };

  const relapseWithJournal = relapsesForInsights.filter((relapse) =>
    hasJournalInWindow(relapse.createdAt.getTime() - MS_IN_DAY, relapse.createdAt.getTime())
  ).length;

  const relapseWithoutJournal = Math.max(0, relapsesForInsights.length - relapseWithJournal);

  const journalBeforeRelapse = [
    { label: "With Journal", value: relapseWithJournal },
    { label: "No Journal", value: relapseWithoutJournal },
  ];

  const journalDays30 = new Set(
    allJournals
      .filter((journal) => journal.createdAt >= journal30Start)
      .map((journal) => dateKey(journal.createdAt))
  ).size;

  const avgStreakBeforeRelapse =
    allRelapses.length > 0
      ? Math.round(
          allRelapses.reduce((sum, relapse) => sum + relapse.streakDays, 0) /
            allRelapses.length
        )
      : 0;

  const lastRelapseAt = allRelapses.length
    ? allRelapses.reduce(
        (latest, relapse) =>
          relapse.createdAt > latest ? relapse.createdAt : latest,
        allRelapses[0].createdAt
      )
    : null;

  const lastRelapseDaysAgo = lastRelapseAt
    ? Math.max(0, Math.floor((now.getTime() - lastRelapseAt.getTime()) / MS_IN_DAY))
    : null;

  const insightsStats = {
    avgStreakBeforeRelapse,
    journalDays30,
    relapseCount90: relapsesForInsights.length,
    lastRelapseDaysAgo,
  };

  // Subscription info (derived directly from user – avoid extra queries)
  const hasActiveSubscription =
    user?.isPaidUser ||
    user?.subscriptionStatus === "ACTIVE";

  // Feature gating based on subscription
  const maxBuddies = hasActiveSubscription ? 6 : 1;

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
                  CONSEQUENCE LAYER ACTIVE
                </p>
                <p className="text-[#a1a1aa] text-sm mt-1">
                  Insights, unlimited journals, and your full accountability network are on.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="mb-8 p-4 border-2 border-[#27272a] bg-[#0a0a0a]">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <p className="text-[#a1a1aa] font-bold text-sm uppercase tracking-widest">
                  FREE DISCIPLINE LAYER
                </p>
                <p className="text-[#52525b] text-sm mt-1">
                  Counter, override, 3 daily journals, and 1 accountability buddy are fully live.
                </p>
              </div>
              <Button variant="commitment" size="lg" asChild>
                <a href="/subscribe">ADD CONSEQUENCES ($2/mo)</a>
              </Button>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="relative">
          <div>
            {/* Main Counter */}
            <Card className="mb-8">
              <CardContent className="py-12">
                <UrgeCounter
                  key={streakSeconds}
                  startFrom={streakSeconds}
                  label={streakSeconds > 0 ? "CURRENT STREAK" : "START MY STREAK"}
                  autoStart={streakSeconds > 0}
                  showDaysMonths
                  onStart={startStreak}
                  showShareButton={streakSeconds > 0}
                />
              </CardContent>
            </Card>

            {/* Action Buttons */}
            {streakSeconds > 0 && (
              <div className="flex flex-wrap justify-center gap-4 mb-12">
                <RelapseButton />
              </div>
            )}

            {/* Accountability Buddies */}
            <div className="mb-12">
              <BuddySection
                buddies={buddyProgress}
                pendingInvites={sentBuddyInvites}
                maxBuddies={maxBuddies}
              />
            </div>

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

            {/* Insights – paid layer only */}
            {hasActiveSubscription ? (
              <InsightsSection
                stats={insightsStats}
                relapseByTimeBlock={relapseByTimeBlock}
                weeklyActivity={weeklyActivity}
                triggerCounts={triggerCounts}
                journalBeforeRelapse={journalBeforeRelapse}
              />
            ) : (
              <div className="mt-12">
                <div className="flex items-center justify-between flex-wrap gap-4 mb-4">
                  <div>
                    <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
                      INSIGHTS
                    </h2>
                    <p className="text-[#52525b] text-sm">
                      Advanced analytics unlock when you put $2/mo on the line.
                    </p>
                  </div>
                  <Button variant="commitment" size="sm" asChild>
                    <a href="/subscribe">UNLOCK INSIGHTS</a>
                  </Button>
                </div>
                <div className="border-2 border-dashed border-[#27272a] bg-[#050505] p-6 text-center">
                  <p className="text-[#a1a1aa] text-sm mb-2">
                    You&apos;re tracking the work. The data is waiting.
                  </p>
                  <p className="text-[#52525b] text-xs">
                    Upgrade to see relapse timing, trigger breakdowns, and journal correlations that
                    make your patterns impossible to ignore.
                  </p>
                </div>
              </div>
            )}

            {/* Help My Urge Button */}
           
        <CircuitBreaker noContent={false}/>

            {/* Daily Journal */}
            <div className="my-8">
              <JournalSection
                initialJournals={recentJournals}
                todayCount={todayJournalCount}
                isPaidUser={hasActiveSubscription}
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

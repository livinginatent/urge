import type { Relapse } from "@prisma/client";
import { requireAuth } from "@/lib/dal";
import { prisma } from "@/lib/prisma";
import { startStreak } from "@/app/actions/streak";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { UrgeCounter } from "@/components/urge-counter";
import { CircuitBreaker } from "@/components/CircuitBreaker";

export default async function DashboardPage() {
  // This will redirect to /login?redirect=/dashboard if not authenticated
  const session = await requireAuth("/dashboard");

  // Fetch user data including relapses
  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    include: {
      streak: true,
      relapses: {
        orderBy: { createdAt: "desc" },
        take: 5,
      },
    },
  });

  const streak = user?.streak;
  const recentRelapses: Relapse[] = user?.relapses ?? [];
  
  // Get total relapse count
  const totalRelapses = await prisma.relapse.count({
    where: { userId: session.userId },
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
    user?.subscriptionStatus === "TRIALING" ||
    user?.subscriptionStatus === "ACTIVE";

  const isTrialing = user?.subscriptionStatus === "TRIALING";

  const trialDaysRemaining = user?.trialEndsAt
    ? Math.max(
        0,
        Math.ceil(
          (user.trialEndsAt.getTime() - now.getTime()) /
            (1000 * 60 * 60 * 24),
        ),
      )
    : null;

  return (
    <div className="min-h-screen bg-[#050505] pt-24 pb-12 px-6">
      <div className="max-w-4xl mx-auto">
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
                  {isTrialing ? "FREE TRIAL ACTIVE" : "SUBSCRIPTION ACTIVE"}
                </p>
                {isTrialing && trialDaysRemaining !== null && (
                  <p className="text-[#a1a1aa] text-sm mt-1">
                    {trialDaysRemaining} day{trialDaysRemaining !== 1 ? "s" : ""} remaining in your free trial
                  </p>
                )}
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
                  Start your 30-day free trial to unlock all features
                </p>
              </div>
              <Button variant="commitment" size="lg" asChild>
                <a href="/subscribe">START FREE TRIAL</a>
              </Button>
            </div>
          </div>
        )}

        {/* Main Counter */}
        <Card className="mb-8">
          <CardContent className="py-12">
            <UrgeCounter
              startFrom={streakSeconds}
              label={streakSeconds > 0 ? "CURRENT STREAK" : "START MY STREAK"}
              autoStart={streakSeconds > 0}
              showDaysMonths
              onStart={startStreak}
            />
          </CardContent>
        </Card>

        {/* Action Buttons */}
        {streakSeconds > 0 && (
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <form action="/api/urge/gave-in" method="POST">
              <Button variant="destructive" size="lg" type="submit">
                I GAVE IN
              </Button>
            </form>
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
       
    <CircuitBreaker/>
    

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
              <ul className="space-y-3">
                {recentRelapses.map((relapse) => (
                  <li
                    key={relapse.id}
                    className="flex items-center justify-between py-3 border-b border-[#27272a] last:border-0"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-2 h-2 bg-[#E11D48]" />
                      <span className="text-[#a1a1aa] text-sm">
                        Lost {relapse.streakDays} day{relapse.streakDays !== 1 ? "s" : ""} streak
                      </span>
                    </div>
                    <span className="text-[#52525b] text-xs">
                      {new Date(relapse.createdAt).toLocaleDateString()}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

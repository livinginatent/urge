import type { Urge } from "@prisma/client";
import { requireAuth } from "@/lib/dal";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { UrgeCounter } from "@/components/urge-counter";

export default async function DashboardPage() {
  // This will redirect to /login?redirect=/dashboard if not authenticated
  const session = await requireAuth("/dashboard");

  // Fetch user data including subscription info
  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    include: {
      streak: true,
      urges: {
        orderBy: { createdAt: "desc" },
        take: 5,
      },
    },
  });

  const streak = user?.streak;
  const recentUrges: Urge[] = user?.urges ?? [];

  // Calculate streak in seconds (for display)
  const streakSeconds = streak?.currentStreak
    ? streak.currentStreak * 24 * 60 * 60
    : 0;

  // Subscription status
  const hasActiveSubscription =
    user?.isPaidUser ||
    user?.subscriptionStatus === "TRIALING" ||
    user?.subscriptionStatus === "ACTIVE";

  const isTrialing = user?.subscriptionStatus === "TRIALING";
  
  // Calculate trial days remaining (computed on server)
  const trialDaysRemaining = user?.trialEndsAt
    ? Math.max(0, Math.ceil((user.trialEndsAt.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))
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
            <UrgeCounter startFrom={streakSeconds} label="CURRENT STREAK" />
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <form action="/api/urge/resist" method="POST">
            <Button variant="outline" size="lg" type="submit">
              I HELD STRONG
            </Button>
          </form>
          <form action="/api/urge/gave-in" method="POST">
            <Button variant="destructive" size="lg" type="submit">
              I GAVE IN
            </Button>
          </form>
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
                Total Logged
              </CardDescription>
              <CardTitle className="text-4xl text-white">
                {recentUrges.length} <span className="text-lg text-[#52525b]">urges</span>
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your latest logged urges</CardDescription>
          </CardHeader>
          <CardContent>
            {recentUrges.length === 0 ? (
              <p className="text-[#52525b] text-sm">No activity yet. Start tracking your urges.</p>
            ) : (
              <ul className="space-y-3">
                {recentUrges.map((urge) => (
                  <li
                    key={urge.id}
                    className="flex items-center justify-between py-3 border-b border-[#27272a] last:border-0"
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`w-2 h-2 ${
                          urge.type === "RESISTED" ? "bg-green-500" : "bg-[#E11D48]"
                        }`}
                      />
                      <span className="text-[#a1a1aa] text-sm">
                        {urge.type === "RESISTED" ? "Resisted" : "Gave in"}
                      </span>
                    </div>
                    <span className="text-[#52525b] text-xs">
                      {new Date(urge.createdAt).toLocaleDateString()}
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

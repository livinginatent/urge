import { prisma } from "@/lib/prisma";

export type SubscriptionInfo = {
  isPaidUser: boolean;
  subscriptionStatus: string;
  trialDaysRemaining: number | null;
} | null;

/**
 * Get subscription info for a given user.
 * Shared between marketing pages and dashboard so logic stays in one place.
 */
export async function getSubscriptionInfo(
  userId: string,
): Promise<SubscriptionInfo> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      isPaidUser: true,
      subscriptionStatus: true,
      trialEndsAt: true,
    },
  });

  if (!user) {
    return null;
  }

  const trialDaysRemaining = user.trialEndsAt
    ? Math.max(
        0,
        Math.ceil(
          (user.trialEndsAt.getTime() - new Date().getTime()) /
            (1000 * 60 * 60 * 24),
        ),
      )
    : null;

  return {
    isPaidUser: user.isPaidUser,
    subscriptionStatus: user.subscriptionStatus,
    trialDaysRemaining,
  };
}


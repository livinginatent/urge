import { NextRequest, NextResponse } from "next/server";
import { verifySession } from "@/lib/dal";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  const session = await verifySession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();

  const existingStreak = await prisma.streak.findUnique({
    where: { userId: session.userId },
  });

  // Calculate how many days the streak was
  const streakDays =
    existingStreak?.startedAt
      ? Math.floor(
          (now.getTime() - existingStreak.startedAt.getTime()) /
            (1000 * 60 * 60 * 24),
        )
      : existingStreak?.currentStreak ?? 0;

  // Update longest streak if this was their best
  const longestStreak = Math.max(
    existingStreak?.longestStreak ?? 0,
    streakDays,
  );

  // Log the relapse (not urge - urges are for something else)
  await prisma.relapse.create({
    data: {
      userId: session.userId,
      streakDays,
      streakStart: existingStreak?.startedAt,
    },
  });

  // Reset streak and update last_reset_at + longest_streak
  await prisma.streak.upsert({
    where: { userId: session.userId },
    update: {
      currentStreak: 0,
      longestStreak,
      lastResetAt: now,
      startedAt: null,
    },
    create: {
      currentStreak: 0,
      longestStreak,
      lastResetAt: now,
      startedAt: null,
      user: {
        connect: { id: session.userId },
      },
    },
  });

  const redirectUrl = new URL("/dashboard", request.url);
  return NextResponse.redirect(redirectUrl);
}


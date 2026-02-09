import { NextRequest, NextResponse } from "next/server";
import { verifySession } from "@/lib/dal";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  const session = await verifySession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const { trigger, feeling } = body;

  const now = new Date();

  const existingStreak = await prisma.streak.findUnique({
    where: { userId: session.userId },
  });

  // Calculate how many calendar days the streak was (not 24-hour periods)
  const streakDays =
    existingStreak?.startedAt
      ? (() => {
          // Set both dates to midnight to get accurate day count
          const startDate = new Date(existingStreak.startedAt);
          startDate.setHours(0, 0, 0, 0);
          const todayDate = new Date(now);
          todayDate.setHours(0, 0, 0, 0);
          
          // Calculate difference in milliseconds, then convert to days
          const diffTime = todayDate.getTime() - startDate.getTime();
          return Math.floor(diffTime / (1000 * 60 * 60 * 24));
        })()
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
      trigger: trigger || null,
      feeling: feeling || null,
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

  return NextResponse.json({ success: true });
}


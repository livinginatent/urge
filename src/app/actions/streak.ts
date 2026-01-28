"use server";

import { requireAuth } from "@/lib/dal";
import { prisma } from "@/lib/prisma";

export async function startStreak() {
  const session = await requireAuth("/dashboard");

  const existing = await prisma.streak.findUnique({
    where: { userId: session.userId },
  });

  // If they already have a streak > 0 days, do not reset it.
  if (existing?.currentStreak && existing.currentStreak > 0) {
    return;
  }

  const now = new Date();

  await prisma.streak.upsert({
    where: { userId: session.userId },
    update: {
      currentStreak: 0,
      startedAt: now,
      lastResetAt: now,
    },
    create: {
      currentStreak: 0,
      startedAt: now,
      lastResetAt: now,
      user: {
        connect: { id: session.userId },
      },
    },
  });
}


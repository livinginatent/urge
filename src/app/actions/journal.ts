"use server";

import { requireAuth } from "@/lib/dal";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

const MAX_JOURNALS_PER_DAY = 3;
const MAX_CONTENT_LENGTH = 500;

export async function createJournal(content: string) {
  const session = await requireAuth("/dashboard");

  // Validate content
  const trimmedContent = content.trim();
  if (!trimmedContent) {
    return { error: "Journal content cannot be empty" };
  }
  if (trimmedContent.length > MAX_CONTENT_LENGTH) {
    return { error: `Journal content cannot exceed ${MAX_CONTENT_LENGTH} characters` };
  }

  // Check daily limit
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  
  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);

  const todayCount = await prisma.journal.count({
    where: {
      userId: session.userId,
      createdAt: {
        gte: todayStart,
        lte: todayEnd,
      },
    },
  });

  if (todayCount >= MAX_JOURNALS_PER_DAY) {
    return { error: `You can only write ${MAX_JOURNALS_PER_DAY} journal entries per day` };
  }

  // Create journal entry
  await prisma.journal.create({
    data: {
      content: trimmedContent,
      userId: session.userId,
    },
  });

  revalidatePath("/dashboard");
  return { success: true };
}

export async function getTodayJournals() {
  const session = await requireAuth("/dashboard");

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  
  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);

  const journals = await prisma.journal.findMany({
    where: {
      userId: session.userId,
      createdAt: {
        gte: todayStart,
        lte: todayEnd,
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return journals;
}

export async function getRecentJournals(limit: number = 10) {
  const session = await requireAuth("/dashboard");

  const journals = await prisma.journal.findMany({
    where: {
      userId: session.userId,
    },
    orderBy: { createdAt: "desc" },
    take: limit,
  });

  return journals;
}

export async function deleteJournal(journalId: string) {
  const session = await requireAuth("/dashboard");

  // Verify ownership
  const journal = await prisma.journal.findFirst({
    where: {
      id: journalId,
      userId: session.userId,
    },
  });

  if (!journal) {
    return { error: "Journal not found" };
  }

  await prisma.journal.delete({
    where: { id: journalId },
  });

  revalidatePath("/dashboard");
  return { success: true };
}

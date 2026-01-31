"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { verifySession } from "@/lib/dal";
import { z } from "zod";

const MAX_BUDDIES = 2;

const inviteBuddySchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

export type BuddyActionResult = {
  success: boolean;
  error?: string;
  message?: string;
};

// Invite a buddy by email
export async function inviteBuddy(
  formData: FormData
): Promise<BuddyActionResult> {
  const session = await verifySession();
  if (!session) {
    return { success: false, error: "Not authenticated" };
  }

  const email = formData.get("email");
  const validation = inviteBuddySchema.safeParse({ email });

  if (!validation.success) {
    return { success: false, error: validation.error.issues[0].message };
  }

  const inviteeEmail = validation.data.email.toLowerCase();

  // Get current user
  const currentUser = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { email: true },
  });

  if (!currentUser) {
    return { success: false, error: "User not found" };
  }

  // Can't invite yourself
  if (currentUser.email.toLowerCase() === inviteeEmail) {
    return { success: false, error: "You can't add yourself as a buddy" };
  }

  // Check if user already has max buddies (count accepted + pending sent)
  const existingBuddyCount = await prisma.buddy.count({
    where: {
      inviterId: session.userId,
      status: { in: ["PENDING", "ACCEPTED"] },
    },
  });

  if (existingBuddyCount >= MAX_BUDDIES) {
    return {
      success: false,
      error: `You can only have up to ${MAX_BUDDIES} buddies`,
    };
  }

  // Check if already invited this email
  const existingInvite = await prisma.buddy.findFirst({
    where: {
      inviterId: session.userId,
      inviteeEmail,
      status: { in: ["PENDING", "ACCEPTED"] },
    },
  });

  if (existingInvite) {
    return {
      success: false,
      error:
        existingInvite.status === "PENDING"
          ? "You already sent an invite to this email"
          : "This person is already your buddy",
    };
  }

  // Check if the invitee exists in our system
  const invitee = await prisma.user.findUnique({
    where: { email: inviteeEmail },
    select: { id: true },
  });

  // Create the buddy invite
  await prisma.buddy.create({
    data: {
      inviterId: session.userId,
      inviteeId: invitee?.id || null, // Link if user exists
      inviteeEmail,
      status: "PENDING",
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/settings");

  return {
    success: true,
    message: invitee
      ? "Buddy invite sent! They can accept it in their settings."
      : "Invite sent! They'll see it when they sign up with this email.",
  };
}

// Accept a buddy request
export async function acceptBuddyRequest(
  buddyId: string
): Promise<BuddyActionResult> {
  const session = await verifySession();
  if (!session) {
    return { success: false, error: "Not authenticated" };
  }

  // Get current user email
  const currentUser = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { email: true },
  });

  if (!currentUser) {
    return { success: false, error: "User not found" };
  }

  // Find the buddy request
  const buddy = await prisma.buddy.findFirst({
    where: {
      id: buddyId,
      inviteeEmail: currentUser.email.toLowerCase(),
      status: "PENDING",
    },
  });

  if (!buddy) {
    return { success: false, error: "Buddy request not found" };
  }

  // Update the buddy request
  await prisma.buddy.update({
    where: { id: buddyId },
    data: {
      status: "ACCEPTED",
      inviteeId: session.userId,
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/settings");

  return { success: true, message: "Buddy request accepted!" };
}

// Decline a buddy request
export async function declineBuddyRequest(
  buddyId: string
): Promise<BuddyActionResult> {
  const session = await verifySession();
  if (!session) {
    return { success: false, error: "Not authenticated" };
  }

  // Get current user email
  const currentUser = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { email: true },
  });

  if (!currentUser) {
    return { success: false, error: "User not found" };
  }

  // Find and update the buddy request
  const buddy = await prisma.buddy.findFirst({
    where: {
      id: buddyId,
      inviteeEmail: currentUser.email.toLowerCase(),
      status: "PENDING",
    },
  });

  if (!buddy) {
    return { success: false, error: "Buddy request not found" };
  }

  await prisma.buddy.update({
    where: { id: buddyId },
    data: { status: "DECLINED" },
  });

  revalidatePath("/dashboard/settings");

  return { success: true, message: "Buddy request declined" };
}

// Remove a buddy
export async function removeBuddy(buddyId: string): Promise<BuddyActionResult> {
  const session = await verifySession();
  if (!session) {
    return { success: false, error: "Not authenticated" };
  }

  // Find the buddy relationship (user could be inviter or invitee)
  const buddy = await prisma.buddy.findFirst({
    where: {
      id: buddyId,
      OR: [{ inviterId: session.userId }, { inviteeId: session.userId }],
    },
  });

  if (!buddy) {
    return { success: false, error: "Buddy not found" };
  }

  // Delete the buddy relationship
  await prisma.buddy.delete({
    where: { id: buddyId },
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/settings");

  return { success: true, message: "Buddy removed" };
}

// Get buddy progress data for display
export type BuddyProgress = {
  id: string;
  username: string;
  streakDays: number;
  startedAt: Date | null;
  // Last 14 days: true = clean, false = relapsed that day
  dayHistory: boolean[];
};

// Internal function that accepts userId directly (for optimized dashboard loading)
export async function getBuddyProgressForUser(userId: string): Promise<BuddyProgress[]> {
  // Get accepted buddy relationships where user is either inviter or invitee
  const buddies = await prisma.buddy.findMany({
    where: {
      status: "ACCEPTED",
      OR: [{ inviterId: userId }, { inviteeId: userId }],
    },
    include: {
      inviter: {
        select: {
          id: true,
          username: true,
          streak: true,
          relapses: {
            orderBy: { createdAt: "desc" },
            take: 14,
          },
        },
      },
      invitee: {
        select: {
          id: true,
          username: true,
          streak: true,
          relapses: {
            orderBy: { createdAt: "desc" },
            take: 14,
          },
        },
      },
    },
  });

  const progress: BuddyProgress[] = [];

  for (const buddy of buddies) {
    // Determine which user is the buddy (not the current user)
    const buddyUser =
      buddy.inviterId === userId ? buddy.invitee : buddy.inviter;

    if (!buddyUser) continue;

    // Calculate day history for last 14 days
    const dayHistory: boolean[] = [];
    const now = new Date();

    for (let i = 13; i >= 0; i--) {
      const dayStart = new Date(now);
      dayStart.setDate(dayStart.getDate() - i);
      dayStart.setHours(0, 0, 0, 0);

      const dayEnd = new Date(dayStart);
      dayEnd.setHours(23, 59, 59, 999);

      // Check if there was a relapse on this day
      const relapsedOnDay = buddyUser.relapses.some((r) => {
        const relapseDate = new Date(r.createdAt);
        return relapseDate >= dayStart && relapseDate <= dayEnd;
      });

      dayHistory.push(!relapsedOnDay);
    }

    progress.push({
      id: buddy.id,
      username: buddyUser.username,
      streakDays: buddyUser.streak?.currentStreak || 0,
      startedAt: buddyUser.streak?.startedAt || null,
      dayHistory,
    });
  }

  return progress;
}

// Public function with session verification (for client actions)
export async function getBuddyProgress(): Promise<BuddyProgress[]> {
  const session = await verifySession();
  if (!session) return [];
  return getBuddyProgressForUser(session.userId);
}

// Get pending buddy requests for the current user
export type PendingBuddyRequest = {
  id: string;
  inviterUsername: string;
  inviterEmail: string;
  createdAt: Date;
};

// Internal function that accepts email directly (for optimized page loading)
export async function getPendingBuddyRequestsForEmail(email: string): Promise<PendingBuddyRequest[]> {
  const requests = await prisma.buddy.findMany({
    where: {
      inviteeEmail: email.toLowerCase(),
      status: "PENDING",
    },
    include: {
      inviter: {
        select: {
          username: true,
          email: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return requests.map((r) => ({
    id: r.id,
    inviterUsername: r.inviter.username,
    inviterEmail: r.inviter.email,
    createdAt: r.createdAt,
  }));
}

// Public function with session verification (for client actions)
export async function getPendingBuddyRequests(): Promise<PendingBuddyRequest[]> {
  const session = await verifySession();
  if (!session) return [];

  const currentUser = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { email: true },
  });

  if (!currentUser) return [];

  return getPendingBuddyRequestsForEmail(currentUser.email);
}

// Get current user's sent buddy invites (pending)
export type SentBuddyInvite = {
  id: string;
  inviteeEmail: string;
  status: string;
  createdAt: Date;
};

// Internal function that accepts userId directly (for optimized dashboard loading)
export async function getSentBuddyInvitesForUser(userId: string): Promise<SentBuddyInvite[]> {
  const invites = await prisma.buddy.findMany({
    where: {
      inviterId: userId,
      status: "PENDING",
    },
    orderBy: { createdAt: "desc" },
  });

  return invites.map((i) => ({
    id: i.id,
    inviteeEmail: i.inviteeEmail,
    status: i.status,
    createdAt: i.createdAt,
  }));
}

// Public function with session verification (for client actions)
export async function getSentBuddyInvites(): Promise<SentBuddyInvite[]> {
  const session = await verifySession();
  if (!session) return [];
  return getSentBuddyInvitesForUser(session.userId);
}

// Get count of current buddies (for limiting)
export async function getBuddyCount(): Promise<number> {
  const session = await verifySession();
  if (!session) return 0;

  return prisma.buddy.count({
    where: {
      inviterId: session.userId,
      status: { in: ["PENDING", "ACCEPTED"] },
    },
  });
}

import { NextResponse } from "next/server";
import { Webhooks } from "@dodopayments/nextjs";
import { prisma } from "@/lib/prisma";
import { SubscriptionStatus } from "@prisma/client";

// Helper to find user by email from webhook payload
async function findUserByEmail(email: string) {
  return prisma.user.findUnique({ where: { email } });
}

export const POST = Webhooks({
  webhookKey: process.env.DODO_WEBHOOK_SECRET!,

  onPayload: async (payload) => {
    console.log("[Dodo Webhook] Incoming payload:", payload.type);
  },

  // Subscription became active (includes trial start)
  onSubscriptionActive: async (payload) => {
    console.log("[Dodo Webhook] Subscription active:", payload.data);
    
    const data = payload.data as {
      subscription_id?: string;
      customer_id?: string;
      customer?: { email?: string; customer_id?: string };
      status?: string;
      trial_end?: string;
      current_period_end?: string;
    };

    const email = data.customer?.email;
    if (!email) {
      console.error("[Dodo Webhook] No email in subscription payload");
      return;
    }

    const user = await findUserByEmail(email);
    if (!user) {
      console.error("[Dodo Webhook] User not found for email:", email);
      return;
    }

    // Determine if this is a trial or active subscription
    const isTrialing = data.trial_end && new Date(data.trial_end) > new Date();
    const trialEndsAt = data.trial_end ? new Date(data.trial_end) : null;

    // Extract customerId from payload
    const customerId = data.customer_id || data.customer?.customer_id;

    await prisma.user.update({
      where: { id: user.id },
      data: {
        isPaidUser: true,
        subscriptionStatus: isTrialing ? SubscriptionStatus.TRIALING : SubscriptionStatus.ACTIVE,
        subscriptionId: data.subscription_id,
        customerId: customerId || user.customerId,
        trialEndsAt: trialEndsAt,
        subscriptionEndsAt: data.current_period_end ? new Date(data.current_period_end) : null,
      },
    });

    console.log("[Dodo Webhook] User subscription updated:", user.id, isTrialing ? "TRIALING" : "ACTIVE");
  },

  // Subscription renewed (trial ended, now paying)
  onSubscriptionRenewed: async (payload) => {
    console.log("[Dodo Webhook] Subscription renewed:", payload.data);
    
    const data = payload.data as {
      subscription_id?: string;
      customer?: { email?: string };
      current_period_end?: string;
    };

    const email = data.customer?.email;
    if (!email) return;

    const user = await findUserByEmail(email);
    if (!user) return;

    await prisma.user.update({
      where: { id: user.id },
      data: {
        isPaidUser: true,
        subscriptionStatus: SubscriptionStatus.ACTIVE,
        trialEndsAt: null, // Trial is over
        subscriptionEndsAt: data.current_period_end ? new Date(data.current_period_end) : null,
      },
    });

    console.log("[Dodo Webhook] User subscription renewed:", user.id);
  },

  // Subscription on hold (payment failed)
  onSubscriptionOnHold: async (payload) => {
    console.log("[Dodo Webhook] Subscription on hold:", payload.data);
    
    const data = payload.data as { customer?: { email?: string } };
    const email = data.customer?.email;
    if (!email) return;

    const user = await findUserByEmail(email);
    if (!user) return;

    await prisma.user.update({
      where: { id: user.id },
      data: {
        subscriptionStatus: SubscriptionStatus.ON_HOLD,
      },
    });

    console.log("[Dodo Webhook] User subscription on hold:", user.id);
  },

  // Subscription cancelled
  onSubscriptionCancelled: async (payload) => {
    console.log("[Dodo Webhook] Subscription cancelled:", payload.data);
    
    const data = payload.data as {
      customer?: { email?: string };
      current_period_end?: string;
    };

    const email = data.customer?.email;
    if (!email) return;

    const user = await findUserByEmail(email);
    if (!user) return;

    await prisma.user.update({
      where: { id: user.id },
      data: {
        subscriptionStatus: SubscriptionStatus.CANCELLED,
        // User can still access until period ends
        subscriptionEndsAt: data.current_period_end ? new Date(data.current_period_end) : null,
      },
    });

    console.log("[Dodo Webhook] User subscription cancelled:", user.id);
  },

  // Subscription expired
  onSubscriptionExpired: async (payload) => {
    console.log("[Dodo Webhook] Subscription expired:", payload.data);
    
    const data = payload.data as { customer?: { email?: string } };
    const email = data.customer?.email;
    if (!email) return;

    const user = await findUserByEmail(email);
    if (!user) return;

    await prisma.user.update({
      where: { id: user.id },
      data: {
        isPaidUser: false,
        subscriptionStatus: SubscriptionStatus.EXPIRED,
        subscriptionEndsAt: new Date(),
      },
    });

    console.log("[Dodo Webhook] User subscription expired:", user.id);
  },

  // Subscription failed (couldn't charge)
  onSubscriptionFailed: async (payload) => {
    console.log("[Dodo Webhook] Subscription failed:", payload.data);
    
    const data = payload.data as { customer?: { email?: string } };
    const email = data.customer?.email;
    if (!email) return;

    const user = await findUserByEmail(email);
    if (!user) return;

    await prisma.user.update({
      where: { id: user.id },
      data: {
        isPaidUser: false,
        subscriptionStatus: SubscriptionStatus.EXPIRED,
      },
    });

    console.log("[Dodo Webhook] User subscription failed:", user.id);
  },
});

export const GET = () =>
  NextResponse.json(
    { message: "Dodo Payments webhook endpoint. Use POST for webhooks." },
    { status: 405 },
  );


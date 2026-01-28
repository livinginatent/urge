import { NextResponse } from "next/server";
import { Webhooks } from "@dodopayments/nextjs";

export const POST = Webhooks({
  webhookKey: process.env.DODO_WEBHOOK_SECRET!,
  // Simple example handler – customize this to hook into your own logic
  onPayload: async (payload) => {
    // TODO: Replace this with your own business logic
    console.log("[Dodo Webhook] Incoming payload:", payload.type);
  },
  // You can optionally add more granular handlers here, for example:
  // onPaymentSucceeded: async (payload) => { ... },
  // onSubscriptionActive: async (payload) => { ... },
});

export const GET = () =>
  NextResponse.json(
    { message: "Dodo Payments webhook endpoint. Use POST for webhooks." },
    { status: 405 },
  );


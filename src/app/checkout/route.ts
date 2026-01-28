import { NextRequest, NextResponse } from "next/server";
import { Checkout } from "@dodopayments/nextjs";

const DODO_ENVIRONMENT: "test_mode" | "live_mode" | undefined =
  process.env.DODO_PAYMENTS_ENVIRONMENT === "test_mode"
    ? "test_mode"
    : process.env.DODO_PAYMENTS_ENVIRONMENT === "live_mode"
      ? "live_mode"
      : undefined;

// Prefer NEXT_PUBLIC_SITE_URL, then Vercel URL, then localhost
const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

// Allow override via env; otherwise derive dynamically from SITE_URL
const DODO_RETURN_URL =
  process.env.DODO_PAYMENTS_RETURN_URL || `${SITE_URL}/after-checkout`;

// Base handlers from the Dodo adapter
const DodoStaticCheckout = Checkout({
  bearerToken: process.env.DODO_PAYMENTS_API_KEY!,
  returnUrl: DODO_RETURN_URL,
  environment: DODO_ENVIRONMENT,
  type: "static",
});

export const DodoSessionCheckout = Checkout({
  bearerToken: process.env.DODO_PAYMENTS_API_KEY!,
  returnUrl: DODO_RETURN_URL,
  environment: DODO_ENVIRONMENT,
  // Recommended: use "session" for flexible one-time and subscription flows
  type: "session", // or "dynamic" for dynamic link, or "static" if you prefer
});

// For links/buttons, redirect the user directly to the checkout_url
export const GET = async (request: NextRequest) => {
  const response = await DodoStaticCheckout(request);

  if (!response.ok) {
    // Surface error responses as-is (e.g. 400 when productId is missing)
    return response;
  }

  const data = (await response.json()) as { checkout_url?: string };

  if (!data.checkout_url) {
    return response;
  }

  return NextResponse.redirect(data.checkout_url);
};

// Keep POST as the raw adapter response for programmatic usage
export const POST = DodoSessionCheckout;


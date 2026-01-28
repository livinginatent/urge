import { Checkout } from "@dodopayments/nextjs";

const DODO_ENVIRONMENT: "test_mode" | "live_mode" | undefined =
  process.env.DODO_PAYMENTS_ENVIRONMENT === "test_mode"
    ? "test_mode"
    : process.env.DODO_PAYMENTS_ENVIRONMENT === "live_mode"
      ? "live_mode"
      : undefined;

export const GET = Checkout({
  bearerToken: process.env.DODO_PAYMENTS_API_KEY!,
  returnUrl: process.env.DODO_PAYMENTS_RETURN_URL,
  environment: DODO_ENVIRONMENT,
  type: "static",
});

export const POST = Checkout({
  bearerToken: process.env.DODO_PAYMENTS_API_KEY!,
  returnUrl: process.env.DODO_PAYMENTS_RETURN_URL,
  environment: DODO_ENVIRONMENT,
  // Recommended: use "session" for flexible one-time and subscription flows
  type: "session", // or "dynamic" for dynamic link, or "static" if you prefer
});


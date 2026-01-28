import { CustomerPortal } from "@dodopayments/nextjs";

const DODO_ENVIRONMENT: "test_mode" | "live_mode" | undefined =
  process.env.DODO_PAYMENTS_ENVIRONMENT === "test_mode"
    ? "test_mode"
    : process.env.DODO_PAYMENTS_ENVIRONMENT === "live_mode"
      ? "live_mode"
      : undefined;

export const GET = CustomerPortal({
  bearerToken: process.env.DODO_PAYMENTS_API_KEY!,
  environment: DODO_ENVIRONMENT,
});


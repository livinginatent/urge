import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { requireAuth } from "@/lib/dal";

const DODO_ENVIRONMENT: "test_mode" | "live_mode" =
  process.env.DODO_PAYMENTS_ENVIRONMENT === "live_mode" ? "live_mode" : "test_mode";

const DODO_PRODUCT_ID = process.env.NEXT_PUBLIC_DODO_PAYMENTS_PRODUCT_ID;

/**
 * Subscribe page - handles the auth-gated checkout flow
 *
 * Flow:
 * 1. User clicks CTA → lands here
 * 2. requireAuth() checks if logged in
 *    - If NOT logged in → redirects to /login?redirect=/subscribe
 *    - After login → user comes back here
 * 3. Once authenticated, we build the Dodo checkout URL and redirect
 */
export default async function SubscribePage() {
  // This will redirect to /login?redirect=/subscribe if not authenticated
  const session = await requireAuth("/subscribe");

  if (!DODO_PRODUCT_ID) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center px-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Configuration Error</h1>
          <p className="text-[#a1a1aa]">Product ID not configured. Please contact support.</p>
        </div>
      </div>
    );
  }

  // Get the current host from request headers to build return URL
  const headersList = await headers();
  const host = headersList.get("host") || "localhost:3000";
  const protocol = headersList.get("x-forwarded-proto") || "https";

  // Build return URL dynamically from current request
  const returnUrl =
    process.env.DODO_PAYMENTS_RETURN_URL || `${protocol}://${host}/dashboard`;

  // Build the Dodo checkout URL directly
  const baseUrl =
    DODO_ENVIRONMENT === "test_mode"
      ? "https://test.checkout.dodopayments.com"
      : "https://checkout.dodopayments.com";

  const checkoutUrl = new URL(`/buy/${DODO_PRODUCT_ID}`, baseUrl);
  checkoutUrl.searchParams.set("quantity", "1");
  checkoutUrl.searchParams.set("redirect_url", returnUrl);

  // Optionally pre-fill email if available
  if (session.email) {
    checkoutUrl.searchParams.set("email", session.email);
  }

  // Redirect to Dodo Checkout
  redirect(checkoutUrl.toString());
}

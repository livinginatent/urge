import { redirect } from "next/navigation";
import { requireAuth } from "@/lib/dal";

const DODO_ENVIRONMENT: "test_mode" | "live_mode" =
  process.env.DODO_PAYMENTS_ENVIRONMENT === "live_mode" ? "live_mode" : "test_mode";

// Prefer NEXT_PUBLIC_SITE_URL, then Vercel URL, then localhost
const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

const DODO_RETURN_URL =
  process.env.DODO_PAYMENTS_RETURN_URL || `${SITE_URL}/dashboard`;

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

  // Build the Dodo checkout URL directly
  // For static checkout, we can construct the URL ourselves
  const baseUrl =
    DODO_ENVIRONMENT === "test_mode"
      ? "https://test.checkout.dodopayments.com"
      : "https://checkout.dodopayments.com";

  const checkoutUrl = new URL(`/buy/${DODO_PRODUCT_ID}`, baseUrl);
  checkoutUrl.searchParams.set("quantity", "1");
  checkoutUrl.searchParams.set("redirect_url", DODO_RETURN_URL);

  // Optionally pre-fill email if available
  if (session.email) {
    checkoutUrl.searchParams.set("email", session.email);
  }

  // Redirect to Dodo Checkout
  redirect(checkoutUrl.toString());
}

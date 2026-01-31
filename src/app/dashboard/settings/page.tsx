import { requireAuth } from "@/lib/dal";
import { prisma } from "@/lib/prisma";
import { SettingsContent } from "./settings-content";
import { getPendingBuddyRequestsForEmail } from "@/app/actions/buddy";

export default async function SettingsPage() {
  const session = await requireAuth("/dashboard/settings");

  // Fetch user data first (need email for buddy requests)
  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: {
      email: true,
      customerId: true,
      subscriptionStatus: true,
    },
  });

  // Fetch buddy requests using email (single query, no extra session verification)
  const pendingBuddyRequests = user?.email
    ? await getPendingBuddyRequestsForEmail(user.email)
    : [];

  const customerPortalUrl = user?.customerId
    ? `/customer-portal?customer_id=${user.customerId}`
    : null;

  const hasSubscription =
    user?.subscriptionStatus === "ACTIVE" ||
    user?.subscriptionStatus === "TRIALING" ||
    user?.subscriptionStatus === "CANCELLED";

  return (
    <SettingsContent
      customerPortalUrl={customerPortalUrl}
      hasSubscription={hasSubscription}
      pendingBuddyRequests={pendingBuddyRequests}
    />
  );
}

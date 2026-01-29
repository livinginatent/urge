import { requireAuth } from "@/lib/dal";
import { prisma } from "@/lib/prisma";
import { SettingsContent } from "./settings-content";

export default async function SettingsPage() {
  const session = await requireAuth("/dashboard/settings");

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: {
      customerId: true,
      subscriptionStatus: true,
    },
  });

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
    />
  );
}

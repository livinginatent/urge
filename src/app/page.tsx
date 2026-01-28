import { NavBar } from "@/components/navbar";
import { LandingContent } from "@/components/landing-content";
import { verifySession } from "@/lib/dal";
import { getSubscriptionInfo } from "@/lib/subscription";

export default async function Home() {
  const session = await verifySession();

  const subscriptionInfo = session
    ? await getSubscriptionInfo(session.userId)
    : null;

  return (
    <div className="relative bg-[#050505] scroll-smooth">
      <NavBar />
      <LandingContent subscriptionInfo={subscriptionInfo} />
    </div>
  );
}


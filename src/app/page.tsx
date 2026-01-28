import { NavBar } from "@/components/navbar";
import { LandingContent } from "@/components/landing-content";
import { verifySession } from "@/lib/dal";
import { prisma } from "@/lib/prisma";

export default async function Home() {
  // Check if user is logged in and get their subscription status
  const session = await verifySession();
  
  let subscriptionInfo = null;
  
  if (session) {
    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: {
        isPaidUser: true,
        subscriptionStatus: true,
        trialEndsAt: true,
      },
    });
    
    if (user) {
      // Calculate trial days remaining on the server (pure function)
      const now = Date.now();
      const trialDaysRemaining = user.trialEndsAt
        ? Math.max(0, Math.ceil((new Date(user.trialEndsAt).getTime() - now) / (1000 * 60 * 60 * 24)))
        : null;

      subscriptionInfo = {
        isPaidUser: user.isPaidUser,
        subscriptionStatus: user.subscriptionStatus,
        trialDaysRemaining,
      };
    }
  }

  return (
    <div className="relative bg-[#050505] scroll-smooth">
      <NavBar />
      <LandingContent subscriptionInfo={subscriptionInfo} />
    </div>
  );
}

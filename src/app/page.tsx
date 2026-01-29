import type { Metadata } from "next";
import { NavBar } from "@/components/navbar";
import { LandingContent } from "@/components/landing-content";
import { verifySession } from "@/lib/dal";
import { getSubscriptionInfo } from "@/lib/subscription";

export const metadata: Metadata = {
  title: "URGE – The Cost of Every Urge",
  description:
    "URGE turns your urges into a streak to defend. Pay a small monthly cost to make every relapse hurt—and every victory count.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "URGE – Break the Cycle, One Urge at a Time",
    description:
      "A brutalist discipline tool that tracks your urges, your relapses, and your streak—with real cost attached.",
    url: "https://useurge.app/",
    siteName: "URGE",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "URGE – Break the Cycle, One Urge at a Time",
    description:
      "A brutalist discipline tool that tracks your urges, your relapses, and your streak—with real cost attached.",
  },
};

export default async function Home() {
  const session = await verifySession();

  const subscriptionInfo = session
    ? await getSubscriptionInfo(session.userId)
    : null;

  return (
    <div className="relative bg-[#050505] scroll-smooth overflow-x-hidden w-full">
      <NavBar />
      <LandingContent subscriptionInfo={subscriptionInfo} />
    </div>
  );
}


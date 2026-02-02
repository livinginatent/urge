import type { Metadata } from "next";
import Link from "next/link";
import { NavBar } from "@/components/navbar";

export const metadata: Metadata = {
  title: "About URGE – The Cost of Every Urge",
  description:
    "URGE is a brutalist discipline tool that turns every urge into a streak to defend, with real cost and social accountability.",
  alternates: {
    canonical: "/about",
  },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-[#a1a1aa] scroll-smooth">
      <NavBar />

      <main className="max-w-3xl mx-auto px-6 pt-28 pb-16">
        <header className="mb-10 border-b-2 border-[#27272a] pb-6">
          <p className="text-[10px] tracking-[0.3em] text-[#52525b] uppercase mb-3">
            About / Why URGE Exists
          </p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight">
            Discipline with a Price Tag
          </h1>
          <p className="mt-4 text-sm text-[#52525b] max-w-xl">
            URGE is not a wellness app. It&apos;s a financial and social pressure
            system for people who are tired of relapsing and tired of lying to
            themselves.
          </p>
        </header>

        <section className="space-y-8 text-sm leading-relaxed">
          <div className="border-2 border-[#27272a] bg-[#0a0a0a] p-5">
            <h2 className="text-white font-semibold mb-2 uppercase tracking-[0.2em] text-xs">
              The Problem
            </h2>
            <p>
              You already know what you&apos;re supposed to do. You&apos;ve read the
              threads, watched the videos, saved the quotes. But when the urge hits,
              all of that collapses. Willpower is free, and free things get
              disrespected.
            </p>
          </div>

          <div className="border-2 border-[#27272a] bg-[#0a0a0a] p-5">
            <h2 className="text-white font-semibold mb-2 uppercase tracking-[0.2em] text-xs">
              The Core Idea
            </h2>
            <p className="mb-3">
              URGE makes every relapse cost you something. Not in theory—in actual
              dollars and visible damage to your streak.
            </p>
            <ul className="space-y-2 ml-2">
              <li>
                <span className="text-white font-semibold">The Counter:</span>{" "}
                your streak timer. It doesn&apos;t care why you slipped. It just
                resets.
              </li>
              <li>
                <span className="text-white font-semibold">The Override:</span>{" "}
                an interrupt for high-intensity urges—forcing you to confront what
                you&apos;re about to do.
              </li>
              <li>
                <span className="text-white font-semibold">The Sentinel:</span>{" "}
                daily emails that don&apos;t let you forget what you committed to.
              </li>
            </ul>
          </div>

          <div className="border-2 border-[#27272a] bg-[#0a0a0a] p-5">
            <h2 className="text-white font-semibold mb-2 uppercase tracking-[0.2em] text-xs">
              Social Accountability
            </h2>
            <p className="mb-3">
              Willpower fails in private. URGE lets you bring other people into the
              loop—without turning your life into content.
            </p>
            <ul className="space-y-2 ml-2">
              <li>
                <span className="text-white font-semibold">Accountability Buddies:</span>{" "}
                add up to two trusted people using their email.
              </li>
              <li>
                They see your streak length and a 14-day line of white and red
                circles—white for clean days, red for relapses.
              </li>
              <li>
                You see the same for them. No likes. No comments. Just the truth.
              </li>
            </ul>
          </div>

          <div className="border-2 border-[#27272a] bg-[#0a0a0a] p-5">
            <h2 className="text-white font-semibold mb-2 uppercase tracking-[0.2em] text-xs">
              What URGE Is Not
            </h2>
            <ul className="space-y-1 ml-2">
              <li>No dopamine casino. No streak emojis. No confetti.</li>
              <li>No &quot;community feed&quot;. No endless scrolling.</li>
              <li>No moralizing. Just data, cost, and consequences.</li>
            </ul>
          </div>

          <div className="border-2 border-[#27272a] bg-[#0a0a0a] p-5">
            <h2 className="text-white font-semibold mb-2 uppercase tracking-[0.2em] text-xs">
              Who This Is For
            </h2>
            <p className="mb-2">
              URGE is for people who are done negotiating with their habit. If you
              want a cute tracker, this isn&apos;t it. If you want a line in the sand,
              it is.
            </p>
            <p>
              If you&apos;re the type who does better when there&apos;s something real on
              the line—money, streaks, and people who can see when you slip—URGE was
              built for you.
            </p>
          </div>
        </section>

        <footer className="mt-12 text-[10px] text-[#52525b] uppercase tracking-[0.25em] flex justify-between gap-4">
          <span>URGE / DISCIPLINE WITH TEETH</span>
          <Link href="/" className="text-[#a1a1aa] hover:text-white">
            BACK TO HOME
          </Link>
        </footer>
      </main>
    </div>
  );
}


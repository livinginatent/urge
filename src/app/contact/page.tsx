import Link from "next/link";
import { NavBar } from "@/components/navbar";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-[#a1a1aa] scroll-smooth">
      <NavBar />

      <main className="max-w-3xl mx-auto px-6 pt-28 pb-16">
        <header className="mb-10 border-b-2 border-[#27272a] pb-6">
          <p className="text-[10px] tracking-[0.3em] text-[#52525b] uppercase mb-3">
            Get in touch
          </p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight">
            Contact URGE
          </h1>
          <p className="mt-4 text-sm text-[#52525b]">
            No bots. No ticket maze. Just a sharp little form that goes straight to us.
          </p>
        </header>

        <section className="space-y-8 text-sm leading-relaxed">
          <form
            method="post"
            action="mailto:support@useurge.app"
            className="border-2 border-[#27272a] bg-[#0a0a0a] p-6 space-y-6"
          >
            <div className="space-y-1">
              <label
                htmlFor="reason"
                className="block text-[10px] tracking-[0.25em] text-[#52525b] uppercase"
              >
                Reason
              </label>
              <select
                id="reason"
                name="reason"
                className="w-full bg-[#050505] border-2 border-[#27272a] text-xs text-[#a1a1aa] px-3 py-2 focus:outline-none focus:border-[#E11D48]"
                defaultValue="support"
              >
                <option value="support">Support / Something is broken</option>
                <option value="billing">Billing / Subscription</option>
                <option value="feedback">Feedback / Idea</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="space-y-1">
              <label
                htmlFor="email"
                className="block text-[10px] tracking-[0.25em] text-[#52525b] uppercase"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="w-full bg-[#050505] border-2 border-[#27272a] text-xs text-[#a1a1aa] px-3 py-2 focus:outline-none focus:border-[#E11D48]"
                placeholder="you@example.com"
              />
            </div>

            <div className="space-y-1">
              <label
                htmlFor="message"
                className="block text-[10px] tracking-[0.25em] text-[#52525b] uppercase"
              >
                Message
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={6}
                className="w-full bg-[#050505] border-2 border-[#27272a] text-xs text-[#a1a1aa] px-3 py-2 focus:outline-none focus:border-[#E11D48] resize-vertical"
                placeholder="Tell us exactly what&apos;s going on. Brutal honesty welcome."
              />
            </div>

            <button
              type="submit"
              className="w-full border-2 border-[#E11D48] bg-[#E11D48] text-white text-xs tracking-[0.3em] py-3 uppercase hover:bg-[#be123c] active:translate-x-[2px] active:translate-y-[2px] shadow-[4px_4px_0_0_#27272a] hover:shadow-[2px_2px_0_0_#27272a]"
            >
              SEND THE MESSAGE
            </button>

            <p className="text-[10px] text-[#52525b]">
              This uses your default mail client. If nothing opens, email{" "}
              <span className="text-white font-semibold">
                support@useurge.app
              </span>{" "}
              directly.
            </p>
          </form>

          <div className="border-2 border-[#27272a] bg-[#0a0a0a] p-5">
            <h2 className="text-white font-semibold mb-2 uppercase tracking-[0.2em] text-xs">
              If You&apos;re in Crisis
            </h2>
            <p>
              URGE is not an emergency service. If you&apos;re at risk of
              harming yourself or someone else,{" "}
              <span className="text-white font-semibold">
                stop using the app and contact your local emergency services or
                a crisis hotline immediately
              </span>
              . This app is here to help with discipline, not life-or-death
              situations.
            </p>
          </div>
        </section>

        <footer className="mt-12 text-[10px] text-[#52525b] uppercase tracking-[0.25em] flex justify-between gap-4">
          <span>URGE / SAY IT STRAIGHT</span>
          <Link href="/" className="text-[#a1a1aa] hover:text-white">
            BACK TO HOME
          </Link>
        </footer>
      </main>
    </div>
  );
}


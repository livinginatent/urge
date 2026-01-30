import Link from "next/link";
import { NavBar } from "@/components/navbar";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-[#a1a1aa] scroll-smooth">
      <NavBar />

      <main className="max-w-3xl mx-auto px-6 pt-28 pb-16">
        <header className="mb-10 border-b-2 border-[#27272a] pb-6">
          <p className="text-[10px] tracking-[0.3em] text-[#52525b] uppercase mb-3">
            Legal / Terms of Use
          </p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight">
            The Cost of Using URGE
          </h1>
          <p className="mt-4 text-sm text-[#52525b]">
            Read this. No fluff. Just the commitments we&apos;re both making.
          </p>
        </header>

        <section className="space-y-8 text-sm leading-relaxed">
          <div className="border-2 border-[#27272a] bg-[#0a0a0a] p-5">
            <h2 className="text-white font-semibold mb-2 uppercase tracking-[0.2em] text-xs">
              1. Not Medical Advice
            </h2>
            <p>
              URGE is a discipline and accountability tool. It is{" "}
              <span className="text-white font-semibold">
                not therapy, not treatment, and not medical advice
              </span>
              . If your urges put you or anyone else in danger, talk to a
              professional or contact emergency services in your area.
            </p>
          </div>

          <div className="border-2 border-[#27272a] bg-[#0a0a0a] p-5">
            <h2 className="text-white font-semibold mb-2 uppercase tracking-[0.2em] text-xs">
              2. Your Responsibility
            </h2>
            <p>
              You are fully responsible for what you do before, during, and
              after using URGE. The app will nudge, track, and confront you,
              but{" "}
              <span className="text-white font-semibold">
                your choices are yours
              </span>
              . You agree not to use URGE for anything illegal, abusive, or
              harmful.
            </p>
          </div>

          <div className="border-2 border-[#27272a] bg-[#0a0a0a] p-5">
            <h2 className="text-white font-semibold mb-2 uppercase tracking-[0.2em] text-xs">
              3. Accounts &amp; Access
            </h2>
            <p>
              Keep your login details secure. You are responsible for all
              activity under your account. We may suspend or terminate access
              if you abuse the service, attack the system, or violate these
              terms.
            </p>
          </div>

          <div className="border-2 border-[#27272a] bg-[#0a0a0a] p-5">
            <h2 className="text-white font-semibold mb-2 uppercase tracking-[0.2em] text-xs">
              4. Subscription &amp; Billing
            </h2>
            <p className="mb-3">
              URGE is a recurring subscription. By subscribing, you authorize
              us (via our payment provider) to charge your chosen payment
              method until you cancel. Prices, free trials, and billing cycles
              may change, but we&apos;ll keep it simple and transparent.
            </p>
            <p>
              You can cancel at any time going forward.{" "}
              <span className="text-white font-semibold">
                Refunds are not guaranteed
              </span>
              . When in doubt, cancel before the next renewal.
            </p>
          </div>

          <div className="border-2 border-[#27272a] bg-[#0a0a0a] p-5">
            <h2 className="text-white font-semibold mb-2 uppercase tracking-[0.2em] text-xs">
              5. Data &amp; Privacy
            </h2>
            <p className="mb-3">
              We store the minimum data needed to run the product: your
              account, your streaks, your relapses, and subscription details.
            </p>
            <p className="mb-3">
              We don&apos;t sell your personal data. We may use anonymized,
              aggregated information to understand how URGE is used and to
              improve the product.
            </p>
            <p>
              For the full picture, read the{" "}
              <Link
                href="/privacy"
                className="underline underline-offset-4 text-[#E11D48]"
              >
                Privacy Policy
              </Link>{" "}
              when available.
            </p>
          </div>

          <div className="border-2 border-[#27272a] bg-[#0a0a0a] p-5">
            <h2 className="text-white font-semibold mb-2 uppercase tracking-[0.2em] text-xs">
              6. No Guarantees
            </h2>
            <p>
              We want URGE to help you win. But{" "}
              <span className="text-white font-semibold">
                we don&apos;t guarantee results
              </span>
              . Your outcomes depend on your actions, environment, and
              decisions outside the app.
            </p>
          </div>

          <div className="border-2 border-[#27272a] bg-[#0a0a0a] p-5">
            <h2 className="text-white font-semibold mb-2 uppercase tracking-[0.2em] text-xs">
              7. Service Changes
            </h2>
            <p>
              We may change, pause, or discontinue parts of URGE at any time.
              We&apos;ll avoid drama and keep the product focused, but we
              reserve the right to ship, cut, or refactor features.
            </p>
          </div>

          <div className="border-2 border-[#27272a] bg-[#0a0a0a] p-5">
            <h2 className="text-white font-semibold mb-2 uppercase tracking-[0.2em] text-xs">
              8. Limitation of Liability
            </h2>
            <p>
              To the maximum extent allowed by law, URGE and its creators will
              not be liable for indirect, incidental, or consequential damages
              arising from your use of the service. If we are found liable for
              anything,{" "}
              <span className="text-white font-semibold">
                the total cap is what you&apos;ve paid us in the last 12 months
              </span>
              .
            </p>
          </div>

          <div className="border-2 border-[#27272a] bg-[#0a0a0a] p-5">
            <h2 className="text-white font-semibold mb-2 uppercase tracking-[0.2em] text-xs">
              9. Changes to These Terms
            </h2>
            <p>
              We may update these terms from time to time. When we do, we&apos;ll
              update the date and, where it matters, let you know in-app or via
              email. Continuing to use URGE after changes means you accept the
              new terms.
            </p>
          </div>

          <div className="border-2 border-[#27272a] bg-[#0a0a0a] p-5">
            <h2 className="text-white font-semibold mb-2 uppercase tracking-[0.2em] text-xs">
              10. Contact
            </h2>
            <p>
              Questions about these terms? Reach out at{" "}
              <span className="text-white font-semibold">
                support@urges.app
              </span>
              . Keep it direct. We&apos;ll do the same.
            </p>
          </div>
        </section>

        <footer className="mt-12 text-[10px] text-[#52525b] uppercase tracking-[0.25em] flex justify-between gap-4">
          <span>URGE / BREAK THE CYCLE</span>
          <Link href="/" className="text-[#a1a1aa] hover:text-white">
            BACK TO HOME
          </Link>
        </footer>
      </main>
    </div>
  );
}


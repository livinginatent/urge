import Link from "next/link";
import { NavBar } from "@/components/navbar";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-[#a1a1aa] scroll-smooth">
      <NavBar />

      <main className="max-w-3xl mx-auto px-6 pt-28 pb-16">
        <header className="mb-10 border-b-2 border-[#27272a] pb-6">
          <p className="text-[10px] tracking-[0.3em] text-[#52525b] uppercase mb-3">
            Legal / Privacy Policy
          </p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight">
            How URGE Handles Your Data
          </h1>
          <p className="mt-4 text-sm text-[#52525b]">
            No dark patterns. No surprise tracking. Just what we collect, why,
            and what you can do about it.
          </p>
        </header>

        <section className="space-y-8 text-sm leading-relaxed">
          <div className="border-2 border-[#27272a] bg-[#0a0a0a] p-5">
            <h2 className="text-white font-semibold mb-2 uppercase tracking-[0.2em] text-xs">
              1. What We Collect
            </h2>
            <p className="mb-2">
              To run URGE, we collect only what we need:
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>Account info (email, login details).</li>
              <li>Streaks, relapses, and basic usage events.</li>
              <li>Subscription and billing status (handled by our payment provider).</li>
            </ul>
          </div>

          <div className="border-2 border-[#27272a] bg-[#0a0a0a] p-5">
            <h2 className="text-white font-semibold mb-2 uppercase tracking-[0.2em] text-xs">
              2. How We Use It
            </h2>
            <p>
              Data is used to power the core features: tracking your streak,
              logging relapses, sending accountability emails, and managing your
              subscription. We may aggregate anonymized data to understand
              patterns and improve the product.
            </p>
          </div>

          <div className="border-2 border-[#27272a] bg-[#0a0a0a] p-5">
            <h2 className="text-white font-semibold mb-2 uppercase tracking-[0.2em] text-xs">
              3. What We Don&apos;t Do
            </h2>
            <ul className="list-disc list-inside space-y-1">
              <li>No selling your personal data.</li>
              <li>No ad networks that profile you across the web.</li>
              <li>No hidden trackers whose only job is to spy on you.</li>
            </ul>
          </div>

          <div className="border-2 border-[#27272a] bg-[#0a0a0a] p-5">
            <h2 className="text-white font-semibold mb-2 uppercase tracking-[0.2em] text-xs">
              4. Third-Party Services
            </h2>
            <p>
              URGE uses third-party providers for infrastructure, analytics, and
              payments (for example, database, hosting, and payment processing).
              These providers only get the data they need to do their job and
              are expected to handle it securely.
            </p>
          </div>

          <div className="border-2 border-[#27272a] bg-[#0a0a0a] p-5">
            <h2 className="text-white font-semibold mb-2 uppercase tracking-[0.2em] text-xs">
              5. Cookies &amp; Storage
            </h2>
            <p>
              We use cookies and similar storage mechanisms to keep you logged
              in and to remember essential preferences. If you block all
              cookies, URGE may not work correctly.
            </p>
          </div>

          <div className="border-2 border-[#27272a] bg-[#0a0a0a] p-5">
            <h2 className="text-white font-semibold mb-2 uppercase tracking-[0.2em] text-xs">
              6. Data Retention
            </h2>
            <p>
              We keep your data while you have an account and for a reasonable
              period after deletion for security, fraud prevention, and legal
              obligations. When data is no longer needed, we delete or
              anonymize it.
            </p>
          </div>

          <div className="border-2 border-[#27272a] bg-[#0a0a0a] p-5">
            <h2 className="text-white font-semibold mb-2 uppercase tracking-[0.2em] text-xs">
              7. Your Rights
            </h2>
            <p className="mb-2">
              Depending on where you live, you may have rights like:
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>Accessing the data we hold about you.</li>
              <li>Requesting corrections or deletion.</li>
              <li>Exporting your data where applicable.</li>
            </ul>
            <p className="mt-2">
              If you want to exercise these rights, contact us and we&apos;ll
              respond within a reasonable time.
            </p>
          </div>

          <div className="border-2 border-[#27272a] bg-[#0a0a0a] p-5">
            <h2 className="text-white font-semibold mb-2 uppercase tracking-[0.2em] text-xs">
              8. Security
            </h2>
            <p>
              We take reasonable technical and organizational measures to keep
              your data safe. No system is perfect, but we treat your data like
              something that matters—because it does.
            </p>
          </div>

          <div className="border-2 border-[#27272a] bg-[#0a0a0a] p-5">
            <h2 className="text-white font-semibold mb-2 uppercase tracking-[0.2em] text-xs">
              9. Changes to This Policy
            </h2>
            <p>
              We may update this Privacy Policy from time to time. When we do,
              we&apos;ll update the date and, where meaningful, let you know in
              the product or via email. If you keep using URGE after changes,
              you agree to the updated policy.
            </p>
          </div>

          <div className="border-2 border-[#27272a] bg-[#0a0a0a] p-5">
            <h2 className="text-white font-semibold mb-2 uppercase tracking-[0.2em] text-xs">
              10. Contact
            </h2>
            <p>
              For privacy questions or requests, email{" "}
              <span className="text-white font-semibold">
                privacy@useurge.app
              </span>
              . No legalese required—plain language is welcome.
            </p>
          </div>
        </section>

        <footer className="mt-12 text-[10px] text-[#52525b] uppercase tracking-[0.25em] flex justify-between gap-4">
          <span>URGE / PRIVACY FIRST</span>
          <Link href="/" className="text-[#a1a1aa] hover:text-white">
            BACK TO HOME
          </Link>
        </footer>
      </main>
    </div>
  );
}


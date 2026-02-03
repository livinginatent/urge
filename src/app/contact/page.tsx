import Link from "next/link";
import { NavBar } from "@/components/navbar";
import { ContactForm } from "@/components/contact-form";

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
          <ContactForm />

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


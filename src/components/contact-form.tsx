"use client";

import { useActionState, useEffect, useRef } from "react";
import { sendContactMessage } from "@/app/actions/contact";

export function ContactForm() {
  const [state, action, pending] = useActionState(sendContactMessage, undefined);
  const formRef = useRef<HTMLFormElement>(null);

  // Reset form on successful submission
  useEffect(() => {
    if (state?.success && formRef.current) {
      formRef.current.reset();
    }
  }, [state?.success]);

  return (
    <form
      ref={formRef}
      action={action}
      className="border-2 border-[#27272a] bg-[#0a0a0a] p-6 space-y-6"
    >
      {/* Success message */}
      {state?.success && state?.message && (
        <div className="p-3 border-2 border-[#E11D48] bg-[#E11D48]/10 text-[#E11D48] text-xs font-mono">
          {state.message}
        </div>
      )}

      {/* Error message */}
      {state?.message && !state?.success && (
        <div className="p-3 border-2 border-[#E11D48] bg-[#E11D48]/10 text-[#E11D48] text-xs font-mono">
          {state.message}
        </div>
      )}

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
        {state?.errors?.reason && (
          <p className="text-[#E11D48] text-xs font-mono mt-1">
            {state.errors.reason[0]}
          </p>
        )}
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
        {state?.errors?.email && (
          <p className="text-[#E11D48] text-xs font-mono mt-1">
            {state.errors.email[0]}
          </p>
        )}
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
        {state?.errors?.message && (
          <p className="text-[#E11D48] text-xs font-mono mt-1">
            {state.errors.message[0]}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={pending}
        className="w-full border-2 border-[#E11D48] bg-[#E11D48] text-white text-xs tracking-[0.3em] py-3 uppercase hover:bg-[#be123c] active:translate-x-[2px] active:translate-y-[2px] shadow-[4px_4px_0_0_#27272a] hover:shadow-[2px_2px_0_0_#27272a] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#E11D48]"
      >
        {pending ? "SENDING..." : "SEND THE MESSAGE"}
      </button>
    </form>
  );
}

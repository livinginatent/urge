"use client";

import * as React from "react";
import { motion, type Variants } from "framer-motion";
import { DISTRACTION_ACTIONS, type DistractionAction } from "@/lib/actions";

const breakerVariants: Variants = {
  idle: {
    scale: 1,
    boxShadow: [
      "0 0 40px rgba(225,29,72,0.45), 0 0 120px rgba(225,29,72,0.18)",
      "0 0 70px rgba(225,29,72,0.8), 0 0 180px rgba(225,29,72,0.35)",
      "0 0 40px rgba(225,29,72,0.45), 0 0 120px rgba(225,29,72,0.18)",
    ],
    transition: {
      duration: 3.2,
      repeat: Infinity,
      repeatType: "mirror",
    },
  },
  hover: {
    scale: 1.04,
    boxShadow:
      "0 0 95px rgba(225,29,72,0.95), 0 0 240px rgba(225,29,72,0.6)",
    transition: {
      duration: 0.22,
      ease: "easeOut",
    },
  },
  tap: {
    scale: 0.94,
    boxShadow: [
      "0 0 140px rgba(255,255,255,0.95), 0 0 280px rgba(225,29,72,0.95)",
      "0 0 80px rgba(225,29,72,0.95), 0 0 220px rgba(225,29,72,0.7)",
    ],
    transition: {
      duration: 0.24,
      ease: "easeOut",
    },
  },
};

type CircuitBreakerProps = {
  noContent?: boolean;
};

export function CircuitBreaker({ noContent = false }: CircuitBreakerProps) {
  const [action, setAction] = React.useState<DistractionAction | null>(null);

  const handlePress = () => {
    if (noContent) {
      const target = document.getElementById("subscription-section");
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      return;
    }

    const index = Math.floor(Math.random() * DISTRACTION_ACTIONS.length);
    setAction(DISTRACTION_ACTIONS[index]);
  };

  return (
    <div className="mb-12 w-full  flex flex-col items-center justify-center gap-6 py-10">
      <motion.button
        type="button"
        className="relative flex items-center justify-center w-56 h-56 sm:w-64 sm:h-64 md:w-72 md:h-72 rounded-full border-[6px] border-[#111827] bg-[#111111] cursor-pointer select-none font-mono text-xs sm:text-sm tracking-[0.35em] text-zinc-200 uppercase shadow-[0_0_40px_rgba(0,0,0,0.9)]"
        variants={breakerVariants}
        initial="idle"
        animate="idle"
        whileHover="hover"
        whileTap="tap"
        onClick={handlePress}
      >
        {/* Inner metal ring */}
        <span className="pointer-events-none absolute inset-4 rounded-full border-[3px] border-[#27272a] shadow-[inset_0_0_18px_rgba(0,0,0,0.9)]" />

        {/* Core glow plate */}
        <span className="pointer-events-none absolute inset-9 sm:inset-10 rounded-full border border-[#4b0f1c] bg-[#111111] shadow-[inset_0_0_28px_rgba(0,0,0,0.95)]" />

        {/* Label */}
        <span className="relative z-10">
          [ OVERRIDE ]
        </span>
      </motion.button>

      {action && !noContent && (
        <div className="max-w-xl px-6 text-center font-mono text-sm text-[#a1a1aa]">
          <p className="mb-2 text-xl tracking-[0.28em] text-[#52525b] uppercase">
            IMMEDIATE DISTRACTION PROTOCOL
          </p>
          {typeof action === "string" ? (
            <p className="text-3xl leading-relaxed">
              {action}
            </p>
          ) : (
            <div className="space-y-4">
              <p className="text-2xl leading-relaxed text-white mb-4">
                {action.title}
              </p>
              <a
                href={action.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-6 py-3 border-2 border-[#E11D48] bg-[#E11D48]/10 text-[#E11D48] font-bold uppercase tracking-widest text-sm hover:bg-[#E11D48]/20 transition-colors"
              >
                {action.type === "reddit" && "READ ON REDDIT"}
                {action.type === "wiki" && "READ ON WIKIPEDIA"}
                {action.type === "youtube" && "WATCH ON YOUTUBE"}
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}


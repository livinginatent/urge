"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { UrgeCounter } from "@/components/urge-counter";

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Scroll-linked opacity transforms
  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.15], [1, 0.95]);
  
  const frictionOpacity = useTransform(scrollYProgress, [0.1, 0.2, 0.4, 0.5], [0, 1, 1, 0]);
  const frictionY = useTransform(scrollYProgress, [0.1, 0.2], [50, 0]);
  
  const counterOpacity = useTransform(scrollYProgress, [0.35, 0.45, 0.6, 0.7], [0, 1, 1, 0]);
  const counterY = useTransform(scrollYProgress, [0.35, 0.45], [50, 0]);
  
  const blackoutOpacity = useTransform(scrollYProgress, [0.55, 0.65, 0.75, 0.85], [0, 1, 1, 0]);
  
  const subscriptionOpacity = useTransform(scrollYProgress, [0.75, 0.85], [0, 1]);
  const subscriptionY = useTransform(scrollYProgress, [0.75, 0.85], [80, 0]);

  return (
    <div ref={containerRef} className="relative">
      {/* Section 1: The Hook - Massive Hero */}
      <motion.section
        style={{ opacity: heroOpacity, scale: heroScale }}
        className="h-screen flex flex-col items-center justify-center px-6 sticky top-0"
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="text-center max-w-5xl"
        >
          <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-extrabold text-white tracking-brutal leading-[0.9] mb-8">
            EVERY
            <br />
            <span className="text-[#E11D48]">URGE</span>
            <br />
            HAS A COST
          </h1>
          
          <p className="text-[#52525b] text-lg md:text-xl max-w-xl mx-auto font-mono">
            What you don&apos;t pay in dollars, you pay in discipline.
          </p>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-12 flex flex-col items-center gap-2"
        >
          <span className="text-[10px] text-[#52525b] tracking-[0.3em] uppercase">Scroll</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="w-px h-8 bg-gradient-to-b from-[#E11D48] to-transparent"
          />
        </motion.div>
      </motion.section>

      {/* Section 2: The Friction - Focused text reveals */}
      <motion.section
        style={{ opacity: frictionOpacity, y: frictionY }}
        className="h-screen flex flex-col items-center justify-center px-6 sticky top-0"
      >
        <div className="text-center max-w-3xl space-y-12">
          <p className="text-2xl md:text-4xl text-white font-bold tracking-tight leading-relaxed">
            You&apos;ve tried willpower.
            <br />
            <span className="text-[#52525b]">It didn&apos;t work.</span>
          </p>
          
          <p className="text-xl md:text-2xl text-[#a1a1aa] leading-relaxed">
            Because <span className="text-white font-semibold">willpower is free</span>.
            <br />
            And free things have no weight.
          </p>

          <p className="text-lg text-[#52525b]">
            What if giving in cost you something?
            <br />
            <span className="text-[#E11D48] font-bold">Even just $1.</span>
          </p>
        </div>
      </motion.section>

      {/* Section 3: The Counter */}
      <motion.section
        style={{ opacity: counterOpacity, y: counterY }}
        className="h-screen flex flex-col items-center justify-center px-6 sticky top-0"
      >
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight mb-4">
            YOUR STREAK
          </h2>
          <p className="text-[#52525b] text-sm tracking-wide">
            Every second counts. Every urge resisted is a victory.
          </p>
        </div>
        
        <UrgeCounter startFrom={86400} />
        
        <div className="mt-16 flex gap-4">
          <Button variant="outline" size="lg">
            I HELD STRONG
          </Button>
          <Button variant="destructive" size="lg">
            I GAVE IN
          </Button>
        </div>
      </motion.section>

      {/* Section 4: The Blackout */}
      <motion.section
        style={{ opacity: blackoutOpacity }}
        className="h-screen flex flex-col items-center justify-center px-6 sticky top-0 overflow-hidden"
      >
        {/* Blurred background elements */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="grid grid-cols-3 gap-8 blur-blackout scale-150">
            {[...Array(9)].map((_, i) => (
              <div
                key={i}
                className="w-32 h-32 md:w-48 md:h-48 bg-gradient-to-br from-[#E11D48]/20 to-transparent"
              />
            ))}
          </div>
        </div>

        {/* Focus content */}
        <div className="relative z-10 text-center max-w-2xl">
          <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tight mb-8">
            BLOCK OUT
            <br />
            <span className="text-[#E11D48]">THE NOISE</span>
          </h2>
          
          <p className="text-[#a1a1aa] text-lg md:text-xl leading-relaxed mb-8">
            Distractions multiply. Temptations compound.
            <br />
            <span className="text-white">Focus is the only currency that matters.</span>
          </p>

          {/* Visual mask effect */}
          <div className="relative mx-auto w-64 h-64 md:w-80 md:h-80">
            <div className="absolute inset-0 bg-[#050505] rounded-full" />
            <div className="absolute inset-4 border-2 border-[#27272a] rounded-full flex items-center justify-center">
              <div className="absolute inset-8 border border-[#27272a] rounded-full" />
              <span className="text-6xl md:text-8xl font-bold text-[#E11D48]">1</span>
            </div>
            <div className="absolute -inset-4 border border-[#1a1a1a] rounded-full" />
          </div>
          
          <p className="mt-8 text-[#52525b] text-sm">
            One focus. One goal. One dollar.
          </p>
        </div>
      </motion.section>

      {/* Section 5: The Subscription - Dead simple */}
      <motion.section
        style={{ opacity: subscriptionOpacity, y: subscriptionY }}
        className="min-h-screen flex flex-col items-center justify-center px-6 py-24 sticky top-0"
      >
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight mb-4">
            THE DEAL
          </h2>
          <p className="text-[#52525b]">No tiers. No gimmicks. One choice.</p>
        </div>

        <Card className="max-w-md w-full">
          <CardHeader>
            <CardDescription className="text-[#52525b] uppercase tracking-widest text-xs">
              Monthly Commitment
            </CardDescription>
            <CardTitle className="flex items-baseline gap-1">
              <span className="text-6xl md:text-7xl text-[#E11D48]">$1</span>
              <span className="text-[#52525b] text-xl">/mo</span>
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <p className="text-[#a1a1aa] text-sm leading-relaxed">
              That&apos;s the cost of a single moment of weakness.
            </p>
            
            <ul className="space-y-3 text-sm">
              {[
                "Track every urge",
                "Log every victory",
                "Build your streak",
                "Face your data",
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-[#a1a1aa]">
                  <span className="w-1 h-1 bg-[#E11D48]" />
                  {item}
                </li>
              ))}
            </ul>

            <div className="pt-4 border-t border-[#27272a]">
              <p className="text-[10px] text-[#52525b] uppercase tracking-widest mb-2">
                The real question:
              </p>
              <p className="text-white font-semibold">
                What does your habit cost you?
              </p>
            </div>
          </CardContent>
          
          <CardFooter className="flex-col gap-4 border-t-0 pt-0">
            <Button variant="commitment" size="xl" className="w-full">
              MAKE THE COMMITMENT
            </Button>
            <p className="text-[10px] text-[#52525b] text-center">
              Cancel anytime. But why would you?
            </p>
          </CardFooter>
        </Card>

        {/* Final message */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-24 text-center"
        >
          <p className="text-[#52525b] text-sm mb-4">
            Every habit has a price. Pay it now, or pay it later.
          </p>
          <p className="text-white font-bold text-lg">
            <span className="text-[#E11D48]">$1/month</span> is cheaper than regret.
          </p>
        </motion.div>
      </motion.section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-[#27272a]">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div>
            <span className="text-white font-bold text-xl tracking-tight">URGE</span>
            <p className="text-[#52525b] text-xs mt-1">Break the cycle.</p>
          </div>
          
          <div className="flex items-center gap-6 text-[#52525b] text-xs">
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>
          
          <p className="text-[#27272a] text-xs">
            © 2026 URGE
          </p>
        </div>
      </footer>
    </div>
  );
}

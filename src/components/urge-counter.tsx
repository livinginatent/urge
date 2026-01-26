"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface UrgeCounterProps {
  label?: string;
  startFrom?: number;
  countUp?: boolean;
  showMilliseconds?: boolean;
}

export function UrgeCounter({
  label = "TIME SINCE LAST URGE",
  startFrom = 0,
  countUp = true,
  showMilliseconds = true,
}: UrgeCounterProps) {
  const [time, setTime] = useState(startFrom);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime((prev) => (countUp ? prev + 1 : Math.max(0, prev - 1)));
    }, 1000);

    return () => clearInterval(interval);
  }, [countUp]);

  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return {
      hours: hours.toString().padStart(2, "0"),
      minutes: minutes.toString().padStart(2, "0"),
      seconds: seconds.toString().padStart(2, "0"),
    };
  };

  const { hours, minutes, seconds } = formatTime(time);

  const [milliseconds, setMilliseconds] = useState(0);

  useEffect(() => {
    if (!showMilliseconds) return;
    
    const msInterval = setInterval(() => {
      setMilliseconds((prev) => (prev + 1) % 100);
    }, 10);

    return () => clearInterval(msInterval);
  }, [showMilliseconds]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="flex flex-col items-center gap-4"
    >
      {/* Label */}
      <span className="text-[#52525b] text-xs tracking-[0.3em] uppercase font-medium">
        {label}
      </span>

      {/* Timer Display */}
      <div className="relative">
        {/* Glow effect */}
        <div className="absolute inset-0 blur-2xl bg-[#E11D48]/20 scale-150" />
        
        {/* Main counter */}
        <div className="relative flex items-baseline gap-1 font-mono">
          {/* Hours */}
          <div className="flex flex-col items-center">
            <motion.span
              key={hours}
              initial={{ opacity: 0.5, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-6xl md:text-8xl lg:text-9xl font-bold text-white counter-digit tracking-tighter"
            >
              {hours}
            </motion.span>
            <span className="text-[10px] text-[#52525b] tracking-widest mt-1">HRS</span>
          </div>

          <span className="text-4xl md:text-6xl lg:text-7xl text-[#E11D48] font-bold animate-pulse">:</span>

          {/* Minutes */}
          <div className="flex flex-col items-center">
            <motion.span
              key={minutes}
              initial={{ opacity: 0.5, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-6xl md:text-8xl lg:text-9xl font-bold text-white counter-digit tracking-tighter"
            >
              {minutes}
            </motion.span>
            <span className="text-[10px] text-[#52525b] tracking-widest mt-1">MIN</span>
          </div>

          <span className="text-4xl md:text-6xl lg:text-7xl text-[#E11D48] font-bold animate-pulse">:</span>

          {/* Seconds */}
          <div className="flex flex-col items-center">
            <motion.span
              key={seconds}
              initial={{ opacity: 0.5, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-6xl md:text-8xl lg:text-9xl font-bold text-white counter-digit tracking-tighter"
            >
              {seconds}
            </motion.span>
            <span className="text-[10px] text-[#52525b] tracking-widest mt-1">SEC</span>
          </div>

          {/* Milliseconds */}
          {showMilliseconds && (
            <>
              <span className="text-2xl md:text-3xl lg:text-4xl text-[#27272a] font-bold self-start mt-4">.</span>
              <div className="flex flex-col items-center self-start mt-4">
                <span className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#52525b] counter-digit tracking-tighter">
                  {milliseconds.toString().padStart(2, "0")}
                </span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Status indicator */}
      <div className="flex items-center gap-2 mt-2">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E11D48] opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#E11D48]"></span>
        </span>
        <span className="text-[10px] text-[#52525b] tracking-widest uppercase">Active</span>
      </div>
    </motion.div>
  );
}

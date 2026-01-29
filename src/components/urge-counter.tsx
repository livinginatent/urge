"use client";

import { useState, useEffect, useTransition } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

interface UrgeCounterProps {
  label?: string;
  startFrom?: number;
  countUp?: boolean;
  showMilliseconds?: boolean;
  showDaysMonths?: boolean;
  autoStart?: boolean;
  onStart?: () => Promise<void>;
}

export function UrgeCounter({
  label = "TIME SINCE LAST URGE",
  startFrom = 0,
  countUp = true,
  showMilliseconds = true,
  showDaysMonths = false,
  autoStart = true,
  onStart,
}: UrgeCounterProps) {
  const [time, setTime] = useState(startFrom);
  const [isRunning, setIsRunning] = useState(autoStart);
  const [isPending, startTransition] = useTransition();

  // Reset counter when startFrom changes (e.g., after relapse)
  useEffect(() => {
    setTime(startFrom);
    setIsRunning(startFrom > 0 && autoStart);
  }, [startFrom, autoStart]);

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setTime((prev) => (countUp ? prev + 1 : Math.max(0, prev - 1)));
    }, 1000);

    return () => clearInterval(interval);
  }, [countUp, isRunning]);

  const formatTime = (totalSeconds: number) => {
    const secondsInMinute = 60;
    const secondsInHour = 60 * secondsInMinute;
    const secondsInDay = 24 * secondsInHour;
    const secondsInMonth = 30 * secondsInDay; // approximate 30-day month

    const months = Math.floor(totalSeconds / secondsInMonth);
    const days = Math.floor(
      (totalSeconds % secondsInMonth) / secondsInDay,
    );
    const hours = Math.floor(
      (totalSeconds % secondsInDay) / secondsInHour,
    );
    const minutes = Math.floor(
      (totalSeconds % secondsInHour) / secondsInMinute,
    );
    const seconds = totalSeconds % secondsInMinute;

    return {
      months,
      days,
      hours: hours.toString().padStart(2, "0"),
      minutes: minutes.toString().padStart(2, "0"),
      seconds: seconds.toString().padStart(2, "0"),
    };
  };

  const { months, days, hours, minutes, seconds } = formatTime(time);

  const [milliseconds, setMilliseconds] = useState(0);

  useEffect(() => {
    if (!showMilliseconds || !isRunning) return;
    
    const msInterval = setInterval(() => {
      setMilliseconds((prev) => (prev + 1) % 100);
    }, 10);

    return () => clearInterval(msInterval);
  }, [showMilliseconds, isRunning]);

  const handleStart = () => {
    if (isRunning || !onStart) {
      setIsRunning(true);
      return;
    }

    startTransition(async () => {
      try {
        await onStart();
        setIsRunning(true);
      } catch (error) {
        console.error("[UrgeCounter] Failed to start streak", error);
      }
    });
  };

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
          {/* Months (only show if enabled and > 0) */}
          {showDaysMonths && months > 0 && (
            <div className="flex flex-col items-center mr-2">
              <motion.span
                key={`m-${months}`}
                initial={{ opacity: 0.5, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-3xl md:text-4xl lg:text-5xl font-bold text-white counter-digit tracking-tighter"
              >
                {months}
              </motion.span>
              <span className="text-[10px] text-[#52525b] tracking-widest mt-1">
                MO
              </span>
            </div>
          )}

          {/* Days (only show if enabled and > 0 or we have months) */}
          {showDaysMonths && (months > 0 || days > 0) && (
            <div className="flex flex-col items-center mr-4">
              <motion.span
                key={`d-${days}`}
                initial={{ opacity: 0.5, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-3xl md:text-4xl lg:text-5xl font-bold text-white counter-digit tracking-tighter"
              >
                {days.toString().padStart(2, "0")}
              </motion.span>
              <span className="text-[10px] text-[#52525b] tracking-widest mt-1">
                DAYS
              </span>
            </div>
          )}

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

      {/* Status / Controls */}
      <div className="flex flex-col items-center gap-3 mt-4">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            {isRunning && (
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E11D48] opacity-75" />
            )}
            <span
              className={`relative inline-flex rounded-full h-2 w-2 ${
                isRunning ? "bg-[#E11D48]" : "bg-[#27272a]"
              }`}
            />
          </span>
          <span className="text-[10px] text-[#52525b] tracking-widest uppercase">
            {isRunning ? "ACTIVE" : "PAUSED"}
          </span>
        </div>

        {!isRunning && (
          <Button
            type="button"
            variant="commitment"
            size="lg"
            className="px-8"
            onClick={handleStart}
            disabled={isPending}
          >
            {isPending ? "STARTING..." : "START MY STREAK"}
          </Button>
        )}
      </div>
    </motion.div>
  );
}

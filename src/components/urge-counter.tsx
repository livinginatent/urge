"use client";

import { useState, useEffect, useTransition, useCallback, useRef } from "react";
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
  showShareButton?: boolean;
}

export function UrgeCounter({
  label = "TIME SINCE LAST URGE",
  startFrom = 0,
  countUp = true,
  showMilliseconds = true,
  showDaysMonths = false,
  autoStart = true,
  onStart,
  showShareButton = false,
}: UrgeCounterProps) {
  const [time, setTime] = useState(startFrom);
  const [isRunning, setIsRunning] = useState(autoStart);
  const [isPending, startTransition] = useTransition();
  const [isSharing, setIsSharing] = useState(false);
  const counterRef = useRef<HTMLDivElement>(null);

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

  // Generate shareable image using Canvas
  const generateShareImage = useCallback(async (): Promise<Blob | null> => {
    const { months: m, days: d, hours: h, minutes: min, seconds: s } = formatTime(time);
    
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    // Set canvas size (optimized for social media)
    canvas.width = 1200;
    canvas.height = 630;

    // Background
    ctx.fillStyle = "#050505";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add subtle border
    ctx.strokeStyle = "#27272a";
    ctx.lineWidth = 4;
    ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);

    // Add corner accent
    ctx.fillStyle = "#E11D48";
    ctx.fillRect(20, 20, 100, 4);
    ctx.fillRect(20, 20, 4, 100);

    // Title text
    ctx.fillStyle = "#52525b";
    ctx.font = "bold 24px monospace";
    ctx.textAlign = "center";
    ctx.fillText("MY STREAK", canvas.width / 2, 100);

    // Main time display
    ctx.font = "bold 120px monospace";
    ctx.textAlign = "center";
    
    // Build time string
    let timeStr = "";
    let labelStr = "";
    
    if (showDaysMonths && (m > 0 || d > 0)) {
      if (m > 0) {
        timeStr = `${m}M ${d.toString().padStart(2, "0")}D `;
        labelStr = "months • days • ";
      } else {
        timeStr = `${d.toString().padStart(2, "0")}D `;
        labelStr = "days • ";
      }
    }
    
    timeStr += `${h}:${min}:${s}`;
    labelStr += "hrs • min • sec";

    // Draw time with gradient effect
    ctx.fillStyle = "#ffffff";
    ctx.fillText(timeStr, canvas.width / 2, canvas.height / 2 + 20);

    // Labels below time
    ctx.fillStyle = "#52525b";
    ctx.font = "16px monospace";
    ctx.fillText(labelStr.toUpperCase(), canvas.width / 2, canvas.height / 2 + 70);

    // URGE branding
    ctx.fillStyle = "#E11D48";
    ctx.font = "bold 32px monospace";
    ctx.fillText("URGE", canvas.width / 2, canvas.height - 80);

    // Tagline
    ctx.fillStyle = "#52525b";
    ctx.font = "14px monospace";
    ctx.fillText("urges.app • Break the cycle", canvas.width / 2, canvas.height - 50);

    // Convert to blob
    return new Promise((resolve) => {
      canvas.toBlob((blob) => resolve(blob), "image/png", 1.0);
    });
  }, [time, showDaysMonths]);

  // Share handler
  const handleShare = useCallback(async () => {
    setIsSharing(true);
    
    try {
      const imageBlob = await generateShareImage();
      if (!imageBlob) {
        console.error("Failed to generate share image");
        setIsSharing(false);
        return;
      }

      const { months: m, days: d, hours: h, minutes: min, seconds: s } = formatTime(time);
      let streakText = "";
      if (showDaysMonths && m > 0) {
        streakText = `${m} months, ${d} days, ${h}:${min}:${s}`;
      } else if (showDaysMonths && d > 0) {
        streakText = `${d} days, ${h}:${min}:${s}`;
      } else {
        streakText = `${h}:${min}:${s}`;
      }

      const shareText = `🔥 My current streak: ${streakText}\n\nBuilding discipline one moment at a time.\n\n#URGE #Discipline #Streak`;
      const shareUrl = "https://urges.app";

      // Try Web Share API first (works on mobile and some desktop browsers)
      if (navigator.share && navigator.canShare) {
        const file = new File([imageBlob], "urge-streak.png", { type: "image/png" });
        const shareData = {
          title: "My URGE Streak",
          text: shareText,
          url: shareUrl,
          files: [file],
        };

        if (navigator.canShare(shareData)) {
          await navigator.share(shareData);
          setIsSharing(false);
          return;
        }

        // Try sharing without files if files aren't supported
        const textShareData = {
          title: "My URGE Streak",
          text: shareText,
          url: shareUrl,
        };

        if (navigator.canShare(textShareData)) {
          await navigator.share(textShareData);
          setIsSharing(false);
          return;
        }
      }

      // Fallback: Download image
      const url = URL.createObjectURL(imageBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "urge-streak.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      // Copy text to clipboard
      await navigator.clipboard.writeText(shareText + "\n" + shareUrl);
      alert("Image downloaded! Share text copied to clipboard.");
    } catch (error) {
      // User cancelled or error occurred
      if ((error as Error).name !== "AbortError") {
        console.error("Share failed:", error);
      }
    } finally {
      setIsSharing(false);
    }
  }, [generateShareImage, time, showDaysMonths]);

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
      <div className="relative overflow-hidden">
        {/* Glow effect */}
        <div className="absolute inset-0 blur-2xl bg-[#E11D48]/20 scale-150 pointer-events-none" />
        
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

        <div className="flex items-center gap-3">
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

          {/* {showShareButton && isRunning && (
            <Button
              type="button"
              variant="outline"
              size="lg"
              className="px-6 gap-2"
              onClick={handleShare}
              disabled={isSharing}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="18" cy="5" r="3" />
                <circle cx="6" cy="12" r="3" />
                <circle cx="18" cy="19" r="3" />
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
              </svg>
              {isSharing ? "SHARING..." : "SHARE"}
            </Button>
          )} */}
        </div>
      </div>
    </motion.div>
  );
}

"use client";

import React, { useState, useEffect } from "react";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface CountdownTimerProps {
  targetDate?: Date;
  className?: string;
  size?: "sm" | "md" | "lg";
  color?: "dark" | "light";
  useInstrumentFont?: boolean;
  shadow?: "none" | "soft";
}

// Function to get September 29th, 2025
function getStartupWeekDate(): Date {
  // September 29th, 2025 at 9:00 AM
  return new Date(2025, 8, 29, 9, 0, 0); // Month is 0-indexed, so 8 = September
}

export default function CountdownTimer({
  targetDate,
  className = "",
  size = "md",
  color = "dark",
  useInstrumentFont = false,
  shadow = "none",
}: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isClient, setIsClient] = useState(false);
  const [actualTargetDate, setActualTargetDate] = useState<Date | null>(null);

  useEffect(() => {
    setIsClient(true);
    const target = targetDate || getStartupWeekDate();
    setActualTargetDate(target);
  }, [targetDate]);

  useEffect(() => {
    if (!isClient || !actualTargetDate) return;

    const calculateTimeLeft = (): TimeLeft => {
      const now = new Date().getTime();
      const target = actualTargetDate.getTime();
      const difference = target - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor(
          (difference % (1000 * 60 * 60)) / (1000 * 60)
        );
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        return { days, hours, minutes, seconds };
      }

      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    };

    // Calculate initial time
    const initialTime = calculateTimeLeft();
    setTimeLeft(initialTime);

    // Update every second
    const timer = setInterval(() => {
      const newTimeLeft = calculateTimeLeft();
      setTimeLeft(newTimeLeft);
    }, 1000);

    return () => clearInterval(timer);
  }, [actualTargetDate, isClient]);

  // Map sizes
  const numberSizeClass =
    size === "lg"
      ? "text-6xl md:text-7xl"
      : size === "sm"
      ? "text-3xl md:text-4xl"
      : "text-4xl md:text-6xl";

  const labelSizeClass = size === "sm" ? "text-[10px]" : "text-xs";
  const numberColorClass = color === "light" ? "text-white" : "text-[#444444]";
  const labelColorClass =
    color === "light" ? "text-white/85" : "text-[#5a5a5a]";
  const separatorColorClass =
    color === "light" ? "bg-white/60" : "bg-[#444444]/40";
  const numberFontStyle: React.CSSProperties | undefined = useInstrumentFont
    ? { fontFamily: 'var(--font-instrument), "Instrument Serif", serif' }
    : undefined;
  const numberShadowStyle: React.CSSProperties | undefined =
    shadow === "soft"
      ? {
          textShadow:
            color === "light"
              ? "0 1px 1px rgba(0,0,0,0.35)"
              : "0 1px 1px rgba(255,255,255,0.6)",
        }
      : undefined;

  // Prevent hydration mismatch by showing loading state
  if (!isClient || !actualTargetDate) {
    return (
      <div
        className={`flex items-center justify-center gap-6 md:gap-8 ${className}`}
      >
        <div className="animate-pulse h-10 md:h-12 w-16 md:w-20 bg-gray-200 rounded" />
        <div className="animate-pulse h-10 md:h-12 w-16 md:w-20 bg-gray-200 rounded" />
        <div className="animate-pulse h-10 md:h-12 w-16 md:w-20 bg-gray-200 rounded" />
        <div className="animate-pulse h-10 md:h-12 w-16 md:w-20 bg-gray-200 rounded" />
      </div>
    );
  }

  const timeUnits = [
    { value: timeLeft.days, label: "Days" },
    { value: timeLeft.hours, label: "Hours" },
    { value: timeLeft.minutes, label: "Minutes" },
    { value: timeLeft.seconds, label: "Seconds" },
  ];

  return (
    <div className={`px-0 ${className}`}>
      <div className="flex items-end justify-center gap-6 md:gap-10">
        <div className="text-center w-16 md:w-20">
          <div
            style={{ ...numberFontStyle, ...numberShadowStyle }}
            className={`tabular-nums ${numberSizeClass} font-light leading-none ${numberColorClass}`}
          >
            {timeUnits[0].value.toString().padStart(2, "0")}
          </div>
          <div
            className={`${labelSizeClass} font-inter ${labelColorClass} mt-2 tracking-wide`}
          >
            DAYS
          </div>
        </div>
        <div className={`w-px h-8 md:h-10 ${separatorColorClass}`} />
        <div className="text-center w-16 md:w-20">
          <div
            style={{ ...numberFontStyle, ...numberShadowStyle }}
            className={`tabular-nums ${numberSizeClass} font-light leading-none ${numberColorClass}`}
          >
            {timeUnits[1].value.toString().padStart(2, "0")}
          </div>
          <div
            className={`${labelSizeClass} font-inter ${labelColorClass} mt-2 tracking-wide`}
          >
            HOURS
          </div>
        </div>
        <div className={`w-px h-8 md:h-10 ${separatorColorClass}`} />
        <div className="text-center w-16 md:w-20">
          <div
            style={{ ...numberFontStyle, ...numberShadowStyle }}
            className={`tabular-nums ${numberSizeClass} font-light leading-none ${numberColorClass}`}
          >
            {timeUnits[2].value.toString().padStart(2, "0")}
          </div>
          <div
            className={`${labelSizeClass} font-inter ${labelColorClass} mt-2 tracking-wide`}
          >
            MINUTES
          </div>
        </div>
        <div className={`w-px h-8 md:h-10 ${separatorColorClass}`} />
        <div className="text-center w-16 md:w-20">
          <div
            style={{ ...numberFontStyle, ...numberShadowStyle }}
            className={`tabular-nums ${numberSizeClass} font-light leading-none ${numberColorClass}`}
          >
            {timeUnits[3].value.toString().padStart(2, "0")}
          </div>
          <div
            className={`${labelSizeClass} font-inter ${labelColorClass} mt-2 tracking-wide`}
          >
            SECONDS
          </div>
        </div>
      </div>
    </div>
  );
}

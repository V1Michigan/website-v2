"use client";

import { useState, useEffect } from "react";
import YCBannerBackground from "./yc-banner-bg";

export default function YCBanner({ enabled }: { enabled: boolean }) {
  const [daysLeft, setDaysLeft] = useState<number | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    const calculateDaysLeft = () => {
      const targetDate = new Date(2026, 1, 19); // February 19, 2026 (month is 0-indexed)
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();
      const days = Math.ceil(difference / (1000 * 60 * 60 * 24));
      return days > 0 ? days : 0;
    };

    setDaysLeft(calculateDaysLeft());
    
    // Update daily at midnight
    const now = new Date();
    const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    const timeUntilMidnight = tomorrow.getTime() - now.getTime();
    
    const midnightTimer = setTimeout(() => {
      setDaysLeft(calculateDaysLeft());
      
      // Set up daily interval after first midnight
      const dailyInterval = setInterval(() => {
        setDaysLeft(calculateDaysLeft());
      }, 24 * 60 * 60 * 1000);
      
      return () => clearInterval(dailyInterval);
    }, timeUntilMidnight);

    return () => clearTimeout(midnightTimer);
  }, []);

  if (!enabled) {
    return (<></>);
  }

  return (
    <div className="relative py-2 px-6 text-center shadow-lg overflow-hidden">
      <YCBannerBackground className="absolute inset-0 z-0 w-full h-full" />
      <div className="relative z-10 max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4">
        <div className="flex items-center gap-2">
          <span className="text-lg font-inter font-semibold text-white leading-relaxed">
            Y Combinator is coming to campus{isClient && daysLeft !== null && daysLeft > 0 && (
              <> in <span className="inline-block mx-1 px-2 py-0.5 bg-white/20 rounded-md font-bold">{daysLeft}</span> {daysLeft === 1 ? 'day' : 'days'}</>
            )}!
          </span>
        </div>
        <div className="flex items-center gap-3">
          <a
            href="https://www.v1michigan.com/yc-w26?utm_source=website"
            className="inline-flex items-center gap-2 px-3 py-2 bg-white/10 text-white rounded-full text-sm font-inter font-medium hover:bg-white/20 transition-all duration-200 border border-white/20 hover:border-white/30 ring-1 ring-white/15 ring-inset"
          >
            <span>RSVP</span>
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </a>
          <a
            href="https://www.v1michigan.com/yc-w26-coffee-chats?utm_source=website"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-3 py-2 bg-white/10 text-white rounded-full text-sm font-inter font-medium hover:bg-white/20 transition-all duration-200 border border-white/20 hover:border-white/30 ring-1 ring-white/15 ring-inset"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span>Coffee Chat YC</span>
          </a>
        </div>
      </div>
    </div>
  )
}

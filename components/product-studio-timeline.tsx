"use client";

import { useEffect, useState } from "react";

const timelineEvents = [
  {
    date: "MON · AUG 31",
    title: "Festifall North",
    location: "North Campus",
    time: "5:00–8:00 PM",
    endsAt: "2026-08-31T20:00:00-04:00",
  },
  {
    date: "WED · SEP 2",
    title: "Festifall Central",
    location: "Central Campus",
    time: "3:00–8:00 PM",
    endsAt: "2026-09-02T20:00:00-04:00",
  },
  {
    date: "FRI · SEP 4",
    title: "Product Studio Open House",
    location: "Michigan League · Room 4",
    time: "6:00–8:00 PM",
    endsAt: "2026-09-04T20:00:00-04:00",
  },
  {
    date: "MON · SEP 7",
    title: "Internship Panel",
    location: "North Quad · 1255",
    time: "7:30–9:00 PM",
    endsAt: "2026-09-07T21:00:00-04:00",
  },
  {
    date: "TUE · SEP 8",
    title: "Women in Entrepreneurship",
    location: "Six11 Rooftop",
    time: "5:00–7:00 PM",
    endsAt: "2026-09-08T19:00:00-04:00",
  },
  {
    date: "FRI · SEP 11",
    title: "Kickoff",
    location: "Blau Colloquium",
    time: "6:00–8:00 PM",
    endsAt: "2026-09-11T20:00:00-04:00",
  },
  {
    date: "SAT · SEP 12",
    title: "Applications Due",
    location: null,
    time: "11:59 PM",
    endsAt: "2026-09-12T23:59:00-04:00",
  },
] as const;

export default function ProductStudioTimeline() {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    const updateNow = () => setNow(Date.now());
    updateNow();

    const timer = window.setInterval(updateNow, 60_000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="mx-auto mb-8 w-full max-w-7xl overflow-x-auto rounded-2xl border border-[#444444]/15 bg-[#FAF7F2]/85 px-4 py-5 shadow-sm backdrop-blur-sm sm:px-6">
      <ol className="relative grid min-w-[1050px] grid-cols-7 before:absolute before:left-[7.14%] before:right-[7.14%] before:top-[9px] before:h-0.5 before:bg-[#444444]/25">
        {timelineEvents.map((event) => {
          const hasPassed = now !== null && now > new Date(event.endsAt).getTime();

          return (
            <li key={event.title} className="relative flex flex-col items-center px-2 text-center">
              <span
                className={`relative z-10 mb-3 h-5 w-5 rounded-full border-2 transition-colors ${
                  hasPassed
                    ? "border-yellow-400 bg-yellow-400"
                    : "border-[#444444] bg-[#FAF7F2]"
                }`}
                aria-label={hasPassed ? "Event completed" : "Upcoming event"}
              />
              <p className="mb-1 font-inter text-[10px] font-bold tracking-[0.12em] text-[#6B6865]">
                {event.date}
              </p>
              <h3 className="min-h-10 font-inter text-xs font-bold leading-4 text-[#191919]">
                {event.title}
              </h3>
              <p className="mt-1 min-h-4 font-inter text-[10px] leading-4 text-[#444444]">
                {event.location}
              </p>
              <p className="font-inter text-[10px] font-semibold leading-4 text-[#444444]">
                {event.time}
              </p>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

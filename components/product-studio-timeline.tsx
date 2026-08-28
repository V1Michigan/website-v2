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
    <div className="w-full overflow-x-auto border-t border-[#444444]/15 bg-transparent px-4 py-2.5 sm:px-6">
      <ol className="relative mx-auto grid min-w-[1050px] max-w-7xl grid-cols-7 drop-shadow-[0_1px_1px_rgba(250,247,242,0.95)] before:absolute before:left-[7.14%] before:right-[7.14%] before:top-[7px] before:h-0.5 before:bg-[#444444]/30">
        {timelineEvents.map((event) => {
          const hasPassed = now !== null && now > new Date(event.endsAt).getTime();

          return (
            <li key={event.title} className="relative flex flex-col items-center px-2 text-center">
              <span
                className={`relative z-10 mb-2 h-4 w-4 rounded-full border-2 transition-colors ${
                  hasPassed
                    ? "border-yellow-400 bg-yellow-400"
                    : "border-[#444444] bg-[#FAF7F2]"
                }`}
                aria-label={hasPassed ? "Event completed" : "Upcoming event"}
              />
              <p className="mb-0.5 font-inter text-[10px] font-bold tracking-[0.12em] text-[#6B6865]">
                {event.date}
              </p>
              <h3 className="font-inter text-[11px] font-bold leading-3.5 text-[#191919]">
                {event.title}
              </h3>
              <p className="mt-0.5 font-inter text-[10px] leading-3 text-[#444444]">
                {event.location}
              </p>
              <p className="font-inter text-[10px] font-semibold leading-3 text-[#444444]">
                {event.time}
              </p>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

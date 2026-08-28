"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

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
    <div className="w-full overflow-x-auto border-y border-[#444444]/15 bg-[#FAF7F2]/95 px-4 py-2.5 shadow-[0_-10px_30px_rgba(25,25,25,0.08)] backdrop-blur-md sm:px-6">
      <div className="relative mx-auto min-w-[1050px] max-w-7xl">
        <motion.div
          aria-hidden
          className="absolute left-[7.14%] right-[7.14%] top-[7px] h-0.5 origin-left bg-[#444444]/25"
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
        />

        <motion.ol
          className="relative grid grid-cols-7"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: { staggerChildren: 0.12, delayChildren: 0.2 },
            },
          }}
        >
        {timelineEvents.map((event) => {
          const hasPassed = now !== null && now > new Date(event.endsAt).getTime();

          return (
            <motion.li
              key={event.title}
              className="relative flex flex-col items-center px-2 text-center"
              variants={{
                hidden: { opacity: 0, x: -14 },
                visible: {
                  opacity: 1,
                  x: 0,
                  transition: { duration: 0.45, ease: "easeOut" },
                },
              }}
            >
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
            </motion.li>
          );
        })}
        </motion.ol>
      </div>
    </div>
  );
}

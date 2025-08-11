"use client";

import { motion } from "framer-motion";
import EventCard from "./event-card";

interface Event {
  title: string;
  description: string;
  image: string;
}

interface EventsSectionProps {
  events: Event[];
}

export default function EventsSection({ events }: EventsSectionProps) {
  const container = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.08, delayChildren: 0.1 },
    },
  };
  const item = {
    hidden: { opacity: 0, y: 12 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.35 },
    },
  };
  return (
    <div className="max-w-7xl mx-auto p-10">
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {events.map((event, index) => (
          <motion.div key={index} variants={item}>
            <EventCard
              title={event.title}
              description={event.description}
              image={event.image}
            />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}

"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import CountdownTimer from "@/components/countdown-timer";
import { Lightbulb } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative w-full overflow-hidden">
      <div className="relative w-full min-h-[600px] md:min-h-[750px] lg:min-h-[810px]">
        {/* Main Content */}
        <div className="relative z-10 p-6 md:p-8 lg:p-12">
          {/* Title and Tagline */}
          <div className="mt-8 md:mt-12 lg:mt-16 max-w-2xl mx-auto text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="mb-6 text-5xl sm:text-6xl md:text-7xl lg:text-[9rem] font-instrument font-normal text-[#444444] leading-tight"
            >
              Startup Week
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
              className="font-inter font-normal text-base sm:text-lg md:text-xl text-[#444444] mb-4 self-stretch"
            >
              Where the best startups hire the best builders.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.45, ease: "easeOut", delay: 0.15 }}
              className="mb-10"
            >
              <CountdownTimer
                size="lg"
                color="dark"
                useInstrumentFont
                shadow="soft"
              />
            </motion.div>
            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.45, ease: "easeOut", delay: 0.2 }}
              className="flex justify-center mb-3"
            >
              <a
                href="https://tally.so/r/mJ4r1R"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-4 py-2 sm:px-5 sm:py-2.5 font-inter font-medium text-[#191919] bg-white/80 border border-white/90 rounded-md backdrop-blur-sm shadow-sm transition-colors hover:bg-white/90 focus:outline-none focus:ring-2 focus:ring-white/60"
              >
                <button className="px-8 py-3 sm:px-10 sm:py-3.5 min-w-[200px] sm:min-w-[240px] font-inter font-medium text-[#191919] bg-yellow-400 border border-yellow-400 rounded-md shadow-lg shadow-yellow-400/25 transition-all hover:bg-yellow-300 hover:shadow-yellow-400/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-300">
                  Apply Now!
                </button>
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.45, ease: "easeOut", delay: 0.25 }}
              className="flex justify-center mb-8"
            >
              <div className="bg-white/70 backdrop-blur-sm rounded-full px-3 py-1.5 flex items-center gap-1.5 shadow-xs border border-white/10">
                <Lightbulb className="w-3 h-3 text-[#444444] flex-shrink-0" />
                <p className="text-xs text-[#444444] font-normal">
                  Are you a founder?{" "}
                  <a
                    href="mailto:team@v1michigan.com"
                    className="text-[#444444] font-bold underline-offset-2 hover:underline transition-colors"
                  >
                    email us
                  </a>
                </p>
              </div>
            </motion.div>
          </div>
        </div>
        {/* Background Image */}
        <motion.div
          aria-hidden
          initial={{ scale: 1.05, opacity: 0.85 }}
          animate={{ scale: 1.0, opacity: 1 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0 overflow-hidden"
        >
          <Image
            src="/excluded.png"
            alt="People networking at startup event"
            fill
            className="object-cover grayscale transform-gpu origin-center scale-150 translate-x-[25%] -translate-y-[1%] md:translate-x-[25%] md:-translate-y-[-6%]"
            sizes="100vw"
            priority
          />
        </motion.div>

        {/* <div className="absolute bottom-0 left-0 right-0 h-58 sm:h-56 lg:h-64 bg-gradient-to-t from-[#FAF7F2] via-[#FAF7F2]/80 to-transparent z-20 pointer-events-none" /> */}
        {/* Scrolling Job Titles Banner */}
        <div className="absolute bottom-0 left-0 right-0 bg-yellow-400 py-3 overflow-hidden z-30">
          <div className="animate-scroll whitespace-nowrap">
            <span className="inline-block px-8 text-sm font-inter font-bold text-[#191919] leading-normal">
              PRODUCT MANAGER • UX DESIGNER • SWE • MOBILE ENGINEER • MACHINE
              LEARNING ENGINEER • GRAPHIC DESIGN • DATA SCIENTIST • DEVOPS
              ENGINEER • FRONTEND DEVELOPER • BACKEND DEVELOPER • FULL STACK
              ENGINEER • PRODUCT MANAGER • UX DESIGNER • SWE • MOBILE ENGINEER •
              MACHINE LEARNING ENGINEER • GRAPHIC DESIGN • DATA SCIENTIST •
              DEVOPS ENGINEER • FRONTEND DEVELOPER • BACKEND DEVELOPER • FULL
              STACK ENGINEER
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

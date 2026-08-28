"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Lightbulb } from "lucide-react";
import ProductStudioTimeline from "@/components/product-studio-timeline";

const tickerText =
  "IDEATE • VALIDATE • DESIGN • BUILD • SHIP • ITERATE • PRODUCT • ENGINEERING • DESIGN • STRATEGY";

export default function ProductStudioHeroSection() {
  return (
    <section className="relative w-full overflow-hidden bg-[#FAF7F2]">
      <div className="relative min-h-[780px] w-full md:min-h-[880px] lg:min-h-[920px]">
        <div className="relative z-10 p-6 md:p-8 lg:p-12">
          <div className="mx-auto mt-8 max-w-7xl text-center md:mt-12 lg:mt-16">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="mb-6 text-5xl font-instrument font-normal leading-tight text-[#444444] sm:text-6xl md:text-7xl lg:text-[8rem]"
            >
              Product Studio
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
              className="mx-auto mb-10 max-w-2xl text-base font-normal text-[#444444] sm:text-lg md:text-xl"
            >
              Turn an ambitious idea into a real product.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.5, ease: "easeOut", delay: 0.15 }}
            >
              <ProductStudioTimeline />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.45, ease: "easeOut", delay: 0.2 }}
              className="mb-3 flex flex-col items-center gap-2"
            >
              <a
                href="https://v1michigan.com/apply?utm_source=website"
                className="min-w-[240px] rounded-md border border-yellow-400 bg-yellow-400 px-8 py-3 font-inter font-medium text-[#191919] shadow-lg shadow-yellow-400/25 transition-colors hover:bg-yellow-300 hover:shadow-yellow-400/30 focus-visible:ring-yellow-300 sm:px-10 sm:py-3.5"
              >
                Apply to Product Studio
              </a>

              <Link
                href="/projects"
                className="inline-flex items-center rounded-full border border-white/30 bg-white/70 px-4 py-1.5 font-inter text-sm text-[#191919] shadow-xs backdrop-blur-sm transition-colors duration-300 hover:bg-yellow-400"
              >
                Explore student projects
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.45, ease: "easeOut", delay: 0.25 }}
              className="mb-8 flex justify-center"
            >
              <div className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/70 px-3 py-1.5 shadow-xs backdrop-blur-sm">
                <Lightbulb className="h-3 w-3 shrink-0 text-[#444444]" />
                <p className="text-xs font-normal text-[#444444]">
                  Questions about Product Studio?{" "}
                  <a
                    href="mailto:team@v1michigan.com"
                    className="font-bold text-[#444444] underline-offset-2 transition-colors hover:underline"
                  >
                    Email us
                  </a>
                </p>
              </div>
            </motion.div>
          </div>
        </div>

        <motion.div
          aria-hidden
          initial={{ opacity: 0.85 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-y-0 left-0 w-full overflow-hidden md:left-auto md:right-0 md:w-1/2"
        >
          <Image
            src="/join-v1/layers/02-people-1.png"
            alt=""
            fill
            className="object-cover object-[center_8%] grayscale opacity-80"
            sizes="100vw"
            priority
          />
        </motion.div>

        <motion.div
          aria-hidden
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-y-0 left-0 hidden w-1/2 overflow-hidden md:block"
        >
          <Image
            src="/join-v1/layers/04-people-2.png"
            alt=""
            fill
            className="object-cover object-[center_8%] grayscale opacity-75"
            sizes="(min-width: 768px) 42vw, 0px"
            priority
          />
        </motion.div>

        <div className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-b from-[#FAF7F2]/75 via-[#FAF7F2]/20 to-[#FAF7F2]" />

        <div className="absolute inset-x-0 bottom-0 z-30 overflow-hidden bg-yellow-400 py-3">
          <div className="animate-scroll whitespace-nowrap">
            <span className="inline-block px-8 font-inter text-sm font-bold leading-normal text-[#191919]">
              {tickerText} • {tickerText}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

export default function HeroSection() {
  return (
    <>
      {/* Promotional Banner */}
      {/* <div className="bg-gradient-to-r from-yellow-400 to-yellow-300 py-2 px-6 text-center shadow-lg border-b border-yellow-500/20">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-inter font-semibold text-[#191919] leading-relaxed">
              Applications for Product Studio's Fall 2025 batch are now open!
            </span>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="https://v1michigan.com/apply?utm_source=website"
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#191919] text-yellow-300 rounded-full text-sm font-inter font-bold hover:bg-[#000000] transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg"
            >
              <span>Apply now</span>
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
              href="https://v1michigan.com/product-studio/faq?utm_source=website"
              className="inline-flex items-center gap-2 px-3 py-2 bg-[#191919]/10 text-[#191919] rounded-full text-sm font-inter font-medium hover:bg-[#191919]/20 transition-all duration-200 border border-[#191919]/20 hover:border-[#191919]/40"
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
                  d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>FAQ</span>
            </a>
          </div>
        </div> */}
      {/* </div> */}

      <section className="relative my-4 mx-auto max-w-6xl overflow-hidden rounded-lg px-4 md:px-6 lg:px-8">
        <div className="relative aspect-[16/9] w-full">
          <motion.video
            src="/landing-video-v1.mp4"
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            className="rounded-lg object-cover w-full h-full"
            poster="/landing-video-img.png"
            initial={{ scale: 1.04, opacity: 0.9 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          />
          <motion.div
            className="absolute inset-0 bg-black/20 rounded-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          />
          <div className="absolute bottom-0 left-0 p-6 md:p-8 lg:p-10 text-white">
            <motion.h1
              className="mb-2 md:mb-8 lg:mb-10 text-4xl md:text-8xl lg:text-9xl font-instrument font-light"
              style={{
                fontFamily: 'var(--font-instrument), "Instrument Serif", serif',
              }}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              V1 @ Michigan
            </motion.h1>
            <motion.p
              className="max-w-3xl text-sm md:text-base lg:text-base"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.45, ease: "easeOut", delay: 0.05 }}
            >
              V1 is the premier builder community at the University of Michigan
              dedicated to supporting hackers and creators every step of the
              way.
            </motion.p>
            <motion.div
              className="mt-6 flex space-x-6"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.4, delay: 0.15 }}
            >
              <Link
                href="https://x.com/v1michigan"
                aria-label="X"
                className="text-white hover:text-gray-200"
              >
                <motion.div whileHover={{ scale: 1.06 }}>
                  <Image
                    src="/x.png"
                    alt="X"
                    width={24}
                    height={24}
                    className="h-6 w-6"
                  />
                </motion.div>
              </Link>
              <Link
                href="https://www.instagram.com/v1michigan/"
                aria-label="Instagram"
                className="text-white hover:text-gray-200"
              >
                <motion.div whileHover={{ scale: 1.06 }}>
                  <Image
                    src="/insta.png"
                    alt="Instagram"
                    width={24}
                    height={24}
                    className="h-6 w-6"
                  />
                </motion.div>
              </Link>
              <Link
                href="https://v1network.substack.com/"
                aria-label="Contact"
                className="text-white hover:text-gray-200"
              >
                <motion.div whileHover={{ scale: 1.06 }}>
                  <Image
                    src="/more.png"
                    alt="More"
                    width={24}
                    height={24}
                    className="h-6 w-6"
                  />
                </motion.div>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}

"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function HeroSection() {
  return (
    <section className="relative my-4 mx-auto max-w-6xl overflow-hidden rounded-lg px-4 md:px-6 lg:px-8">
      <div className="relative aspect-[16/9] w-full">
        <motion.video
          src="/landing-video.mp4"
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
            dedicated to supporting hackers and creators every step of the way.
          </motion.p>
          <motion.div
            className="mt-6 flex space-x-6 mb-3 md:mb-24 lg:mb-48"
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
              <motion.img
                whileHover={{ scale: 1.06 }}
                src="./x.png"
                alt="X"
                className="h-6 w-6"
              />
            </Link>
            <Link
              href="https://www.instagram.com/v1michigan/"
              aria-label="Instagram"
              className="text-white hover:text-gray-200"
            >
              <motion.img
                whileHover={{ scale: 1.06 }}
                src="./insta.png"
                className="h-6 w-6"
              />
            </Link>
            <Link
              href="https://v1network.substack.com/"
              aria-label="Contact"
              className="text-white hover:text-gray-200"
            >
              <motion.img
                whileHover={{ scale: 1.06 }}
                src="./more.png"
                className="h-6 w-6"
              />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

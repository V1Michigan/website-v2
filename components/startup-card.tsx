"use client";

import { motion } from "framer-motion";

interface StartupCardProps {
  image: string;
  name: string;
  domain: string;
}

export default function StartupCard({ image, name, domain }: StartupCardProps) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="bg-white/10 rounded-xl p-4 text-center w-full"
    >
      <div className="w-20 h-20 rounded-lg overflow-hidden mb-3 mx-auto flex items-center justify-center">
        <img
          src={image || "/placeholder.svg"}
          alt={`${name} logo`}
          className="w-full h-full object-contain"
        />
      </div>
      <div className="text-xs font-medium font-inter text-[#FEF9F5] mb-1">
        {name}
      </div>
      <div className="text-[10px] font-medium font-inter text-[#CEC9C5]">
        {domain}
      </div>
    </motion.div>
  );
}

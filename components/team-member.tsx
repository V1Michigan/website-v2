"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface TeamMemberProps {
  image: string;
  name: string;
  linkedinUrl: string;
  index: number;
}

export default function TeamMember({
  image,
  name,
  linkedinUrl,
  index,
}: TeamMemberProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="relative group inline-block hover:z-10"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={linkedinUrl} target="_blank" rel="noopener noreferrer">
        <div className="relative w-12 h-12 md:w-16 md:h-16 transition-transform duration-200 hover:scale-110">
          <Image
            src={image || "/placeholder.svg"}
            alt={name}
            fill
            className="rounded-full object-cover border-2 border-white shadow-sm cursor-pointer"
          />
        </div>

        {/* Name tooltip */}
        {isHovered && (
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-gray-800 text-white text-sm rounded-md whitespace-nowrap z-50 opacity-90">
            {name}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
          </div>
        )}
      </Link>
    </div>
  );
}

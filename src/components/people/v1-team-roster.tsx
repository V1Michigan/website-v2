"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

const startupWeekTeam = [
  { image: "/anant.jpeg", name: "Anant Garg", linkedinUrl: "https://linkedin.com/in/anant-g" },
  { image: "/maya.jpg", name: "Maya Malik", linkedinUrl: "https://linkedin.com/in/maya-malik-umich/" },
  { image: "/arhan.jpg", name: "Arhan Kaul", linkedinUrl: "https://linkedin.com/in/arhan-kaul-162884210/" },
  { image: "/vador.jpg", name: "Mihir Vador", linkedinUrl: "https://linkedin.com/in/mihirvador" }
];

const v1TeamMembers = [
  { image: "/headshots/leo.jpg", name: "Leo Liu", linkedinUrl: "https://www.linkedin.com/in/leoliu12/" },
  { image: "/headshots/pranay.jpg", name: "Pranay Gupta", linkedinUrl: "https://www.linkedin.com/in/pranay-gupta1" },
  { image: "/headshots/anay.jpeg", name: "Anay Modi", linkedinUrl: "https://www.linkedin.com/in/anay-modi/" },
  { image: "/headshots/amulya.jpg", name: "Amulya Gundlapally", linkedinUrl: "https://www.linkedin.com/in/amulya-gundlapally/" },
  { image: "/headshots/lance.jpg", name: "Lance Fuchia", linkedinUrl: "https://www.linkedin.com/in/lancefuchia/" },
  { image: "/headshots/anant.jpeg", name: "Anant Garg", linkedinUrl: "https://www.linkedin.com/in/anant-g/" },
  { image: "/headshots/arhan.jpg", name: "Arhan Kaul", linkedinUrl: "https://www.linkedin.com/in/arhan-kaul-162884210/" },
  { image: "/headshots/toan.jpeg", name: "Toan Bui", linkedinUrl: "https://ww.linkedin.com/in/toanmbui" },
  { image: "/headshots/diego.png", name: "Diego Paredes", linkedinUrl: "https://www.linkedin.com/diegokaipareades/" },
  { image: "/headshots/phoenix.png", name: "Phoenix Sheppard", linkedinUrl: "https://www.linkedin.com/in/phoenixsheppard/" },
  { image: "/headshots/vador.jpg", name: "Mihir Vador", linkedinUrl: "https://www.linkedin.com/in/mihirvador/" },
  { image: "/headshots/sri.jpeg", name: "Sri MK", linkedinUrl: "https://www.linkedin.com/in/mksriram/" },
  { image: "/headshots/jeffery.jpg", name: "Jeffery Wu", linkedinUrl: "https://www.linkedin.com/in/wujeffery/" },
  { image: "/headshots/soyeon.jpeg", name: "Soyeon Kim", linkedinUrl: "https://www.linkedin.com/in/soyeonkm/" },
  { image: "/headshots/alison.jpg", name: "Alison Roeda", linkedinUrl: "https://www.linkedin.com/in/alison-roeda/" },
  { image: "/headshots/amy.jpg", name: "Amy Liu", linkedinUrl: "https://www.linkedin.com/in/amyliiu/" },
  { image: "/headshots/meghna.jpeg", name: "Meghna Reddy", linkedinUrl: "https://www.linkedin.com/in/reddymeghna/" },
  { image: "/headshots/alexis.jpeg", name: "Alexis Gu", linkedinUrl: "https://www.linkedin.com/in/alexis-gu-7bb77129a/" },
  { image: "/headshots/joshua.jpg", name: "Joshua Lee", linkedinUrl: "https://www.linkedin.com/in/mildjosh" },
  { image: "/headshots/casey.jpg", name: "Casey Feng", linkedinUrl: "https://www.linkedin.com/in/caseyfeng" },
  { image: "/headshots/mihir.jpg", name: "Mihir Arya", linkedinUrl: "https://www.linkedin.com/in/mihir-s-arya/" },
  { image: "/headshots/ishan.jpg", name: "Ishan Kunam", linkedinUrl: "https://www.linkedin.com/in/ishankunam/" },
  { image: "/headshots/leog.jpeg", name: "Leo Gao", linkedinUrl: "https://www.linkedin.com/in/leogao25" },
  { image: "/headshots/maya.jpg", name: "Maya Malik", linkedinUrl: "https://www.linkedin.com/in/maya-malik-umich/" },
  { image: "/headshots/daniel.jpeg", name: "Daniel Liu", linkedinUrl: "https://www.linkedin.com/in/daniel-lliu/" }
];

interface TeamMemberProps {
  image: string;
  name: string;
  linkedinUrl: string;
  index: number;
  size?: 'regular' | 'small';
}

function TeamMember({
  image,
  name,
  linkedinUrl,
  index,
  size = 'regular',
}: TeamMemberProps) {
  const [isHovered, setIsHovered] = useState(false);

  const sizeClasses = size === 'small' 
    ? "w-8 h-8 md:w-10 md:h-10" 
    : "w-12 h-12 md:w-16 md:h-16";
  
  const tooltipClasses = size === 'small'
    ? "text-xs px-2 py-1"
    : "text-sm px-3 py-1";

  return (
    <div
      className="relative group inline-block hover:z-10"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={linkedinUrl} target="_blank" rel="noopener noreferrer">
        <div className={`relative ${sizeClasses} transition-transform duration-200 hover:scale-110`}>
          <Image
            src={image || "/placeholder.svg"}
            alt={name}
            fill
            className="rounded-full object-cover border-2 border-white shadow-sm cursor-pointer"
          />
        </div>

        {/* Name tooltip */}
        {isHovered && (
          <div className={`absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 ${tooltipClasses} bg-gray-800 text-white rounded-md whitespace-nowrap z-50 opacity-90`}>
            {name}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
          </div>
        )}
      </Link>
    </div>
  );
}

export default function V1TeamRoster() {
  return (
    <div className="px-6 py-8">
      {/* Startup Week Team */}
      <h2 className="text-3xl font-bold font-instrument text-[#444] mb-6 text-center">
        Our Team
      </h2>
      <div className="flex justify-center -space-x-3 mb-8">
        {startupWeekTeam.map((member, index) => (
          <TeamMember
            key={index}
            image={member.image}
            name={member.name}
            linkedinUrl={member.linkedinUrl}
            index={index}
            size="regular"
          />
        ))}
      </div>
    </div>
  );
}

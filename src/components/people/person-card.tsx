"use client";

import Image from "next/image";
import type { Person } from "@/types/person";

interface PersonCardProps {
  person: Person;
  onClick: () => void;
}

export default function PersonCard({ person, onClick }: PersonCardProps) {
  return (
    <button
      onClick={onClick}
      className="text-left group cursor-pointer"
      aria-label={`Open profile for ${person.name}`}
    >
      <div className="relative aspect-[5/4] w-full overflow-hidden rounded-md bg-gray-200">
        <Image
          src={person.imageSrc || "/placeholders/general/placeholder.svg"}
          alt={person.name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
        />
      </div>
      <div className="mt-3">
        <h3 className="text-base font-medium text-gray-800">{person.name}</h3>
        <p className="text-xs text-gray-600">{person.role}</p>
        <p className="mt-2 line-clamp-3 text-xs text-gray-700 min-h-[2rem]">{person.shortBio}</p>
      </div>
    </button>
  );
}



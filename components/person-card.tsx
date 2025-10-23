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
      className="text-left w-full h-full p-0 cursor-pointer"
      aria-label={`Open profile for ${person.name}`}
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-200">
        <Image
          src={person.imageSrc || "/placeholder.svg"}
          alt={person.name}
          fill
          className="object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">{person.name}</h3>
        <p className="text-sm text-gray-600 mb-2">{person.role}</p>
        <p className="text-sm text-gray-700 line-clamp-2 mb-3">{person.shortBio}</p>
        {person.tags && person.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {person.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="inline-block rounded-full bg-[#E9B872] px-2 py-1 text-xs font-medium text-gray-800">
                {tag}
              </span>
            ))}
            {person.tags.length > 3 && (
              <span className="inline-block rounded-full bg-gray-200 px-2 py-1 text-xs font-medium text-gray-600">
                +{person.tags.length - 3}
              </span>
            )}
          </div>
        )}
      </div>
    </button>
  );
}



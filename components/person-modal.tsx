"use client";

import Image from "next/image";
import Link from "next/link";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Calendar, Linkedin, Twitter, Instagram, Link as LinkIcon, Mail } from "lucide-react";
import type { Person } from "@/types/person";

interface PersonModalProps {
  person: Person | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function PersonModal({ person, open, onOpenChange }: PersonModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-[#FAF7F2]">
        {!person ? null : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-[160px_1fr]">
            <div className="relative h-40 w-40 overflow-hidden rounded-md sm:h-44 sm:w-40">
              <Image
                src={person.imageSrc || "/placeholder.svg"}
                alt={person.name}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-800">{person.name}</h2>
              <p className="text-sm text-gray-600">{person.role}</p>

              <p className="mt-3 text-sm text-gray-700 whitespace-pre-line">{person.fullBio}</p>

              <div className="mt-4 flex flex-wrap gap-2">
                {person.tags.map((t) => (
                  <span key={t} className="rounded-full bg-[#E9B872] px-3 py-1 text-xs font-medium text-gray-800">
                    {t}
                  </span>
                ))}
              </div>

              <div className="mt-4 flex items-center gap-3 text-gray-700">
                {person.social.calendly && (
                  <Link href={person.social.calendly} target="_blank" className="inline-flex items-center gap-1 text-sm hover:underline">
                    <Calendar className="h-4 w-4" /> Meet me
                  </Link>
                )}
                {person.social.email && (
                  <Link href={`mailto:${person.social.email}`} className="inline-flex items-center gap-1 text-sm hover:underline">
                    <Mail className="h-4 w-4" /> Email
                  </Link>
                )}
                {person.social.linkedin && (
                  <Link href={person.social.linkedin} target="_blank" aria-label="LinkedIn" className="p-2 text-gray-700 hover:text-gray-900">
                    <Linkedin className="h-4 w-4" />
                  </Link>
                )}
                {person.social.twitter && (
                  <Link href={person.social.twitter} target="_blank" aria-label="Twitter/X" className="p-2 text-gray-700 hover:text-gray-900">
                    <Twitter className="h-4 w-4" />
                  </Link>
                )}
                {person.social.instagram && (
                  <Link href={person.social.instagram} target="_blank" aria-label="Instagram" className="p-2 text-gray-700 hover:text-gray-900">
                    <Instagram className="h-4 w-4" />
                  </Link>
                )}
                {person.social.website && (
                  <Link href={person.social.website} target="_blank" aria-label="Website" className="p-2 text-gray-700 hover:text-gray-900">
                    <LinkIcon className="h-4 w-4" />
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}



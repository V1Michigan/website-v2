"use client";

import Image from "next/image";
import Link from "next/link";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Calendar, Linkedin, Twitter, Instagram, Link as LinkIcon, Mail, Edit } from "lucide-react";
import type { Person } from "@/types/person";
import { useAuth } from "@/components/auth/auth-provider";

interface PersonModalProps {
  person: Person | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function PersonModal({ person, open, onOpenChange }: PersonModalProps) {
  const { user } = useAuth();
  
  // Check if the current user is viewing their own profile
  const isOwnProfile = user && person && user.email === person.id;
  
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
                {isOwnProfile && (
                  <Link 
                    href="/people/edit"
                    className="inline-flex items-center gap-1 text-sm hover:underline bg-blue-600 px-3 py-1 rounded-full font-medium text-white hover:bg-blue-700 transition-colors"
                  >
                    <Edit className="h-4 w-4" /> Edit Profile
                  </Link>
                )}
              </div>

              <div className="mt-4 flex items-center gap-3 text-gray-700">
                <Link 
                  href={`mailto:v1umich@gmail.com?subject=Connection Request for ${person.name}&body=Hi V1 team,%0D%0A%0D%0AI would like to connect with ${person.name} (${person.role}). Saw them on the V1 website and would like to chat. %0D%0A%0D%0APlease help facilitate this connection. %0D%0A%0D%0AThank you!`}
                  className="inline-flex items-center gap-1 text-sm hover:underline bg-[#E9B872] px-3 py-1 rounded-full font-medium text-gray-800 hover:bg-[#D4A85A] transition-colors"
                >
                  <Mail className="h-4 w-4" /> Connect
                </Link>
                {person.social?.linkedin && (
                  <Link href={person.social.linkedin} target="_blank" aria-label="LinkedIn" className="p-2 text-gray-700 hover:text-gray-900">
                    <Linkedin className="h-4 w-4" />
                  </Link>
                )}
                {person.social?.twitter && (
                  <Link href={person.social.twitter} target="_blank" aria-label="Twitter/X" className="p-2 text-gray-700 hover:text-gray-900">
                    <Twitter className="h-4 w-4" />
                  </Link>
                )}
                {person.social?.instagram && (
                  <Link href={person.social.instagram} target="_blank" aria-label="Instagram" className="p-2 text-gray-700 hover:text-gray-900">
                    <Instagram className="h-4 w-4" />
                  </Link>
                )}
                {person.social?.website && (
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



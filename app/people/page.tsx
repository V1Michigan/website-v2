"use client";

import { useMemo, useState } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import PersonCard from "@/components/person-card";
import PersonModal from "@/components/person-modal";
import { PEOPLE } from "@/data/people";
import type { Person } from "@/types/person";
import { Input } from "@/components/ui/input";

export default function PeoplePage() {
  const [selected, setSelected] = useState<Person | null>(null);
  const [query, setQuery] = useState("");

  const filteredPeople = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) return PEOPLE;
    return PEOPLE.filter((p) => {
      const haystack = [
        p.name,
        p.role,
        p.shortBio,
        p.fullBio,
        (p.tags || []).join(" "),
      ]
        .filter(Boolean)
        .join(" \n ")
        .toLowerCase();
      return haystack.includes(trimmed);
    });
  }, [query]);

  return (
    <div className="min-h-screen bg-[#FEF9F5]">
      <Header />

      <main className="mx-auto max-w-6xl px-4 pb-16 pt-10 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="font-instrument text-4xl font-bold text-[#444]">People @ V1</h1>
          <p className="mt-2 max-w-3xl text-sm text-gray-700">
            A curated directory of builders, engineers, designers, and operators from the V1 ecosystem.
          </p>
        </div>

        <div className="mb-6">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, role, tag, or bio"
            aria-label="Search people"
            className="max-w-md bg-white/70"
          />
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
          {filteredPeople.map((person) => (
            <PersonCard key={person.id} person={person} onClick={() => setSelected(person)} />
          ))}
        </div>
      </main>

      <Footer />

      <PersonModal person={selected} open={!!selected} onOpenChange={(o) => !o && setSelected(null)} />
    </div>
  );
}



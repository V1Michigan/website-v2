"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import PersonCard from "@/components/person-card";
import PersonModal from "@/components/person-modal";
import supabase from "@/utils/supabaseClient";
import type { Person } from "@/types/person";
import { Input } from "@/components/ui/input";
import { useSuspenseQuery } from "@tanstack/react-query";

function transformToPeople<T>(data: T[] | null) {
  const mappedPeople = (data || []).map((item: any) => ({
    id: item.id,
    name: item.name,
    role: item.role,
    imageSrc: item['image-path'] || "/placeholder.svg",
    shortBio: item['short-bio'] || "",
    fullBio: item['full-bio'] || "",
    tags: item.tags || [],
    social: {
      linkedin: item.linkedin || "",
      twitter: item.twitter || "",
      instagram: item.instagram || "",
      website: item.website || ""
    },
  }));
  return mappedPeople;
}

async function getPeople(searchQuery?: string) {
  let query = supabase
    .from('v1-people')
    .select('id, name, short-bio, full-bio, tags, linkedin, twitter, instagram, website, role, image-path');

  if (searchQuery?.trim()) {
    query = query.ilike('name', `%${searchQuery.trim()}%`);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching people:", error.message);
  }

  // Map database fields to Person interface
  const transformedPeople = transformToPeople(data);
  return transformedPeople;
}

export default function PeopleContent() {
  const [selected, setSelected] = useState<Person | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlSearch = searchParams?.get('q') || '';
  const profileId = searchParams?.get('profile') || '';
  const [localSearch, setLocalSearch] = useState(urlSearch);

  // Sync local state with URL on mount or URL change
  useEffect(() => {
    if (localSearch !== urlSearch) setLocalSearch(urlSearch);
  }, [urlSearch]);

  // Debounced URL update
  const debouncedUpdateURL = useMemo(() => {
    let timeoutId: ReturnType<typeof setTimeout>;
    return (value: string) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        const params = new URLSearchParams(searchParams?.toString() || '');
        if (value.trim()) {
          params.set('q', value.trim());
        } else {
          params.delete('q');
        }
        router.replace(`?${params.toString()}`, { scroll: false });
      }, 300);
    };
  }, [searchParams, router]);

  const { data, isPending } = useSuspenseQuery({
    queryKey: ['people', urlSearch],
    queryFn: ({ queryKey }) => getPeople(queryKey[1] as string),
    staleTime: 5 * 60 * 1000 // 5 minutes
  });

  // Sync selected person with profile query param
  useEffect(() => {
    if (profileId && data) {
      const person = data.find(p => p.id === profileId);
      setSelected(person || null);
    } else {
      setSelected(null);
    }
  }, [profileId, data]);

  return (
    <>
      <main className="mx-auto max-w-6xl px-4 pb-16 pt-10 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="font-instrument text-4xl font-bold text-[#444]">People @ V1</h1>
          <p className="mt-2 max-w-3xl text-sm text-gray-700">
            A curated directory of builders, engineers, designers, and operators from the V1 ecosystem.
          </p>
        </div>

        <div className="mb-6">
          <Input
            value={localSearch}
            onChange={(e) => {
              setLocalSearch(e.target.value);
              debouncedUpdateURL(e.target.value);
            }}
            placeholder="Search by name"
            aria-label="Search people"
            className="max-w-md bg-white/70"
          />
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
          {isPending ? (
            <div className="col-span-full flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading people...</p>
              </div>
            </div>
          ) : data.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-600">No people found matching your search.</p>
            </div>
          ) : (
            data.map((person: Person) => (
              <PersonCard key={person.id} person={person} onClick={() => {
                setSelected(person);
                const params = new URLSearchParams(searchParams?.toString() || '');
                params.set('profile', person.id);
                router.push(`/people?${params.toString()}`);
              }} />
            ))
          )}
        </div>
      </main>

      <PersonModal person={selected} open={!!selected} onOpenChange={(o) => {
        if (!o) {
          setSelected(null);
          const params = new URLSearchParams(searchParams?.toString() || '');
          params.delete('profile');
          router.replace(`?${params.toString()}`, { scroll: false });
        }
      }} />
    </>
  );
}

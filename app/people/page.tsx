import { Suspense } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Input } from "@/components/ui/input";
import PeopleContent from "@/components/people-content";

export const metadata = {
  title: "People @ V1 - Our Community of Builders",
  description: "A curated directory of builders, engineers, designers, and operators from the V1 ecosystem at the University of Michigan.",
};

function PeopleFallback() {
  return (
    <main className="mx-auto max-w-6xl px-4 pb-16 pt-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="font-instrument text-4xl font-bold text-[#444]">People @ V1</h1>
        <p className="mt-2 max-w-3xl text-sm text-gray-700">
          A curated directory of builders, engineers, designers, and operators from the V1 ecosystem.
        </p>
      </div>

      <div className="mb-6">
        <Input
          placeholder="Search by name"
          aria-label="Search people"
          className="max-w-md bg-white/70"
          disabled
        />
      </div>

      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading people...</p>
        </div>
      </div>
    </main>
  );
}

export default function PeoplePage() {
  return (
    <div className="min-h-screen bg-[#FEF9F5]">
      <Header />

      <Suspense fallback={<PeopleFallback />}>
        <PeopleContent />
      </Suspense>

      <Footer />
    </div>
  );
}



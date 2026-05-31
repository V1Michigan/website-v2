import Link from "next/link";
import { Heart } from "lucide-react";
import Header from "@/components/shared/header";
import Footer from "@/components/shared/footer";

const YEARS = [
  {
    year: 2026,
    path: "/valentines/2026",
    label: "V1 and Community!",
    description: "Create and share beautiful Valentine's cards",
  },
];

export default function ValentinesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-red-50">
      <Header />

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Heart className="h-8 w-8 text-rose-500 fill-rose-500" />
              <h1 className="text-3xl font-serif text-rose-800 tracking-tight">
                Love, V1 @ Michigan
              </h1>
              <Heart className="h-8 w-8 text-rose-500 fill-rose-500" />
            </div>
          </div>

          <div className="flex justify-center">
            {YEARS.map((year) => (
              <Link
                key={year.year}
                href={year.path}
                className="group relative bg-white/60 backdrop-blur-sm rounded-2xl border-2 border-rose-200 p-8 hover:border-rose-400 hover:shadow-2xl transition-all duration-300"
              >


                <div className="relative z-10">
                  <h2 className="text-4xl font-serif text-rose-700 mb-3">
                    {year.label}
                  </h2>

                  <p className="text-rose-500 text-sm">
                    {year.description}
                  </p>

                  <div className="mt-4 flex items-center gap-2 text-rose-600 font-medium group-hover:text-rose-700">
                    <span>Start Creating</span>
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

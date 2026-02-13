import Link from "next/link";
import { Heart } from "lucide-react";
import Header from "@/components/header";
import Footer from "@/components/footer";

const YEARS = [
  {
    year: 2026,
    path: "/valentines/2026",
    label: "2026",
    description: "Create and share beautiful Valentine's cards",
  },
];

export default function ValentinesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-red-50 relative overflow-hidden">
      {/* Floating hearts background decoration */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <svg
          className="absolute top-10 left-10 w-16 h-16 text-rose-200 opacity-40 animate-pulse"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
        <svg
          className="absolute top-32 right-20 w-12 h-12 text-pink-200 opacity-30"
          viewBox="0 0 24 24"
          fill="currentColor"
          style={{ animation: "pulse 3s ease-in-out infinite 1s" }}
        >
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
        <svg
          className="absolute bottom-40 left-1/4 w-20 h-20 text-red-200 opacity-20"
          viewBox="0 0 24 24"
          fill="currentColor"
          style={{ animation: "pulse 4s ease-in-out infinite 0.5s" }}
        >
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3,16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
        <svg
          className="absolute top-1/2 right-10 w-10 h-10 text-rose-300 opacity-25 animate-pulse"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3,16.5 3 19.58 3 22,5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
        <svg
          className="absolute bottom-20 right-1/3 w-14 h-14 text-pink-300 opacity-20"
          viewBox="0 0 24 24"
          fill="currentColor"
          style={{ animation: "pulse 3.5s ease-in-out infinite 2s" }}
        >
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3,16.5 3 19.58 3 22,5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
      </div>

      <Header />

      <main className="relative z-10 container mx-auto px-4 py-12">
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
                <div className="absolute top-4 right-4 opacity-20 group-hover:opacity-30 transition-opacity">
                  <Heart className="h-16 w-16 text-rose-500 fill-rose-500" />
                </div>

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

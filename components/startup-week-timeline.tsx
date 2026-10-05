import type { StartupWeekLiveEvent } from "@/data/startup-week";

interface StartupWeekTimelineProps {
  events: StartupWeekLiveEvent[];
}

const companyLogos: Record<string, string> = {
  "Startup Week Kickoff": "/startupweek/2026/spacexai.webp",
  "Miter x V1": "/startupweek/2026/miter.webp",
  Lumaril: "/startupweek/2026/lumaril.webp",
  "Authentic Fireside": "/startupweek/2026/authentic.webp",
  "Air Space Intelligence (ASI)": "/startupweek/2026/asi.webp",
  "Dryft Fireside": "/startupweek/2026/dryft.webp",
  "Scope Health": "/startupweek/2026/scope.webp",
};

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${date}T00:00:00Z`));
}

export default function StartupWeekTimeline({ events }: StartupWeekTimelineProps) {
  return (
    <section aria-labelledby="startup-week-schedule" className="mx-auto max-w-5xl px-6 py-12 lg:px-8">
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#a16207]">Oct 5–9, 2026 · Ann Arbor</p>
        <h2 id="startup-week-schedule" className="mt-2 font-serif text-3xl font-light tracking-tight text-[#1a1a1a] md:text-4xl">
          Live events schedule
        </h2>
      </div>

      <ol className="relative space-y-8 before:absolute before:bottom-0 before:left-[9px] before:top-2 before:w-px before:bg-[#d6d3d1] md:space-y-10">
        {events.map((event) => (
          <li key={event.lumaEventId} className="relative pl-8">
            <span className="absolute left-0 top-1 h-[19px] w-[19px] rounded-full border-4 border-[#FAF7F2] bg-[#facc15] shadow-[0_0_0_1px_#a16207]" aria-hidden="true" />
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
              <time dateTime={`${event.date}T${event.startTime}:00-04:00`} className="w-full text-xs font-semibold uppercase tracking-[0.12em] text-[#a16207] sm:w-auto">
                {formatDate(event.date)}
              </time>
              <span className="hidden text-[#a8a29e] sm:inline" aria-hidden="true">·</span>
              <span className="text-sm text-[#57534e]">{event.time}</span>
            </div>
            <div className="mt-2 flex items-center gap-3">
              <img
                src={companyLogos[event.title]}
                alt=""
                width={36}
                height={36}
                className="h-9 w-9 rounded-lg border border-[#d6d3d1] bg-white object-contain p-1"
              />
              <h3 className="text-xl font-semibold tracking-tight text-[#1a1a1a] md:text-2xl">{event.title}</h3>
            </div>
            <p className="mt-1 text-sm text-[#57534e]">{event.location}</p>
            <a
              href={`https://luma.com/${event.slug}`}
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-flex items-center rounded-full bg-[#1a1a1a] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#3f3f46] focus:outline-none focus:ring-2 focus:ring-[#a16207] focus:ring-offset-2"
            >
              Register
            </a>
          </li>
        ))}
      </ol>
    </section>
  );
}

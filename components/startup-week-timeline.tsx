import type { StartupWeekLiveEvent } from "@/data/startup-week";

interface StartupWeekTimelineProps {
  events: StartupWeekLiveEvent[];
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${date}T00:00:00Z`));
}

export default function StartupWeekTimeline({ events }: StartupWeekTimelineProps) {
  return (
    <section aria-labelledby="startup-week-schedule" className="mx-auto max-w-6xl px-6 py-20 lg:px-8">
      <div className="mb-12 max-w-2xl">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-[#a16207]">
          October 5–9, 2026 · Ann Arbor
        </p>
        <h2 id="startup-week-schedule" className="font-serif text-4xl font-light tracking-tight text-[#1a1a1a] md:text-5xl">
          Live events schedule
        </h2>
        <p className="mt-4 text-base leading-7 text-[#57534e]">
          Explore the week and register for each event.
        </p>
      </div>

      <ol className="relative space-y-12 before:absolute before:bottom-0 before:left-[9px] before:top-2 before:w-px before:bg-[#d6d3d1] md:space-y-16">
        {events.map((event) => (
          <li key={event.lumaEventId} className="relative pl-10">
            <span className="absolute left-0 top-2 h-[19px] w-[19px] rounded-full border-4 border-[#FAF7F2] bg-[#facc15] shadow-[0_0_0_1px_#a16207]" aria-hidden="true" />
            <div>
              <time dateTime={`${event.date}T${event.startTime}:00-04:00`} className="text-sm font-semibold uppercase tracking-[0.14em] text-[#a16207]">
                {formatDate(event.date)}
              </time>
              <h3 className="mt-2 text-2xl font-semibold tracking-tight text-[#1a1a1a]">{event.title}</h3>
              <p className="mt-2 text-base font-medium text-[#57534e]">{event.time} · {event.location}</p>
              <p className="mt-4 max-w-xl text-base leading-7 text-[#57534e]">{event.description}</p>
              <a
                href={`https://luma.com/${event.slug}`}
                target="_blank"
                rel="noreferrer"
                className="mt-5 inline-flex items-center rounded-full bg-[#1a1a1a] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#3f3f46] focus:outline-none focus:ring-2 focus:ring-[#a16207] focus:ring-offset-2"
              >
                Register
              </a>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

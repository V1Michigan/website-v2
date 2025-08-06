import EventCard from "./event-card"

interface Event {
  title: string
  description: string
  image: string
}

interface EventsSectionProps {
  events: Event[]
}

export default function EventsSection({ events }: EventsSectionProps) {
  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="space-y-4">
        {events.map((event, index) => (
          <EventCard key={index} title={event.title} description={event.description} image={event.image} />
        ))}
      </div>
    </div>
  )
}

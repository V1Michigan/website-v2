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
    <div className="max-w-7xl mx-auto p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event, index) => (
          <EventCard key={index} title={event.title} description={event.description} image={event.image} />
        ))}
      </div>
    </div>
  )
}

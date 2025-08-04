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
    <div className="p-4">
      <div className="border-2 border-dashed border-blue-400 rounded-lg p-4 space-y-4">
        {events.map((event, index) => (
          <EventCard key={index} title={event.title} description={event.description} image={event.image} />
        ))}
      </div>
    </div>
  )
}

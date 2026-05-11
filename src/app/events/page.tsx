import { Container } from "@/components/layout/Container";
import { EventCard } from "@/components/events/EventCard";
import { Event } from "@/types";
import eventsData from "@/data/events.json";
import { isPast, isFuture, compareDesc } from "date-fns";

export default function EventsPage() {
  const events = eventsData as unknown as Event[];

  // Separate events into categories
  const upcomingEvents = events
    .filter((event) => {
      const startDate = new Date(event.startDate);
      return isFuture(startDate);
    })
    .sort((a, b) => compareDesc(new Date(b.startDate), new Date(a.startDate)));

  const ongoingEvents = events.filter((event) => {
    const startDate = new Date(event.startDate);
    const endDate = event.endDate ? new Date(event.endDate) : startDate;
    const now = new Date();
    return startDate <= now && endDate >= now;
  });

  const pastEvents = events
    .filter((event) => {
      const endDate = event.endDate ? new Date(event.endDate) : new Date(event.startDate);
      return isPast(endDate);
    })
    .sort((a, b) =>
      compareDesc(new Date(b.endDate || b.startDate), new Date(a.endDate || a.startDate))
    );

  return (
    <div className="py-12">
      <Container>
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Events</h1>
          <p className="text-lg text-muted-foreground">
            Join our contribution drives, hackathons, and workshops
          </p>
        </div>

        {upcomingEvents.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Upcoming Events</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </section>
        )}

        {ongoingEvents.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Ongoing Events</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ongoingEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </section>
        )}

        {pastEvents.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold mb-6">Past Events</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pastEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </section>
        )}

        {events.length === 0 && (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">
              No events scheduled at the moment. Check back soon!
            </p>
          </div>
        )}
      </Container>
    </div>
  );
}

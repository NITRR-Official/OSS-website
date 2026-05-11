import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Event } from "@/types";
import { Calendar, Clock, MapPin, Users, ExternalLink } from "lucide-react";
import Link from "next/link";
import { format, isPast, isFuture, formatDistanceToNow } from "date-fns";

interface EventCardProps {
  event: Event;
}

export function EventCard({ event }: EventCardProps) {
  const startDate = new Date(event.startDate);
  const endDate = event.endDate ? new Date(event.endDate) : null;
  const isEventPast = endDate ? isPast(endDate) : isPast(startDate);
  const isEventUpcoming = isFuture(startDate);

  const getStatusBadge = () => {
    if (isEventPast) {
      return (
        <Badge variant="outline" className="bg-gray-500/10 text-gray-600 border-gray-500/20">
          Completed
        </Badge>
      );
    }
    if (isEventUpcoming) {
      return (
        <Badge variant="outline" className="bg-blue-500/10 text-blue-600 border-blue-500/20">
          Upcoming
        </Badge>
      );
    }
    return (
      <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/20">
        Ongoing
      </Badge>
    );
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-lg font-semibold">{event.title}</h3>
              {getStatusBadge()}
            </div>
            <p className="text-sm text-muted-foreground">{event.description}</p>
          </div>
        </div>

        <div className="space-y-3 mb-4">
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>
              {format(startDate, "MMM dd, yyyy")}
              {endDate && ` - ${format(endDate, "MMM dd, yyyy")}`}
            </span>
          </div>

          {isEventUpcoming && (
            <div className="flex items-center gap-2 text-sm text-primary">
              <Clock className="h-4 w-4" />
              <span>Starts {formatDistanceToNow(startDate, { addSuffix: true })}</span>
            </div>
          )}

          {event.location && (
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>{event.location}</span>
            </div>
          )}

          {event.maxParticipants && (
            <div className="flex items-center gap-2 text-sm">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span>Max Participants: {event.maxParticipants}</span>
            </div>
          )}
        </div>

        {event.tags && event.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {event.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {event.registrationUrl && isEventUpcoming && (
          <Button asChild className="w-full">
            <Link href={event.registrationUrl} target="_blank" rel="noopener noreferrer">
              Register Now
              <ExternalLink className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        )}

        {event.leaderboardUrl && (
          <Button asChild variant="outline" className="w-full mt-2">
            <Link href={event.leaderboardUrl} target="_blank" rel="noopener noreferrer">
              View Leaderboard
              <ExternalLink className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        )}
      </div>
    </Card>
  );
}

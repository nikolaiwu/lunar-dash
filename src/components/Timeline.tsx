import { formatDateTime } from "@/lib/format";

// What happened, and when, oldest first: an order's statuses, say.
export function Timeline({
  events,
}: {
  events: { at: string; label: string }[];
}) {
  return (
    <ol>
      {events.map((event) => (
        <li key={`${event.at}-${event.label}`}>
          <time dateTime={event.at}>{formatDateTime(event.at)}</time>{" "}
          {event.label}
        </li>
      ))}
    </ol>
  );
}

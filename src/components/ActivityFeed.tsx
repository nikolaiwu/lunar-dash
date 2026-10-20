import Link from "next/link";
import type { ActivityEvent } from "@/lib/data";
import { formatDateTime } from "@/lib/format";
import { statusEvent } from "@/resources/orders";

// What happened lately, newest first: when, which order, and what happened
// to it.
export function ActivityFeed({ events }: { events: ActivityEvent[] }) {
  return (
    <ol>
      {events.map((event) => (
        <li key={`${event.orderId}-${event.status}`}>
          <time dateTime={event.at}>{formatDateTime(event.at)}</time>{" "}
          <Link href={`/orders/${event.orderId}`}>Order #{event.number}</Link>{" "}
          {statusEvent(event.status, event.customerName)}
        </li>
      ))}
    </ol>
  );
}

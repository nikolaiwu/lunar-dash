import { Fragment } from "react";

// How a total splits into parts, such as orders by status: each part's name,
// a meter for its share of the total, and its count.
export function StatusBreakdown({
  parts,
  total,
}: {
  parts: { id: string; label: string; count: number }[];
  total: number;
}) {
  return (
    <dl>
      {parts.map((part) => (
        <Fragment key={part.id}>
          <dt id={`part-${part.id}`}>{part.label}</dt>
          <dd>
            {part.count}{" "}
            <meter
              value={part.count}
              max={Math.max(total, 1)}
              aria-labelledby={`part-${part.id}`}
            >
              {part.count} of {total}
            </meter>
          </dd>
        </Fragment>
      ))}
    </dl>
  );
}

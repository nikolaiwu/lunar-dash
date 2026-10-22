"use client";

// The top of a form that came back with errors: what's wrong, each linking
// to its field. It takes focus, so a screen reader starts there and a
// keyboard user can follow the links.
//
// A client component for the focus alone. On a page load (and with
// JavaScript off) the autofocus attribute does it. But after a submission
// with JavaScript the page isn't loaded again, the summary is added to it,
// and autofocus doesn't act on an element added later: React only focuses
// form controls for it. So the effect focuses it when it appears.

import { useEffect, useRef } from "react";

export function ErrorSummary({ errors }: { errors: Record<string, string> }) {
  const ref = useRef<HTMLDivElement>(null);
  const entries = Object.entries(errors);

  useEffect(() => {
    ref.current?.focus();
  }, [errors]);

  if (entries.length === 0) return null;

  return (
    <div
      ref={ref}
      tabIndex={-1}
      autoFocus
      role="group"
      aria-labelledby="error-summary-title"
    >
      <h2 id="error-summary-title">
        {entries.length === 1
          ? "There's a problem"
          : `There are ${entries.length} problems`}
      </h2>
      <ul>
        {entries.map(([name, message]) => (
          <li key={name}>
            <a href={`#field-${name}`}>{message}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}

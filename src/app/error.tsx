"use client"; // Next requires error boundaries to be client components

import Link from "next/link";
import { useEffect, useRef } from "react";

// Shown in place of a page that failed: the shell stays, with a way to try
// again and a way out. Next renders it on the client, so it appears when a
// page fails, with JavaScript: on a full load, after a navigation, or after a
// form (an upload over the Server Actions' size limit, say). Without
// JavaScript the browser gets an empty page: Next leaves error pages to the
// client.
//
// "Try again" asks the server for the page again (retry); the link to the
// overview is the way out. The heading takes focus, so a screen reader
// starts at the news.
export default function Error({
  error,
  retry,
}: {
  error: unknown;
  retry: () => void;
}) {
  const heading = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    // Where you'd report it to an error tracker. In production the message
    // is generic; error.digest matches the server's log.
    console.error(error);
    heading.current?.focus();
  }, [error]);

  const digest =
    error instanceof Error && "digest" in error ? String(error.digest) : null;

  return (
    <>
      <h1 ref={heading} tabIndex={-1}>
        Something went wrong
      </h1>
      <p>
        This page couldn&apos;t be shown. Your changes so far are kept. Try
        again, or go back to the <Link href="/">overview</Link>.
      </p>
      <button type="button" onClick={() => retry()}>
        Try again
      </button>
      {digest && (
        <p>
          <small>
            Error reference: <code>{digest}</code>
          </small>
        </p>
      )}
    </>
  );
}

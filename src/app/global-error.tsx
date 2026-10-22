"use client"; // Next requires error boundaries to be client components

import { useEffect } from "react";
import { siteConfig } from "@/site.config";
import "./globals.css";

// Shown when the root layout itself fails, so it replaces the whole
// document: its own <html> and <body>, the theme's stylesheets imported
// again, and no shell (the shell is what failed). Next renders it on the
// client, like error.tsx. Like the root layout it renders <body>, so it
// places it: the one class here.
export default function GlobalError({
  error,
  retry,
}: {
  error: unknown;
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang={siteConfig.lang}>
      <body className="p-6">
        <title>{`Something went wrong · ${siteConfig.name}`}</title>
        <main>
          <h1>Something went wrong</h1>
          <p>
            {siteConfig.name} couldn&apos;t be shown. Try again, or{" "}
            {/* A full load on purpose: the root layout is what failed, so
                start it again from scratch */}
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a href="/">reload the overview</a>.
          </p>
          <button type="button" onClick={() => retry()}>
            Try again
          </button>
        </main>
      </body>
    </html>
  );
}

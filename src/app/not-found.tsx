import type { Metadata } from "next";
import { NotFound } from "@/components/NotFound";

export const metadata: Metadata = { title: "Page not found" };

export default function NotFoundPage() {
  return (
    <>
      <NotFound
        title="404"
        message="There's no page at this address."
        back={{ href: "/", label: "Go to the overview" }}
      />
      <code>page not found</code>
    </>
  );
}

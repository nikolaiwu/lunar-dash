import Link from "next/link";

// What a missing page says: what wasn't found, and where to look instead.
// The root not-found page uses it (an address with no page: Next sends a
// 404), and so does each detail page whose item doesn't exist. Those render
// it themselves rather than call notFound(): Next renders that page on the
// client, so without JavaScript it would be blank. They're sent with a 200
// and noindex (the app is behind sign-in, so nothing indexes it anyway).
export function NotFound({
  title,
  message,
  back,
}: {
  title: string;
  message: string;
  back: { href: string; label: string };
}) {
  return (
    <>
      <h1>{title}</h1>
      <p>
        {message} <Link href={back.href}>{back.label}</Link>
      </p>
    </>
  );
}

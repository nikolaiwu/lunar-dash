// A single narrow column, centred: a short form on its own, such as signing
// in. Its width is --dash-narrow-width in site.css.
export function Narrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-(--dash-narrow-width)">{children}</div>
  );
}

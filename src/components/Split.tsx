// Main content with a narrower column beside it, such as an order's line
// items next to its summary. Pass two children, main first: they stack on a
// phone and sit side by side from lg. The tracks are --dash-split-columns in
// site.css.
export function Split({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-(--dash-split-columns)">
      {children}
    </div>
  );
}

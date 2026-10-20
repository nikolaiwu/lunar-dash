// Form fields in two columns from md, one on a phone: a first and last name,
// a price and a stock count. Put each field (its label, control and hint) in
// its own element, so a field stays one grid cell.
export function FieldGrid({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 gap-x-6 md:grid-cols-2">{children}</div>
  );
}

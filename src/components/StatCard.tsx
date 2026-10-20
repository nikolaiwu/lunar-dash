// One number with its label and a note under it ("+12% on the previous 30
// days"), as a card. The number is a <data> element with the raw value, so
// it's machine-readable as well as formatted.
export function StatCard({
  label,
  value,
  display,
  note,
}: {
  label: string;
  value: number;
  // How the value reads on screen, if not as a plain number
  display?: string;
  note?: string;
}) {
  return (
    <article>
      <header>
        <h2>{label}</h2>
      </header>
      <p>
        <data value={value}>{display ?? value}</data>
      </p>
      {note && (
        <footer>
          <small>{note}</small>
        </footer>
      )}
    </article>
  );
}

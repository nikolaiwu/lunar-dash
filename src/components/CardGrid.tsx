// A responsive grid of cards (<article>s): as many columns as fit, each at
// least --dash-card-min-width, filling the row. The tracks are
// --dash-card-columns in site.css.
//
// LunarCSS's layout stylesheet has its own card grid for any parent of only
// articles, so it matches here. The classes below set the grid itself; we let
// it do two things to the cards, which no utility on the grid can: it drops
// their margins (the gap spaces them) and lines up their footers. With the
// cards' margins gone, the grid keeps the space below it that a card's
// margin would give.
export function CardGrid({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-6 grid grid-cols-(--dash-card-columns) gap-6">
      {children}
    </div>
  );
}

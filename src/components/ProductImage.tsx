// A product's picture: a line drawing of its category, as inline SVG in the
// text colour (currentColor), so it follows light, dark and forced colours.
// The demo's products have no photos. It's decorative: the product's name
// is next to it.
export function ProductImage({ category }: { category: string }) {
  return (
    <svg
      viewBox="0 0 120 72"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {DRAWINGS[category] ?? DRAWINGS.Parts}
    </svg>
  );
}

const DRAWINGS: Record<string, React.ReactNode> = {
  Rovers: (
    <>
      <rect x="24" y="26" width="72" height="20" rx="3" />
      <path d="M40 26V14h14" />
      <circle cx="36" cy="54" r="8" />
      <circle cx="60" cy="54" r="8" />
      <circle cx="84" cy="54" r="8" />
    </>
  ),
  Arms: (
    <>
      <rect x="40" y="58" width="40" height="8" rx="2" />
      <path d="M60 58 50 34l30-16" />
      <circle cx="50" cy="34" r="4" />
      <path d="m80 18 10-6m-10 6 8 10" />
    </>
  ),
  Drones: (
    <>
      <rect x="50" y="30" width="20" height="12" rx="3" />
      <path d="M50 30 30 18m40 12 20-12M50 42 30 54m40-12 20 12" />
      <ellipse cx="30" cy="18" rx="14" ry="4" />
      <ellipse cx="90" cy="18" rx="14" ry="4" />
      <ellipse cx="30" cy="54" rx="14" ry="4" />
      <ellipse cx="90" cy="54" rx="14" ry="4" />
    </>
  ),
  Sensors: (
    <>
      <circle cx="60" cy="36" r="8" />
      <path d="M44 20a22 22 0 0 0 0 32m32-32a22 22 0 0 1 0 32" />
      <path d="M34 10a36 36 0 0 0 0 52m52-52a36 36 0 0 1 0 52" />
    </>
  ),
  Parts: (
    <>
      <circle cx="60" cy="36" r="16" />
      <circle cx="60" cy="36" r="6" />
      <path d="M60 12v8m0 32v8M36 36h8m32 0h8M43 19l6 6m22 22 6 6m0-34-6 6M49 47l-6 6" />
    </>
  ),
};

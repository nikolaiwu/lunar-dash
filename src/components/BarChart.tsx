// A bar chart drawn as SVG on the server: one bar per point, scaled to the
// largest. The bars are filled with currentColor, so the theme's text colour
// draws them, in light, dark and forced colours alike. Each bar has a tooltip
// with its label and value; screen readers get the summary.
//
// The SVG has no size of its own: it fills the width, at the viewBox's ratio.
// It sits in a div because LunarCSS shrinks a figure to fit its image
// (figure:has(> svg) is fit-content), and an SVG without a size would then
// shrink to nothing.
export function BarChart({
  points,
  format,
  summary,
  caption,
}: {
  points: { label: string; value: number }[];
  format: (value: number) => string;
  // Read out in place of the bars: what the chart shows, in a sentence
  summary: string;
  caption: string;
}) {
  const max = Math.max(...points.map((p) => p.value), 1);
  const step = 10;

  return (
    <figure>
      <div>
        <svg
          viewBox={`0 0 ${points.length * step} 100`}
          preserveAspectRatio="none"
          role="img"
          aria-label={summary}
        >
          {points.map((point, i) => {
            const height = (point.value / max) * 98;
            return (
              <rect
                key={point.label}
                x={i * step + 1}
                y={100 - height}
                width={step - 2}
                height={height}
                fill="currentColor"
              >
                <title>{`${point.label}: ${format(point.value)}`}</title>
              </rect>
            );
          })}
        </svg>
      </div>
      <figcaption>{caption}</figcaption>
    </figure>
  );
}

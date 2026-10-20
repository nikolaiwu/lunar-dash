// A wide table on a narrow screen scrolls sideways inside this region,
// instead of widening the page. The region can take keyboard focus and has a
// name, so keyboard users can scroll it too.
export function TableScroll({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className="overflow-x-auto"
      role="region"
      aria-label={label}
      tabIndex={0}
    >
      {children}
    </div>
  );
}

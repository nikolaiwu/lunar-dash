import { Breadcrumbs, type Crumb } from "@/components/Breadcrumbs";
import { Toolbar } from "@/components/Toolbar";

// The top of every page: breadcrumbs, the page's h1 with an optional line
// below it, and the page's actions (a button, a link) at the other end. A
// flash message, the result of what was just done (lib/flash.ts), goes
// below them. The space below it is its own: the theme drops a last
// paragraph's margin.
export function PageHeader({
  title,
  description,
  breadcrumbs,
  actions,
  flash,
}: {
  title: string;
  description?: string;
  breadcrumbs?: Crumb[];
  actions?: React.ReactNode;
  flash?: string | null;
}) {
  return (
    <header className="mb-6">
      {breadcrumbs && <Breadcrumbs items={breadcrumbs} />}
      <Toolbar>
        <div>
          <h1>{title}</h1>
          {description && <p>{description}</p>}
        </div>
        {/* Top-aligned: an action that's a form (ActionButton) keeps the
            theme's margin below it, which would push it up against a bare
            button */}
        {actions && (
          <div className="flex flex-wrap items-start gap-4">{actions}</div>
        )}
      </Toolbar>
      {flash && <p role="status">{flash}</p>}
    </header>
  );
}

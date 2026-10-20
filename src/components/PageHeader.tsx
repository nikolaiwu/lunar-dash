import { Breadcrumbs, type Crumb } from "@/components/Breadcrumbs";
import { Toolbar } from "@/components/Toolbar";

// The top of every page: breadcrumbs, the page's h1 with an optional line
// below it, and the page's actions (a button, a link) at the other end. The
// space below it is its own: the theme drops a last paragraph's margin.
export function PageHeader({
  title,
  description,
  breadcrumbs,
  actions,
}: {
  title: string;
  description?: string;
  breadcrumbs?: Crumb[];
  actions?: React.ReactNode;
}) {
  return (
    <header className="mb-6">
      {breadcrumbs && <Breadcrumbs items={breadcrumbs} />}
      <Toolbar>
        <div>
          <h1>{title}</h1>
          {description && <p>{description}</p>}
        </div>
        {actions}
      </Toolbar>
    </header>
  );
}

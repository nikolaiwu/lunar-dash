import Link from "next/link";

// What a list or a panel says when it has nothing to show, and the action
// that would fill it, if there is one: "No products yet. Add a product".
// For a filtered list, the action clears the filters.
export function EmptyState({
  message,
  action,
}: {
  message: string;
  action?: { href: string; label: string };
}) {
  return (
    <p>
      {message}
      {action && (
        <>
          {" "}
          <Link href={action.href}>{action.label}</Link>
        </>
      )}
    </p>
  );
}

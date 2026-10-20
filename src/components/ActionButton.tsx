// A button that runs a Server Action: a form of its own with the values the
// action needs as hidden fields. It works before the page's JavaScript has
// loaded, or without it.
export function ActionButton({
  action,
  values,
  children,
}: {
  action: (formData: FormData) => Promise<void>;
  values: Record<string, string>;
  children: React.ReactNode;
}) {
  return (
    <form action={action}>
      {Object.entries(values).map(([name, value]) => (
        <input key={name} type="hidden" name={name} value={value} />
      ))}
      <button type="submit">{children}</button>
    </form>
  );
}

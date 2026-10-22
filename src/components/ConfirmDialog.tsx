// A modal dialog that asks before something that can't be undone, such as
// cancelling an order. It opens from a button anywhere on the page, with no
// script (an invoker command):
//
//   <button type="button" commandfor="cancel-order" command="show-modal">
//
// Confirming runs the Server Action, with `values` as hidden fields; the
// other button closes the dialog. Browsers older than invoker commands
// (before Chrome 135, Firefox 144, Safari 26.2) don't open it.
export function ConfirmDialog({
  id,
  title,
  children,
  action,
  values,
  confirm,
  dismiss,
}: {
  id: string;
  title: string;
  // What will happen, in a sentence or two
  children: React.ReactNode;
  action: (formData: FormData) => Promise<void>;
  values: Record<string, string>;
  confirm: string;
  dismiss: string;
}) {
  return (
    <dialog id={id} aria-labelledby={`${id}-title`}>
      <h2 id={`${id}-title`}>{title}</h2>
      {children}
      <form action={action}>
        {Object.entries(values).map(([name, value]) => (
          <input key={name} type="hidden" name={name} value={value} />
        ))}
        {/* The buttons in a div of their own, so LunarCSS joins the two into
            a group and the hidden inputs before them don't count as part of
            it (its group rules take any input as a neighbour) */}
        <div>
          <button type="submit">{confirm}</button>
          <button type="button" commandfor={id} command="close">
            {dismiss}
          </button>
        </div>
      </form>
    </dialog>
  );
}

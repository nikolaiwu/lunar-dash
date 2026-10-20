// Invoker commands: a button that opens or closes a dialog (or a popover)
// with no script, as <button commandfor="id" command="show-modal">. React
// renders the attributes as they're written but doesn't type them yet.
import "react";

declare module "react" {
  // T is unused, but the declaration has to match React's to merge with it
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ButtonHTMLAttributes<T> {
    // The id of the element the command acts on
    commandfor?: string;
    command?:
      | "show-modal"
      | "close"
      | "request-close"
      | "show-popover"
      | "hide-popover"
      | "toggle-popover";
  }
}

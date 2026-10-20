// A row of things that belong together above a list or a page: a heading and
// its actions, a filter form and a button. They sit on one line, bottom
// aligned (so a button lines up with a labelled field), pushed to either
// end, and wrap on a narrow screen.
//
// Put a row of form controls in its own <form> inside the toolbar, not
// straight in it: the form keeps the theme's spacing below it. LunarCSS's
// layout stylesheet turns a parent of only controls into a row, with text
// fields that grow; without it, the theme's controls are full width and stack.
export function Toolbar({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      {children}
    </div>
  );
}

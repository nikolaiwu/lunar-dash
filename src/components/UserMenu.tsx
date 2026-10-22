import Link from "next/link";
import type { User } from "@/lib/session";
import { signOut } from "@/app/sign-in/actions";

// The signed-in user's menu: a button that opens a popover, with the user's
// name and email, a link to the settings and a sign-out button. The Popover
// API opens and closes it (and closes it on Escape or a click outside), with
// no JavaScript of ours.
export function UserMenu({ user }: { user: User }) {
  return (
    <>
      <button type="button" popoverTarget="user-menu">
        {user.name}
      </button>
      <div id="user-menu" popover="auto">
        <p>
          <strong>{user.name}</strong>
          <br />
          <small>{user.email}</small>
        </p>
        <ul>
          <li>
            <Link href="/settings">Settings</Link>
          </li>
        </ul>
        <form action={signOut}>
          <button type="submit">Sign out</button>
        </form>
      </div>
    </>
  );
}

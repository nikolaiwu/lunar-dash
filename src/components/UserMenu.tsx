import Link from "next/link";
import { getCurrentUser } from "@/lib/session";

// The signed-in user's menu: a button that opens a popover, with the user's
// name and email, a link to the settings and a sign-out button. The Popover
// API opens and closes it (and closes it on Escape or a click outside), with
// no JavaScript of ours.
export async function UserMenu() {
  const user = await getCurrentUser();

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
        {/* Becomes a Server Action that clears the session (0.6) */}
        <form action="/sign-in">
          <button type="submit">Sign out</button>
        </form>
      </div>
    </>
  );
}

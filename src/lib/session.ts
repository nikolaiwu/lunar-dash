// Who is signed in. The demo has no real authentication: any email and
// password sign in, and the session is a cookie with the user's name and
// email, unsigned. To use real sign-in (Auth.js or similar), replace these
// functions: the proxy, the header and every Server Action only go through
// them.

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const SESSION_COOKIE = "lunar-dash-session";

export interface User {
  name: string;
  email: string;
}

function parse(value: string | undefined): User | null {
  if (!value) return null;
  try {
    const user = JSON.parse(value);
    return typeof user?.name === "string" && typeof user?.email === "string"
      ? { name: user.name, email: user.email }
      : null;
  } catch {
    return null;
  }
}

export async function getCurrentUser(): Promise<User | null> {
  return parse((await cookies()).get(SESSION_COOKIE)?.value);
}

// For Server Actions: the user, or off to the sign-in page. An action is a
// POST endpoint anyone can call, so each one checks, whatever the page
// showed.
export async function requireUser(): Promise<User> {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");
  return user;
}

// From a Server Action: sign in as this user, or update the user's details
export async function startSession(user: User) {
  (await cookies()).set(SESSION_COOKIE, JSON.stringify(user), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

export async function endSession() {
  (await cookies()).delete(SESSION_COOKIE);
}

// A flash message: a line a Server Action leaves for the page it redirects
// to ("Order #1042 marked shipped."), shown there once.
//
// The action puts it in a cookie, which is how it reaches the next page
// without JavaScript: the browser follows the redirect with a new request.
// A page can't delete a cookie while it renders, so the proxy (src/proxy.ts)
// does, and hands the message to the page it's for in a request header. Any
// other request (a prefetch, say) doesn't get it.
//
// With JavaScript, the action's response carries the page it redirects to,
// rendered with the cookie the action just set, so the page reads it there.

import { cookies, headers } from "next/headers";

export const FLASH_COOKIE = "lunar-dash-flash";
export const FLASH_HEADER = "x-lunar-dash-flash";

interface Flash {
  // The page it's for
  path: string;
  message: string;
}

export function parseFlash(value: string | undefined): Flash | null {
  if (!value) return null;
  try {
    const flash = JSON.parse(value);
    return typeof flash?.path === "string" && typeof flash?.message === "string"
      ? flash
      : null;
  } catch {
    return null;
  }
}

// From a Server Action, before it redirects to `path`
export async function setFlash(path: string, message: string) {
  (await cookies()).set(
    FLASH_COOKIE,
    JSON.stringify({ path: path.split("?")[0], message }),
    {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      // If it's never shown, it doesn't wait for a later visit
      maxAge: 60,
    },
  );
}

// From a page, with its path: the message left for it, if any
export async function getFlash(path: string): Promise<string | null> {
  const header = (await headers()).get(FLASH_HEADER);
  if (header) return decodeURIComponent(header);
  const flash = parseFlash((await cookies()).get(FLASH_COOKIE)?.value);
  return flash?.path === path ? flash.message : null;
}

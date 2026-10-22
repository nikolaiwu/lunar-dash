// A flash: what a Server Action leaves for the page it redirects to, shown
// there once. Either a message ("Order #1042 marked shipped."), or a form
// that didn't pass validation: what was entered, and what's wrong with it
// (lib/form.ts).
//
// The action puts it in a cookie, which is how it reaches the next page
// without JavaScript: the browser follows the redirect with a new request.
// A page can't delete a cookie while it renders, so the proxy (src/proxy.ts)
// does, and hands the flash to the page it's for in a request header. Any
// other request (a prefetch, say) doesn't get it.
//
// With JavaScript, the action's response carries the page it redirects to,
// rendered with the cookie the action just set, so the page reads it there.

import { cookies, headers } from "next/headers";
import type { FormState } from "@/lib/form";

export const FLASH_COOKIE = "lunar-dash-flash";
export const FLASH_HEADER = "x-lunar-dash-flash";

export interface Flash {
  message?: string;
  form?: FormState;
}

interface Stored extends Flash {
  // The page it's for
  path: string;
}

export function parseFlash(value: string | undefined): Stored | null {
  if (!value) return null;
  try {
    const flash = JSON.parse(value);
    return typeof flash?.path === "string" ? flash : null;
  } catch {
    return null;
  }
}

// From a Server Action, before it redirects to `path`
export async function setFlash(path: string, flash: Flash) {
  (await cookies()).set(
    FLASH_COOKIE,
    JSON.stringify({ ...flash, path: path.split("?")[0] }),
    {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      // If it's never shown, it doesn't wait for a later visit
      maxAge: 60,
    },
  );
}

// From a page, with its path: what was left for it, if anything
export async function getFlash(path: string): Promise<Flash> {
  const header = (await headers()).get(FLASH_HEADER);
  const stored = header
    ? parseFlash(decodeURIComponent(header))
    : parseFlash((await cookies()).get(FLASH_COOKIE)?.value);
  if (stored?.path !== path) return {};
  return {
    message: typeof stored.message === "string" ? stored.message : undefined,
    form: stored.form,
  };
}

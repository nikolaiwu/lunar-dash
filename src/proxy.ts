// Runs before page requests, for two things:
//
// - Signing in: a visitor without a session goes to the sign-in page, and
//   one with a session skips it. Only a quick check of the cookie, to send
//   people the right way: every Server Action checks the user again
//   (lib/session.ts), since an action can be called without the page.
// - Flash messages: shown once (see src/lib/flash.ts). On a GET it deletes
//   the flash cookie and hands the flash to the page it's for in a request
//   header: Next applies the deletion to the cookies the page reads, so the
//   page can't read it from the cookie.

import { NextResponse, type NextRequest } from "next/server";
import { FLASH_COOKIE, FLASH_HEADER, parseFlash } from "@/lib/flash";
import { SESSION_COOKIE } from "@/lib/session";

const SIGN_IN = "/sign-in";

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const signedIn = request.cookies.has(SESSION_COOKIE);

  // A Server Action is a POST: it checks the user itself, and sets a flash
  // of its own
  if (request.method !== "GET") return NextResponse.next();

  if (!signedIn && pathname !== SIGN_IN) {
    const url = new URL(SIGN_IN, request.url);
    // Back here after signing in, unless here is the home page
    if (pathname !== "/") url.searchParams.set("next", pathname + search);
    return NextResponse.redirect(url);
  }
  if (signedIn && pathname === SIGN_IN) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Only the proxy sets the header: drop one sent from outside
  const headers = new Headers(request.headers);
  headers.delete(FLASH_HEADER);

  const cookie = request.cookies.get(FLASH_COOKIE);
  const flash = parseFlash(cookie?.value);
  if (flash?.path === pathname) {
    headers.set(FLASH_HEADER, encodeURIComponent(cookie!.value));
  }

  const response = NextResponse.next({ request: { headers } });
  if (cookie) response.cookies.delete(FLASH_COOKIE);
  return response;
}

export const config = {
  // Not Next's built files or images. Page data requests (prefetches end in
  // .rsc) must stay in, or they'd skip the flash's deletion.
  matcher: ["/((?!_next/static|_next/image|favicon\\.ico).*)"],
};

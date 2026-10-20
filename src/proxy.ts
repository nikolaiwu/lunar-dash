// Runs before page requests. Its one job: show a flash message once (see
// src/lib/flash.ts). It deletes the flash cookie and hands the message to
// the page it's for in a request header: Next applies the deletion to the
// cookies the page reads, so the page can't read it from the cookie.

import { NextResponse, type NextRequest } from "next/server";
import { FLASH_COOKIE, FLASH_HEADER, parseFlash } from "@/lib/flash";

export function proxy(request: NextRequest) {
  // A Server Action is a POST, and sets a flash of its own
  if (request.method !== "GET") return NextResponse.next();

  // Only the proxy sets the header: drop one sent from outside
  const headers = new Headers(request.headers);
  headers.delete(FLASH_HEADER);

  const cookie = request.cookies.get(FLASH_COOKIE);
  const flash = parseFlash(cookie?.value);
  if (flash?.path === request.nextUrl.pathname) {
    headers.set(FLASH_HEADER, encodeURIComponent(flash.message));
  }

  const response = NextResponse.next({ request: { headers } });
  if (cookie) response.cookies.delete(FLASH_COOKIE);
  return response;
}

export const config = {
  // Not Next's built files or images. Page data requests (prefetches end in
  // .rsc) must stay in, or they'd skip the deletion.
  matcher: ["/((?!_next/static|_next/image|favicon\\.ico).*)"],
};

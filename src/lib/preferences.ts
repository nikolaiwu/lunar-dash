// The visitor's settings: appearance (light, dark or the system's, and an
// accent colour) and which notifications they want. Kept in a cookie, so the
// root layout can put the appearance on <html> as the page is rendered: no
// flash of the wrong theme, and no script.

import { cookies } from "next/headers";

const COOKIE = "lunar-dash-preferences";

export const themes = ["system", "light", "dark"] as const;
export type Theme = (typeof themes)[number];

export interface Preferences {
  theme: Theme;
  // A hex colour for --lunar-accent, or null for the theme's own
  accent: string | null;
  // Which notifications are on, by name (src/app/settings)
  notifications: string[];
}

const DEFAULTS: Preferences = {
  theme: "system",
  accent: null,
  notifications: ["orders", "stock"],
};

export const HEX = /^#[0-9a-f]{6}$/i;

// LunarCSS's own --lunar-accent (solar orange): what the colour picker
// shows when no accent is set
export const THEME_ACCENT = "#ff5623";

// Anything that isn't valid falls back to the default: the cookie comes from
// the browser
function parse(value: string | undefined): Preferences {
  try {
    const saved = JSON.parse(value ?? "{}");
    return {
      theme: themes.includes(saved.theme) ? saved.theme : DEFAULTS.theme,
      accent:
        typeof saved.accent === "string" && HEX.test(saved.accent)
          ? saved.accent
          : null,
      notifications: Array.isArray(saved.notifications)
        ? saved.notifications.filter((n: unknown) => typeof n === "string")
        : DEFAULTS.notifications,
    };
  } catch {
    return DEFAULTS;
  }
}

export async function getPreferences(): Promise<Preferences> {
  return parse((await cookies()).get(COOKIE)?.value);
}

// From a Server Action: change some of the settings, keep the rest
export async function savePreferences(changes: Partial<Preferences>) {
  const jar = await cookies();
  const preferences = { ...parse(jar.get(COOKIE)?.value), ...changes };
  jar.set(COOKIE, JSON.stringify(preferences), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });
}

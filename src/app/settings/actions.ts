"use server";

// The settings page's forms: one action each. Each checks for a signed-in
// user, saves, and comes back to the settings with a flash message (or the
// form's errors).

import { redirect } from "next/navigation";
import { resetChanges } from "@/lib/data";
import { setFlash } from "@/lib/flash";
import { sendBack, textValues } from "@/lib/form";
import {
  HEX,
  savePreferences,
  THEME_ACCENT,
  themes,
  type Theme,
} from "@/lib/preferences";
import { requireUser, startSession } from "@/lib/session";
import { notifications } from "./options";

const PATH = "/settings";

async function done(message: string): Promise<never> {
  await setFlash(PATH, { message });
  redirect(PATH);
}

export async function saveProfile(formData: FormData) {
  await requireUser();
  const values = textValues(formData, ["name", "email"]);
  const errors: Record<string, string> = {};
  if (!values.name) errors.name = "Enter your name.";
  else if (values.name.length > 60)
    errors.name = "Keep your name to 60 characters or fewer.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email))
    errors.email = "Enter your email address, like alex@example.com.";
  if (Object.keys(errors).length) return sendBack(PATH, { values, errors });

  await startSession({ name: values.name, email: values.email });
  return done("Profile saved.");
}

export async function saveNotifications(formData: FormData) {
  await requireUser();
  const chosen = formData.getAll("notifications").map(String);
  await savePreferences({
    notifications: notifications
      .map((option) => option.value)
      .filter((value) => chosen.includes(value)),
  });
  return done("Notifications saved.");
}

export async function saveAppearance(formData: FormData) {
  await requireUser();
  const theme = String(formData.get("theme")) as Theme;
  const accent = String(formData.get("accent") ?? "").toLowerCase();
  // The form can't send anything else unless it's been tampered with
  if (!themes.includes(theme) || !HEX.test(accent)) redirect(PATH);

  await savePreferences({
    theme,
    accent: accent === THEME_ACCENT ? null : accent,
  });
  return done("Appearance saved.");
}

export async function resetAccent() {
  await requireUser();
  await savePreferences({ accent: null });
  return done("The accent is the theme's again.");
}

export async function resetData() {
  await requireUser();
  await resetChanges();
  return done("The demo data is back to how it started.");
}

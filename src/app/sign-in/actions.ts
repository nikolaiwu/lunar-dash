"use server";

// Signing in and out. The demo takes any email and password: it only checks
// that they're filled in and that the email looks like one. Real sign-in
// replaces these, and lib/session.ts.

import { redirect } from "next/navigation";
import { sendBack, textValues } from "@/lib/form";
import { endSession, startSession } from "@/lib/session";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// "alex.morgan@…" → "Alex Morgan": a name to show until the user sets one
function nameFrom(email: string) {
  return email
    .split("@")[0]
    .split(/[._-]+/)
    .filter(Boolean)
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join(" ");
}

// Only a path in this app: never another site
function safeNext(value: FormDataEntryValue | null) {
  const next = String(value ?? "");
  return next.startsWith("/") && !next.startsWith("//") ? next : "/";
}

export async function signIn(formData: FormData) {
  const { email } = textValues(formData, ["email"]);
  const password = String(formData.get("password") ?? "");
  const next = safeNext(formData.get("next"));

  const errors: Record<string, string> = {};
  if (!EMAIL.test(email))
    errors.email = "Enter your email address, like alex@example.com.";
  if (!password) errors.password = "Enter your password.";
  if (Object.keys(errors).length) {
    // The password never comes back
    return sendBack("/sign-in", { values: { email, next }, errors });
  }

  await startSession({ name: nameFrom(email) || email, email });
  redirect(next);
}

export async function signOut() {
  await endSession();
  redirect("/sign-in");
}

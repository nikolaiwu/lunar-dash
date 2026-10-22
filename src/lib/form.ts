// What every form's Server Action works with: the values as entered, and an
// error per field that's wrong. An action that finds errors sends the form
// back to its page with both (`sendBack`), and the page hands them to its
// fields (components/Field.tsx) and to the error summary at the top
// (components/ErrorSummary.tsx). The same shape for every form, so the same
// components show any form's errors.

import { redirect } from "next/navigation";
import { setFlash } from "@/lib/flash";

export interface FormState {
  // As entered, so the form comes back filled in (files can't come back)
  values: Record<string, string>;
  // By field name, a sentence each, in the order the fields appear
  errors: Record<string, string>;
}

// The text fields of a submission, trimmed, by name
export function textValues(formData: FormData, names: string[]) {
  return Object.fromEntries(
    names.map((name) => [name, String(formData.get(name) ?? "").trim()]),
  );
}

// Back to the form's page with what was entered and what's wrong
export async function sendBack(path: string, form: FormState): Promise<never> {
  await setFlash(path, { form });
  redirect(path);
}

export function hasErrors(errors: Record<string, string>) {
  return Object.keys(errors).length > 0;
}

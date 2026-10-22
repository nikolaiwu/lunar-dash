import type { Metadata } from "next";
import { ActionButton } from "@/components/ActionButton";
import { Choices } from "@/components/Choices";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { ErrorSummary } from "@/components/ErrorSummary";
import { Field } from "@/components/Field";
import { FieldGrid } from "@/components/FieldGrid";
import { PageHeader } from "@/components/PageHeader";
import { getFlash } from "@/lib/flash";
import { getPreferences, THEME_ACCENT } from "@/lib/preferences";
import { getCurrentUser } from "@/lib/session";
import {
  resetAccent,
  resetData,
  saveAppearance,
  saveNotifications,
  saveProfile,
} from "./actions";
import { notifications, themeOptions } from "./options";

export const metadata: Metadata = { title: "Settings" };

export default async function SettingsPage() {
  const [user, preferences, flash] = await Promise.all([
    getCurrentUser(),
    getPreferences(),
    getFlash("/settings"),
  ]);
  const form = flash.form;

  return (
    <>
      <PageHeader
        title="Settings"
        breadcrumbs={[
          { label: "Overview", href: "/" },
          { label: "Settings", href: "/settings" },
        ]}
        flash={flash.message}
      />
      <ErrorSummary errors={form?.errors ?? {}} />

      <section>
        <h2>Profile</h2>
        <form action={saveProfile}>
          <FieldGrid>
            <Field
              label="Name"
              name="name"
              autoComplete="name"
              form={form}
              defaultValue={user?.name}
              required
              maxLength={60}
            />
            <Field
              label="Email"
              name="email"
              type="email"
              autoComplete="email"
              form={form}
              defaultValue={user?.email}
              required
            />
          </FieldGrid>
          <button type="submit">Save profile</button>
        </form>
      </section>

      <section>
        <h2>Notifications</h2>
        <form action={saveNotifications}>
          <Choices
            legend="Email me when"
            name="notifications"
            type="checkbox"
            options={notifications}
            checked={preferences.notifications}
          />
          <button type="submit">Save notifications</button>
        </form>
      </section>

      <section>
        <h2>Appearance</h2>
        <form action={saveAppearance}>
          <Choices
            legend="Colours"
            name="theme"
            type="radio"
            options={themeOptions}
            checked={[preferences.theme]}
          />
          <Field
            label="Accent colour"
            name="accent"
            type="color"
            hint="Buttons, links, focus and checked controls. It sets LunarCSS's --lunar-accent token."
            defaultValue={preferences.accent ?? THEME_ACCENT}
          />
          <button type="submit">Save appearance</button>
        </form>
        {preferences.accent && (
          <ActionButton action={resetAccent} values={{}}>
            Use the theme&apos;s accent
          </ActionButton>
        )}
      </section>

      <section>
        <h2>Danger zone</h2>
        <p>
          Undo every change you&apos;ve made to the demo&apos;s orders,
          customers and products.
        </p>
        <button type="button" commandfor="reset-data" command="show-modal">
          Reset demo data
        </button>
        <ConfirmDialog
          id="reset-data"
          title="Reset the demo data?"
          action={resetData}
          values={{}}
          confirm="Reset demo data"
          dismiss="Keep my changes"
        >
          <p>
            Your changes to orders, customers and products are undone. Your
            settings stay. You can&apos;t undo this.
          </p>
        </ConfirmDialog>
      </section>
    </>
  );
}

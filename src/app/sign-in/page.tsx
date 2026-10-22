import type { Metadata } from "next";
import { ErrorSummary } from "@/components/ErrorSummary";
import { Field } from "@/components/Field";
import { Narrow } from "@/components/Narrow";
import { PageHeader } from "@/components/PageHeader";
import { getFlash } from "@/lib/flash";
import { signIn } from "./actions";

// Renders in full for each request, from the URL: the root layout's
// instant = false doesn't reach a page that reads it
export const instant = false;

export const metadata: Metadata = { title: "Sign in" };

export default async function SignInPage({
  searchParams,
}: PageProps<"/sign-in">) {
  const { next } = await searchParams;
  const { form } = await getFlash("/sign-in");

  return (
    <Narrow>
      <PageHeader
        title="Sign in"
        description="This is a demo: any email and password will do."
      />
      <ErrorSummary errors={form?.errors ?? {}} />
      <form action={signIn}>
        <input
          type="hidden"
          name="next"
          value={form?.values.next ?? (typeof next === "string" ? next : "")}
        />
        <Field
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          form={form}
          defaultValue="alex@acme-robotics.example"
          required
        />
        <Field
          label="Password"
          name="password"
          type="password"
          autoComplete="current-password"
          form={form}
          required
        />
        <button type="submit">Sign in</button>
      </form>
    </Narrow>
  );
}

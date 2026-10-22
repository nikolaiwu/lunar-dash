import type { FormState } from "@/lib/form";
import type { Option } from "@/resources/types";

type InputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "name" | "id" | "form" | "children"
>;

// One labelled form field: an input (or a select, given options), with an
// optional hint, and the server's error for it when the form comes back
// (lib/form.ts). The hint and the error are tied to the control with
// aria-describedby, and an error sets aria-invalid. A form that comes back
// shows what was entered, except in a file input.
//
// Native validation (required, type, min, pattern…) stops most mistakes in
// the browser; the server checks everything again, and what only it can
// check (an SKU already in use).
export function Field({
  label,
  name,
  hint,
  form,
  options,
  ...input
}: {
  label: string;
  name: string;
  hint?: string;
  form?: FormState;
  options?: Option[];
} & InputProps) {
  const id = `field-${name}`;
  const error = form?.errors[name];
  const describedBy =
    [hint && `${id}-hint`, error && `${id}-error`].filter(Boolean).join(" ") ||
    undefined;
  const value =
    input.type === "file"
      ? undefined
      : (form?.values[name] ?? input.defaultValue);
  const control = {
    id,
    name,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": describedBy,
  };

  return (
    <div>
      <label htmlFor={id}>{label}</label>
      {hint && (
        <p id={`${id}-hint`}>
          <small>{hint}</small>
        </p>
      )}
      {error && (
        <p id={`${id}-error`}>
          <strong>{error}</strong>
        </p>
      )}
      {options ? (
        <select
          {...control}
          required={input.required}
          defaultValue={value === undefined ? undefined : String(value)}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : (
        <input {...input} {...control} defaultValue={value} />
      )}
    </div>
  );
}

import type { Option } from "@/resources/types";

// An action for the rows ticked in a list: a choice of what to do, and a
// button. The form has an id, and the DataTable's checkboxes name it in
// their form attribute, so they're sent with it from wherever they are.
// `back` is the list's URL, to return to the same view afterwards.
export function BulkActions({
  id,
  action,
  label,
  name,
  options,
  back,
}: {
  id: string;
  action: (formData: FormData) => Promise<void>;
  label: string;
  // The field the choice is sent as
  name: string;
  options: Option[];
  back: string;
}) {
  return (
    <form id={id} action={action} className="flex flex-wrap items-end gap-x-4">
      <input type="hidden" name="back" value={back} />
      <div className="grow basis-(--dash-field-width)">
        <label htmlFor={`${id}-${name}`}>{label}</label>
        <select id={`${id}-${name}`} name={name} required defaultValue="">
          <option value="" disabled>
            Choose an action
          </option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      <button type="submit">Apply</button>
    </form>
  );
}

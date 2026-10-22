import type { Option } from "@/resources/types";

// A group of checkboxes (any number of choices) or radios (one), in a
// fieldset whose legend asks the question. The first control's id is
// field-<name>, so an error summary can link to the group.
export function Choices({
  legend,
  name,
  type,
  options,
  checked,
}: {
  legend: string;
  name: string;
  type: "checkbox" | "radio";
  options: Option[];
  // The values that start out checked
  checked: string[];
}) {
  return (
    <fieldset>
      <legend>{legend}</legend>
      {options.map((option, i) => (
        <label key={option.value}>
          <input
            type={type}
            id={i === 0 ? `field-${name}` : undefined}
            name={name}
            value={option.value}
            defaultChecked={checked.includes(option.value)}
          />
          {option.label}
        </label>
      ))}
    </fieldset>
  );
}

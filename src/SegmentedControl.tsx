// A choice of one option from a few, shown side by side. Underneath it's a group of radio
// buttons, so arrow keys move between options and a screen reader says how many there
// are, with no key handling written here. The selected look comes from CSS :has(:checked).

import { type ReactNode, useId } from "react";

interface SegmentedControlProps<Value extends string> {
  /** What the choice is, for screen readers: "Show", "Sort by". Not displayed. */
  label: string;
  options: readonly { value: Value; label: ReactNode }[];
  value: Value;
  onChange: (value: Value) => void;
}

export function SegmentedControl<Value extends string>({
  label,
  options,
  value,
  onChange,
}: SegmentedControlProps<Value>) {
  // Radio buttons form one group by sharing a name.
  const name = useId();
  return (
    <fieldset className="flex rounded-full bg-muted p-1 text-sm">
      <legend className="sr-only">{label}</legend>
      {options.map((option) => (
        <label
          key={option.value}
          className="flex min-h-11 cursor-pointer items-center rounded-full px-4 text-muted-foreground has-checked:bg-card has-checked:font-medium has-checked:text-foreground has-checked:shadow-sm has-focus-visible:outline-2 has-focus-visible:outline-ring has-focus-visible:outline-offset-2"
        >
          <input
            type="radio"
            className="sr-only"
            name={name}
            value={option.value}
            checked={option.value === value}
            onChange={() => onChange(option.value)}
          />
          {option.label}
        </label>
      ))}
    </fieldset>
  );
}

// A checkbox with its label, the whole row 44px tall so it's easy to tap. The box takes the
// brand color. Takes every native checkbox prop (`checked`, `onChange`). `className` is for
// placing the row.

import type { ComponentProps, ReactNode } from "react";
import { joinClasses } from "./joinClasses.js";

interface CheckboxProps extends Omit<ComponentProps<"input">, "type"> {
  label: ReactNode;
}

export function Checkbox({ label, className, ...props }: CheckboxProps) {
  return (
    <label
      className={joinClasses(
        "flex min-h-11 cursor-pointer items-center gap-2 text-sm has-disabled:cursor-default has-disabled:opacity-50",
        className,
      )}
    >
      <input type="checkbox" className="size-4 accent-primary" {...props} />
      {label}
    </label>
  );
}

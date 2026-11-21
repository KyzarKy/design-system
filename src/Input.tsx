// A text box with the look of Select: the same edge, height, and 16px text, so iOS doesn't
// zoom in on focus. Takes every native input prop (`type="search"`, `placeholder`). Name it
// with a <label htmlFor> or `aria-label`. `className` is for placing it (max-w-xs).

import type { ComponentProps } from "react";
import { joinClasses } from "./joinClasses.js";

export function Input({ className, ...props }: ComponentProps<"input">) {
  return <input className={joinClasses("ui-input", className)} {...props} />;
}

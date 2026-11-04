// A native <select> with room for its caret. In a browser with `appearance: base-select` its
// open list follows the design system too (ADR 0006): rounded, with no gap around the
// highlighted option, and that includes Chrome on Android, whose list becomes a popover in
// the page. Elsewhere, Safari on iPhone included, the browser draws the list. Keyboard and
// screen reader behavior stay native. 16px text, so iOS doesn't zoom in on focus. Name it
// with a <label htmlFor>. For one choice from a list: `multiple` and `size` would keep the
// caret and aren't styled. `className` is for placing it (max-w-xs).

import type { ComponentProps } from "react";
import { joinClasses } from "./joinClasses.js";

export function Select({ className, ...props }: ComponentProps<"select">) {
  return <select className={joinClasses("ui-select", className)} {...props} />;
}

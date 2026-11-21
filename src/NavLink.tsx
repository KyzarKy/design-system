// One row of a navigation list, such as a sidebar: a link that fills the row, 36px tall, or
// 44px on a touch screen. `current` marks the page you're on, filled with the brand color
// and announced as the current page. `className` is for placing it, or dimming a row with
// text-muted-foreground.

import type { ComponentProps } from "react";
import { joinClasses } from "./joinClasses.js";

export function NavLink({
  current,
  className,
  ...props
}: ComponentProps<"a"> & { current?: boolean }) {
  return (
    <a
      aria-current={current ? "page" : undefined}
      className={joinClasses(
        "flex min-h-9 items-center rounded-lg px-3 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2 pointer-coarse:min-h-11",
        current ? "bg-primary font-medium text-primary-foreground" : "hover:bg-muted",
        className,
      )}
      {...props}
    />
  );
}

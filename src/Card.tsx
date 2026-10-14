// A raised surface holding one topic. It's a <section>, so name it with aria-labelledby
// or aria-label. `className` is for laying out what's inside (flex, gap).

import type { ComponentProps } from "react";
import { joinClasses } from "./joinClasses.js";

export function Card({ className, ...props }: ComponentProps<"section">) {
  return (
    <section
      className={joinClasses(
        "rounded-2xl border border-border bg-card p-5 text-card-foreground shadow-sm",
        className,
      )}
      {...props}
    />
  );
}

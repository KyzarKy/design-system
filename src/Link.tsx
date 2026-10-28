// A link: an <a> that goes somewhere, and looks it in every state: underlined, a pointer,
// a thicker underline on hover, and a focus ring. Anything that does something instead
// (fills a box, switches a view, erases data) is a Button. `className` is for placing it.

import type { ComponentProps } from "react";
import { joinClasses } from "./joinClasses.js";

export function Link({ className, ...props }: ComponentProps<"a">) {
  return (
    <a
      className={joinClasses(
        "cursor-pointer rounded-sm text-primary underline underline-offset-4 hover:decoration-2 focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2",
        className,
      )}
      {...props}
    />
  );
}

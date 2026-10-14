// A button in one of three looks. The props follow shadcn/ui's Button (`variant`, `size`),
// so an app using that one can switch by changing an import (ADR 0002). Every size is at
// least 44px tall. `className` is for placing the button (flex-1, w-full).

import type { ComponentProps } from "react";
import { joinClasses } from "./joinClasses.js";

const VARIANTS = {
  /** Filled with the brand color: the main action. */
  default: "bg-primary text-primary-foreground hover:bg-primary/90 active:bg-primary/80",
  /** An edge and the card color: a second action beside a filled one. */
  outline: "border border-input bg-card hover:bg-muted active:bg-muted",
  /** Nothing until hovered: a quiet action, such as an icon in a toolbar. */
  ghost: "hover:bg-muted active:bg-muted",
};

const SIZES = {
  default: "px-5",
  /** Square, for a single icon. Give the button an aria-label. */
  icon: "w-11",
};

interface ButtonProps extends ComponentProps<"button"> {
  variant?: keyof typeof VARIANTS;
  size?: keyof typeof SIZES;
}

export function Button({
  variant = "default",
  size = "default",
  // A bare <button> inside a form submits it. Submitting should be asked for.
  type = "button",
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={joinClasses(
        "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2 disabled:pointer-events-none disabled:opacity-50",
        VARIANTS[variant],
        SIZES[size],
        className,
      )}
      {...props}
    />
  );
}

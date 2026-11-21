// A short label in a pill: a status or a kind, beside the thing it describes. Each tone is
// its color as text on a /15 badge of itself, the pairs theme.test.ts checks for contrast.

import type { ReactNode } from "react";

const TONES = {
  primary: "bg-primary/15 text-primary",
  success: "bg-success/15 text-success",
  warning: "bg-warning/15 text-warning",
  destructive: "bg-destructive/15 text-destructive",
};

export function Tag({
  tone = "primary",
  children,
}: {
  tone?: keyof typeof TONES;
  children: ReactNode;
}) {
  return (
    <span className={`rounded-full px-2 py-0.5 font-medium text-xs ${TONES[tone]}`}>
      {children}
    </span>
  );
}

// One row of a List: a label, a detail on the right, and room below for a graphic such as
// a Meter (ADR 0002). There is less space inside a row (8px) than between two rows'
// contents (24px and a divider), so each label reads as belonging to its own graphic.

import type { ReactNode } from "react";

interface ListRowProps {
  label: ReactNode;
  /** Secondary text on the right. If the row has a graphic, this states its value. */
  detail?: ReactNode;
  /** A graphic for the row, such as a `Meter`. */
  children?: ReactNode;
}

export function ListRow({ label, detail, children }: ListRowProps) {
  return (
    <li className="py-3">
      <div className="flex items-baseline justify-between gap-3 text-sm">
        <span>{label}</span>
        {detail && <span className="shrink-0 text-muted-foreground tabular-nums">{detail}</span>}
      </div>
      {children && <div className="mt-2">{children}</div>}
    </li>
  );
}

// A group of rows under an optional heading (ADR 0002). Rows are separated by dividers;
// groups are separated by space and their headings, so the two levels look different.

import type { ReactNode } from "react";

interface ListProps {
  /**
   * The heading element, at whatever level the page needs: `<h3>Grammar</h3>`. The level
   * is the page's to choose; the look is set here. Tailwind's preflight makes headings
   * inherit size and weight, so the wrapper's classes apply to it.
   */
  heading?: ReactNode;
  /** A line of help text between the heading and the rows. */
  description?: ReactNode;
  /** `ListRow`s. */
  children: ReactNode;
}

export function List({ heading, description, children }: ListProps) {
  return (
    // 32px above a group that follows something, against 24px between two rows' contents.
    <div className="mt-8 first:mt-0">
      {heading && <div className="font-semibold text-base">{heading}</div>}
      {description && <p className="mt-1 text-muted-foreground text-sm">{description}</p>}
      <ul className="mt-2 divide-y divide-border">{children}</ul>
    </div>
  );
}

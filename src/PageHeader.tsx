// The top of a page: its title, a one-sentence description, and the page's own links or
// actions. The parts sit 6px apart; the page leaves at least twice that between the header
// and what follows (the 1:2 rule). Below 640px the actions sit beside the title, so the
// header takes one line less on a phone; from 640px they get a row of their own; from 1024px
// they sit at the right of the whole header, so what follows moves up (ADR 0006).

import type { ReactNode } from "react";

interface PageHeaderProps {
  /** The page's name. Rendered as its only h1. */
  title: ReactNode;
  /** What the page is for, in one sentence. Body size: smaller text reads as small print. */
  description?: string;
  /** Links or buttons about the whole page, such as a `Link` to how it works. */
  actions?: ReactNode;
}

export function PageHeader({ title, description, actions }: PageHeaderProps) {
  return (
    <header
      className={`grid grid-cols-[1fr_auto] items-baseline gap-x-4 gap-y-1.5 sm:grid-cols-1 ${actions ? "lg:grid-cols-[1fr_auto] lg:gap-x-8" : ""}`}
    >
      <h1 className="font-semibold text-2xl leading-tight tracking-tight lg:col-start-1 lg:text-3xl">
        {title}
      </h1>
      {description && (
        <p className="col-span-2 max-w-prose text-muted-foreground sm:col-span-1 lg:col-start-1 lg:row-start-2">
          {description}
        </p>
      )}
      {/* Each action is at least 24px tall, the WCAG 2.5.8 target size. */}
      {actions && (
        <div
          className={`col-start-2 row-start-1 flex flex-wrap gap-x-4 gap-y-2 text-sm *:inline-flex *:min-h-6 *:items-center sm:col-start-1 sm:row-start-auto lg:col-start-2 lg:row-start-1 lg:justify-end lg:self-center ${description ? "lg:row-span-2" : ""}`}
        >
          {actions}
        </div>
      )}
    </header>
  );
}

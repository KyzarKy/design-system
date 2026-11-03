// A table whose cells share one horizontal padding, so headers, values, and dividers line up
// and the last column stays inside the dividers. Write plain <thead>, <tr>, <th>, and <td>
// inside it, with `text-right tabular-nums` on number columns. It scrolls sideways by itself
// when it can't fit. A row that opens something has a `TableAction` in its first cell.

import type { ComponentProps, ReactNode } from "react";
import { joinClasses } from "./joinClasses.js";

interface TableProps extends ComponentProps<"table"> {
  /** What the table shows. Rendered as its <caption>, so screen readers announce it. */
  caption?: ReactNode;
}

export function Table({ caption, className, children, ...props }: TableProps) {
  return (
    <div className="overflow-x-auto">
      <table
        className={joinClasses(
          "w-full text-left text-sm [&_tbody_tr]:border-border [&_tbody_tr]:border-b [&_td]:px-2 [&_td]:py-2 [&_th]:px-2 [&_th]:py-2 [&_th]:font-semibold [&_thead_tr]:border-border [&_thead_tr]:border-b",
          className,
        )}
        {...props}
      >
        {caption && <caption className="pb-2 text-left text-muted-foreground">{caption}</caption>}
        {children}
      </table>
    </div>
  );
}

/**
 * A button that fills its table cell, padding included, so the hover stays inside the table
 * and the text stays on the column's edge.
 */
export function TableAction({ className, ...props }: ComponentProps<"button">) {
  return (
    <button
      type="button"
      className={joinClasses(
        "-mx-2 -my-2 flex min-h-11 w-[calc(100%+1rem)] items-center px-2 text-left font-semibold transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-ring focus-visible:-outline-offset-2 active:bg-muted",
        className,
      )}
      {...props}
    />
  );
}

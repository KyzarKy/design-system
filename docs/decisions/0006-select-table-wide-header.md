# ADR 0006: Select, Table, and PageHeader on wide screens

**Status:** proposed, 2026-11-03. Ky reported the problems from the transit pipeline's editor,
and asked for them to be fixed here first. It's accepted when the pull request merges.

## Context

Three problems showed up in the transit pipeline. Its dropdowns and tables were hand-written in
the app, so the first two had nothing here to patch.

- **Dropdowns:** the caret sat too close to the edge. The open list was square, with a white gap
  under the highlighted option. The operating system draws that list, so CSS on a plain `<select>`
  can't change it.
- **Tables:** a row's button used a negative margin that the table's scroll box clipped, which
  cut off its hover. Its padding also moved the row names off their column's edge. Number cells
  had padding only on their left, so the last column sat flush against the table's right side.
- **Header:** at 1024px and up, the actions took a row of their own (ADR 0005), and the page
  below sat further down than it needed to.

## Decision

Make the same exception to ADR 0002 as ADRs 0004 and 0005, since each comes with a rule that's
only shared if the code that follows it is.

**`Select`** stays a native `<select>` and turns on `appearance: base-select` where supported.
MDN's compatibility data lists Chrome and Edge 135, Firefox 149, and Safari 27. An older browser
gets the operating system's list, the same as today, with the fixed caret.

| | Easy | Medium (taken) | Hard |
|---|---|---|---|
| What it is | Fix the caret only | Native select, styled list where supported | A custom listbox |
| Cost | A few lines | One utility in `theme.css` | Keyboard, screen reader, and phone behavior are all ours |
| Ceiling | The list stays square | Older browsers show a native list | None visually, but every bug is ours |

**`Table`** gives every cell the same horizontal padding. **`TableAction`** fills its cell, inside
the cell's padding, so nothing crosses the scroll box's edge.

**`PageHeader`** puts its actions at the right of the title and description from 1024px up, and
raises the title one step to `text-3xl`. Body text stays 16px. Spacing things further apart
vertically would push the page's content off the screen, so the extra width goes to one row
instead.

**Line length stays at `max-w-prose`.** 65ch fits about 78 characters of real text, because `ch` is
the width of a zero, which is wider than an average letter. WCAG 1.4.8 caps lines at 80 characters.
A description that doesn't fit should get shorter.

This replaces ADR 0005's "a row of their own from 640px up" for 1024px and up. Fluent Prior's
header will change the same way when it upgrades.

## Not decided here

- **Text inputs and textareas.** They share the look of `Select`, and could move here next.

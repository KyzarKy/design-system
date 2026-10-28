# ADR 0004: Modal and Link, before a second app needs them

**Status:** accepted, 2026-10-28, when #4 merged. Ky asked for both as design-system
rules.

## Context

ADR 0002 says a component waits until a second app needs it. Fluent Prior needed a modal
for "How it works" and a link style for the line that opens it, and Ky asked for both to be
rules here, not choices each app makes again: every modal has a title and a body, and
anything that looks like a link is one.

## Decision

Make an exception to ADR 0002 for `Modal` and `Link`, because they come with rules, and a
rule is only shared if the code that follows it is.

- **Links go somewhere; buttons do something.** An `<a>` is announced as a link and opens
  in a new tab on a middle click, so one that runs an action instead misleads both screen
  readers and people. `Link` is for `<a href>` only. A control that fills, switches,
  submits, or erases is a `Button`. In Fluent Prior that turned three link-styled actions
  into outline buttons, and made "How it works" a real link to `#how-it-works`, which opens
  the modal.
- **A modal has a title and a body.** The header holds the title and the close button and
  stays in view; only the body scrolls, so the way out is never scrolled away. The body is
  focusable, so a body with no controls in it can still be scrolled from the keyboard
  (axe's `scrollable-region-focusable`).
- **`Modal` is a native `<dialog>` opened with `showModal()`.** The browser traps focus,
  handles Escape, returns focus to the opener, and makes the page inert. The component adds
  the layout and closing on a click outside.

## Not decided here

- **Tabs.** Fluent Prior has them, but no rule came with them yet. They wait for a second
  app, per ADR 0002.
- **Overriding a component's own classes.** Fluent Prior's action bar needed `px-3!`,
  because two Tailwind utilities for the same property are decided by stylesheet order,
  not by class order. Merging classes (tailwind-merge, or fewer built-in classes) is its
  own decision.

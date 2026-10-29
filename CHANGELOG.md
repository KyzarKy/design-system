# Changelog

## 0.5.1

- **Fixed: the page behind an open `Modal` no longer scrolls on iPhone.** iOS Safari
  ignored 0.5.0's `overflow: hidden`, so `Modal` now pins the page in place while it's
  open and puts it back where it was on close. The rule in `theme.css` is gone.

## 0.5.0

`PageHeader`, two rules ([ADR 0005](docs/decisions/0005-page-header.md)), and a `Modal`
fix. No existing component's API changes.

- **`PageHeader`** is the top of a page: the `h1` title, a one-sentence description at
  body size, and the page's own links or actions, beside the title below 640px and on a
  row of their own from 640px up.
- **A new rule: a page starts with a `PageHeader`,** with the spacing in the README.
- **A new rule: a button never sits inside a paragraph.** It goes on its own row.
- **Fixed: the page behind an open `Modal` no longer scrolls,** from `theme.css`. And
  scrolling past the end of a modal's body no longer scrolls the page.

## 0.4.0

`Modal` and `Link`, extracted from Fluent Prior, and the two rules they follow
([ADR 0004](docs/decisions/0004-modal-and-link.md)). Nothing changes for apps that don't
use them.

- **`Modal`** is a native `<dialog>` with a title and a body. The header, with the title
  and the close button, stays in view while the body scrolls. Escape, the close button,
  or a click outside closes it.
- **`Link`** is an `<a>` that looks like a link in every state: underline, pointer, a
  thicker underline on hover, and a focus ring.
- **A new rule: links go somewhere; buttons do something.** A control that looks like a
  link but fills a box or switches a view should become a `Button`.

## 0.3.0

`Card`, `Button`, and `SegmentedControl` ([ADR 0002](docs/decisions/0002-first-scope.md)),
extracted from Fluent Prior. [Before and after](docs/audit/0.3.0-trial) of its page built
from them. Nothing changes for apps on 0.2.0 that don't use them.

Replacing an app's own markup with them changes three things:

- **An outlined button's edge is `input`, not `border`,** so it's darker: the same edge as
  a text field.
- **`Button`'s `type` defaults to `button`.** Pass `type="submit"` to submit a form.
- **`SegmentedControl` is radio buttons,** where Fluent Prior had toggle buttons with
  `aria-pressed`. Arrow keys now move between options, and a screen reader announces a
  radio group.

## 0.2.0

The first components ([ADR 0002](docs/decisions/0002-first-scope.md)): `List`, `ListRow`,
and `Meter`, for lists whose rows carry a graphic. Rows get a divider and more space
between them than inside them; groups get a heading and more space still.
[Before and after](docs/audit/0.2.0-trial) in Fluent Prior's "What you know" panel.

To upgrade from 0.1.0: nothing changes for the tokens. The package now needs React 19 as
a peer dependency, and `theme.css` has the app's Tailwind scan the package's `dist` folder.

## 0.1.0

The tokens ([ADR 0002](docs/decisions/0002-first-scope.md)): `theme.css`, with 14 color
tokens in shadcn/ui's names, each with a light and a dark value, and the Tailwind colors
that use them. The values are Fluent Prior's palette, with three changes for contrast:

- `success` and `warning` are darker in light mode, so their `/15` badges reach 4.5:1.
- `input` is new: the edge of a form control, at 3:1 or more on `card` and `background`.

Both themes need `light-dark()` (Safari 17.5, Chrome 123, Firefox 120, or later). A browser
without it gets the light theme ([ADR 0003](docs/decisions/0003-light-fallback-and-browser-check.md)).

### Moving an app's own tokens to this package

Install it, import `theme.css` after Tailwind, and delete the app's own token variables,
`@theme` mapping, and `body` colors. Then rename the classes. For Fluent Prior:

| Fluent Prior | @kyzarky/ui |
|---|---|
| `bg` | `background` |
| `text` | `foreground` |
| `surface` | `card` |
| `surface-muted` | `muted` |
| `muted` | `muted-foreground` |
| `border` | `border` |
| `accent`, `meter` | `primary` |
| `accent-text` | `primary-foreground` |
| `good` | `success` |
| `partly` | `warning` |
| `bad` | `destructive` |

`muted` changes meaning, so rename `muted` and `surface-muted` in a single pass. Done one
after the other, a find-and-replace for one can catch the other's results. Raw variables
change the same way (`var(--meter)` becomes `var(--primary)`). Give text fields
`border-input` instead of `border-border`, and focus rings `ring-ring`.

## 0.0.0

A placeholder with no theme in it, published by hand so the package existed and npm
trusted publishing could be set up
([ADR 0001](docs/decisions/0001-name-registry-and-contents.md)). Deprecated: use 0.1.0 or
later.

# Changelog

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

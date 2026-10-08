# Changelog

## 0.1.0

The tokens ([ADR 0002](docs/decisions/0002-first-scope.md)): `theme.css`, with 14 color
tokens in shadcn/ui's names, each with a light and a dark value, and the Tailwind colors
that use them. The values are Fluent Prior's palette, with three changes for contrast:

- `success` and `warning` are darker in light mode, so their `/15` badges reach 4.5:1.
- `input` is new: the edge of a form control, at 3:1 or more on `card` and `background`.

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

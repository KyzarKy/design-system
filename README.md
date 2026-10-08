# @kyzarky/ui

Design tokens for Ky Merritt's apps: a Tailwind CSS 4 theme with light and dark values.
React components arrive in 0.2.0 ([ADR 0002](docs/decisions/0002-first-scope.md)). First
consumer: Fluent Prior. Next: Merritt's Mini Mind.

## Use

```bash
npm install --save-exact @kyzarky/ui
```

Then import the theme after Tailwind in the app's CSS:

```css
@import "tailwindcss";
@import "@kyzarky/ui/theme.css";
```

It needs Tailwind CSS 4. **Pin an exact version and upgrade on purpose,** so work in
progress here never changes an app under it. The [changelog](CHANGELOG.md) says what each
version changes and how to upgrade.

## Tokens

The names are shadcn/ui's, plus three status colors. Each is a CSS variable (`--card`) and
a Tailwind color (`bg-card`, `text-card`, `border-card`, and so on).

| Token | Used for |
|---|---|
| `background` | The page |
| `foreground` | Text |
| `card` | Raised surfaces |
| `card-foreground` | Text on a card |
| `muted` | Subtle fills: meter tracks, inset boxes, the unselected segment |
| `muted-foreground` | Secondary text |
| `border` | Card edges and dividers. Decorative: too faint for a control's edge |
| `input` | Edges of form controls (3:1 or more) |
| `primary` | Brand: filled buttons, meters, links |
| `primary-foreground` | Text on `primary` |
| `ring` | Focus rings |
| `success`, `warning`, `destructive` | Results and notices, as text or as a `/15` badge |

The pairs this table implies meet WCAG AA in both modes: text on each surface, status
colors on their badges, and `input` and `ring` edges. The tests check each one.

## Light and dark

Each token holds both values, and CSS's `light-dark()` picks one from the `color-scheme`
of the element using it. The theme sets `color-scheme: light dark` on `:root`, so the page
follows the system. To let people choose, set `color-scheme` yourself:

```css
:root { color-scheme: light; }
.dark { color-scheme: dark; }
```

Don't use Tailwind's `dark:` variant: the tokens already change.

- **Browsers:** Safari 17.5, Chrome 123, Firefox 120, or later. In older browsers every
  token is invalid, so pages fall back to the browser's default colors.
- **Reading a token in JavaScript** gives the text `light-dark(#f6f4ef, #15181a)`, not a
  color. Read a computed property instead, such as
  `getComputedStyle(document.body).backgroundColor`.

## Theming

Redefine a token after the import. The theme's tokens sit in a cascade layer, so an app's
own rule wins wherever it is. For example, a green brand color:

```css
:root {
  --primary: light-dark(#2f6b3f, #5fd08a);
}
```

`ring` follows `primary` unless you set it too. Keep the contrast of every pair in the
table above.

## Rules

- **Less space inside a group than between groups,** at least 1:2.
- **Rows are separated by dividers; groups by space and a heading.**
- **Type roles:** page title `text-2xl` semibold; card title `text-lg` semibold; group
  heading `text-base` semibold; body `text-base`; row labels and help text `text-sm`;
  details `text-sm` in `muted-foreground`, with `tabular-nums` for numbers; counters and
  chips `text-xs`.
- **Every control is at least 44px tall.**
- **A value shown as a graphic is also shown as text.**

## Why

- One visual language across Ky's portfolio apps.
- Fluent Prior's "What you know" list is hard to read: it's hard to tell where one row ends
  and the next starts. The fix is rules the app never had, and they belong here, not in
  one app.
- A token-themed design system is the kind of frontend work Ky's job search targets.

## Decisions

- **[ADR 0001](docs/decisions/0001-name-registry-and-contents.md), accepted:** the package
  is `@kyzarky/ui`, published to public npm from this repo, with tokens and React
  components.
- **[ADR 0002](docs/decisions/0002-first-scope.md), accepted:** the first scope, based on
  a [style audit](docs/audit/README.md) of both apps.

## Development

| Command | What it does |
|---|---|
| `npm run verify` | Typecheck, lint, and test: what CI runs |
| `npm test` | The contrast tests, and a Tailwind build of the theme |
| `npm run format` | Biome: format and apply safe lint fixes |

## How we work

Ky decides; Claude proposes and implements. Docs first: decisions go in ADRs before code.
Small commits, each saying what changed and why, how to verify it, and three questions an
interviewer might ask, with short answers. Never commit secrets. Never force-push. Commits
use Ky's GitHub noreply email (set in this repo's git config). In anything written in Ky's
voice: no em dashes, and use Oxford commas.

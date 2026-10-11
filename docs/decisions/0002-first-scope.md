# 0002. First scope: shared token names, light-dark() theming, and a list row

**Status:** accepted, 2026-10-07 (Ky; proposed the same day). Amended by
[ADR 0003](0003-light-fallback-and-browser-check.md): older browsers get a light fallback,
and the browser check in section 2 runs in CI.

## Context

The [style audit](../audit/README.md) found:

- **The "What you know" rows run together** because nothing marks where a row ends. Each
  row ends with its graphic, the only separation is a 12px gap, and group headings are
  barely larger than rows (audit section 1).
- **The two apps name the same roles differently,** and `muted` means a text color in one
  and a background in the other. Mini Mind's names are shadcn/ui's (section 2).
- **They switch dark mode differently:** a media query in Fluent Prior, a saved class
  choice in Mini Mind (section 2).
- **Both already use Tailwind's default scales.** What's missing is rules for which step
  goes where (section 4).
- **Three contrast failures in Fluent Prior:** two badge colors in light mode, and the
  answer box's edge (section 3).

[ADR 0001](0001-name-registry-and-contents.md) settled the package: `@kyzarky/ui` on
public npm, with a `theme.css` and React components.

## Decision

### 1. Token names are shadcn/ui's, plus three status colors

| Token | Used for | Fluent Prior today | Mini Mind today |
|---|---|---|---|
| `background` | The page | `bg` | `background` |
| `foreground` | Text | `text` | `foreground` |
| `card` | Raised surfaces | `surface` | `card` |
| `card-foreground` | Text on a card | (`text`) | `card-foreground` |
| `muted` | Subtle fills: meter tracks, inset boxes, the unselected segment | `surface-muted` | `muted` |
| `muted-foreground` | Secondary text | `muted` | `muted-foreground` |
| `border` | Card edges and dividers (decorative) | `border` | `border` |
| `input` | Edges of form controls, at least 3:1 (new) | (`border`) | |
| `primary` | Brand: filled buttons, meters, links | `accent`, `meter` | `primary` |
| `primary-foreground` | Text on `primary` | `accent-text` | `primary-foreground` |
| `ring` | Focus rings | (`accent`) | `ring` |
| `success` | Good results | `good` | |
| `warning` | Partial results, notices | `partly` | |
| `destructive` | Failed results, destructive actions | `bad` | |

- **Why shadcn's names:** Mini Mind already uses them, and its shadcn Button keeps working
  with no changes. They're also widely known, so `bg-muted text-muted-foreground` needs no
  glossary for an interviewer or a new contributor.
- **The cost:** Fluent Prior renames 51 class uses across 7 components. It's mechanical,
  one row of the table at a time. In shadcn, `accent` means a hover fill, not the brand
  color, so Fluent Prior's `accent` becomes `primary`, and this package doesn't define
  `accent` until something needs it.
- **Default values are Fluent Prior's palette,** because it's finished and Mini Mind's is a
  placeholder. Two light-mode colors change to pass contrast (`success` `#2a7548`,
  `warning` `#915d00`), and `input` is new (`#858279` light, `#737779` dark). Audit
  section 3 has the ratios.
- **An app themes the package by redefining tokens after the import.** For example, Mini
  Mind could keep its green with one rule:
  `:root { --primary: light-dark(#2f6b3f, #5fd08a); --ring: var(--primary); }`. The token
  names are the contract; the values are a theme.
- **The tokens sit in Tailwind's `base` layer,** so an app's own unlayered `:root` rules
  always win, wherever the app puts them.

### 2. Light and dark come from `light-dark()` and `color-scheme`

Each token is one declaration, `--card: light-dark(#ffffff, #1e2225);`, and the browser
picks a value from the `color-scheme` of the element using it. `theme.css` sets
`:root { color-scheme: light dark }`, so by default the page follows the system:

- **Fluent Prior** changes nothing. It follows the system today.
- **Mini Mind** keeps its toggle. Its existing `:root { color-scheme: light }` and
  `.dark { color-scheme: dark }` already set `color-scheme`, which is all `light-dark()`
  reads.
- **Components never use Tailwind's `dark:` variant.** Tokens carry the difference.

Options:

| | `light-dark()` | A light block plus a dark block | One switching method for every app |
|---|---|---|---|
| Each dark value written | Once | Twice: in a `prefers-color-scheme` query and under a class, kept in step by hand | Once |
| Works with both apps as they are | Yes | Yes | No: Fluent Prior would need a pre-paint script and a class |
| Browsers | Safari 17.5 (May 2024), Chrome 123, Firefox 120 | Anything Tailwind 4 supports (Safari 16.4) | Same as the block approach |

`light-dark()` raises the oldest supported Safari from 16.4 to 17.5. On an older browser
every token is invalid, so by CSS's rules each color falls back to the browser's default:
black text on a white page, readable but unstyled. That follows from the spec; it isn't
tested. (Tested since, and it's worse than this says: ADR 0003.)

Checked in Chromium 152: `light-dark()` resolves through `var()` and inside `color-mix()`,
which is how Tailwind draws opacity modifiers such as `bg-success/15`. **Not yet checked
in Safari or Firefox.** Before 0.1.0 is published, Ky opens a test page in Safari on an
iPhone and in Firefox.

### 3. Scales are Tailwind's; the package adds rules

No new spacing, type, radius, or shadow tokens. Both apps already share Tailwind's scales,
and a second scale would be one more thing to learn with nothing new to say. The package
README states the rules, and its components follow them:

- **Less space inside a group than between groups, at least 1:2.**
- **Rows are separated by dividers; groups by space and a heading.** Different separators
  for different levels.
- **Type roles:** page title `text-2xl` semibold; card title `text-lg` semibold; group
  heading `text-base` semibold; body `text-base`; row labels and help text `text-sm`;
  details `text-sm` in `muted-foreground`, with `tabular-nums` for numbers; counters and
  chips `text-xs`. These are what Fluent Prior uses today, except the group heading, which
  moves from medium to semibold.
- **Every control is at least 44px tall.**
- **A value shown as a graphic is also shown as text.**

### 4. Three releases, in order of need

Each release is one pull request here, then one in Fluent Prior when Ky asks for it. Each
stays under about 400 changed lines.

**0.1.0: tokens.** `theme.css` (the tokens, the `@theme inline` mapping, and `body`
colors), the package's CI, and the publish workflow. Fluent Prior's adoption:

- Install with `--save-exact`, so every upgrade is a deliberate commit.
- In `styles.css`, replace the token block with `@import "@kyzarky/ui/theme.css";` after
  Tailwind's import.
- Rename the class uses, point Sparkline's stroke at `var(--primary)`, and give the answer
  box `border-input`.
- Expected visible change: the two badges and the answer box's edge. Before and after
  screenshots at 375px, in light and dark, check that nothing else moved.

**0.2.0: `List`, `ListRow`, and `Meter`.** This is the readability fix. It adds the
package's JavaScript entry point and the `@source` line in `theme.css`.

```tsx
<List
  heading={<h3>Grammar</h3>}
  description="◐ marks grammar that phone dictation often can't hear, so a correct answer counts for less."
>
  <ListRow label="Question word order" detail="99% · 9 answers">
    <Meter value={0.99} />
  </ListRow>
</List>
```

- **`List`** renders a `<ul>` with a divider between rows. Its `heading` sits 32px below
  the previous group. The app passes the heading element, because the heading level
  depends on the page; `List` wraps it in its own type classes. Tailwind's preflight sets
  headings to inherit size and weight, so the wrapper's classes apply.
- **`ListRow`** renders an `<li>` with 12px padding above and below: the label and detail
  on one line, and its children 8px below. Between two rows' contents that's 24px and a
  divider, against 8px inside a row (1:3). Between the last row of one group and the next
  heading it's about 44px.
- **`Meter`** is a bar from 0 to 1, filled with `primary` on a `muted` track, and hidden
  from screen readers. The row's `detail` text carries the value. Not the native
  `<meter>`: styling it needs a different pseudo-element in each engine, and it would read
  the value aloud a second time next to the text.
- **Fluent Prior's Sparkline stays in Fluent Prior.** It's specific to the learner model,
  and it goes in `ListRow`'s children like a `Meter`.
- **Fluent Prior's adoption:** MasteryPanel uses the three components, and its own `Meter`
  function goes away. Before and after screenshots of both views at 375px, in light and
  dark, go in the pull request, and Ky judges whether the rows read as rows. If they
  don't, the values change in this package and Fluent Prior takes the next version.

**0.3.0: `Card`, `Button`, and `SegmentedControl`.** Extracted from Fluent Prior: its
three cards, its two button styles, and the Now / Over time control. `Button`'s props match
shadcn's (`variant`, `size`), so Mini Mind can switch to it later by changing an import.
They come last because they work today and aren't part of the problem. Each API is
reviewed in its pull request.

### 5. Checks

- **On every push:** typecheck, Biome (the same linter as both apps), and Vitest.
- **A contrast test** reads the token values from `theme.css` and checks every pair the
  rules depend on, in both modes: text tokens on `background`, `card`, and `muted`, at
  4.5:1; status colors on their 15% badges at 4.5:1; and `input` on `card` and
  `background` at 3:1. A palette change that breaks contrast fails CI, not a review.
- **Before each release:** `npm pack`, install the tarball into a local Fluent Prior
  checkout with `npm install --no-save`, and run its `npm run verify`. `--no-save` leaves
  its `package.json` and lockfile alone.

## Not in the first scope

- **Mini Mind's migration.** It moves when Mini Mind decides to. Audit section 6 lists
  what it will touch.
- **A radius setting,** like shadcn's `--radius`. It's needed when Mini Mind's smaller
  corners meet the shared `Card`, and adding it then is a minor version.
- **Pills, text inputs, and the theme toggle.** Each waits for a second app to need it.
- **A docs site or Storybook, and visual regression tests.** Until a second consumer
  arrives, Fluent Prior is the showcase, and screenshots in pull requests are the visual
  review.

## Ky's calls (all accepted as proposed, 2026-10-07)

1. shadcn's names, and the Fluent Prior rename that comes with them.
2. `light-dark()`, and Safari 17.5 as the oldest supported version.
3. The release order: tokens, then the list, then the controls.
4. The two badge colors and the new `input` color, which change Fluent Prior's look
   slightly.
5. Exact version pins in consumers.

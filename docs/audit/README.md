# Style audit, 2026-10-07

What Fluent Prior and Merritt's Mini Mind have today, read from their source and measured
in Fluent Prior's running UI. It's the input to [ADR 0002](../decisions/0002-first-scope.md).

Sources: Fluent Prior at `e96adbf` (`src/web/styles.css`, `src/web/components/`), and
Mini Mind at `4bb2ff3` (`apps/web/src/index.css`, `apps/web/src/`, `index.html`,
`vite.config.ts`).

## 1. Fluent Prior's "What you know" panel

Screenshots at 375px wide in light mode, with six days of made-up practice history in
localStorage: [Now](fluent-prior-what-you-know-now.jpg) and
[Over time](fluent-prior-what-you-know-over-time.jpg).

The panel lists 18 rows in three groups: 5 tasks, 1 tone, and 12 grammar skills. Each row
is a label with a detail on the right, then a graphic below: a bar in the Now view, a
sparkline in a shaded box in the Over time view.

Measured with `getBoundingClientRect` and `getComputedStyle`:

| | Now | Over time |
|---|---|---|
| Row label | 14px regular, 20px line | same |
| Label to its own graphic | 4px | 4px |
| Graphic | 8px bar | 40px shaded box |
| Graphic to the next row's label | 12px, no divider | 12px, no divider |
| Group heading (Tasks, Tone, Grammar) | 16px medium | same |
| Space above a group heading | 20px | 20px |

Why the rows run together:

1. **Nothing marks where a row ends.** Rows are separated by a 12px gap and nothing else,
   and every row ends with its graphic, so each label sits between two graphics. In the
   Over time view the graphics are 40px shaded boxes, the heaviest shapes in the panel,
   and a label reads as belonging to the box above it as easily as to the box below.
2. **Inside and between are too close.** 4px inside a row against 12px between rows is
   1:3 on paper, but the gap between rows is the only cue, and the box's weight works
   against it.
3. **Group headings barely outrank rows.** A heading is 2px larger and one weight heavier
   than a row label, with 20px above it against 12px between rows, so Tasks, Tone, and
   Grammar look like more rows.

## 2. Color tokens

Both apps define colors as CSS variables and map them to Tailwind utilities with
`@theme inline`. Components use the utilities, never raw colors.

| Role | Fluent Prior | Light / dark | Mini Mind | Light / dark |
|---|---|---|---|---|
| Page | `--bg` | `#f6f4ef` / `#15181a` | `--background` | `#f7f8f8` / `#0d1013` |
| Raised surface | `--surface` | `#ffffff` / `#1e2225` | `--card` | `#ffffff` / `#14181c` |
| Text on surface | (uses `--text`) | | `--card-foreground` | `#101418` / `#e7eaee` |
| Subtle fill | `--surface-muted` | `#efece4` / `#272c30` | `--muted` | `#eef0f1` / `#1b2025` |
| Text | `--text` | `#1f2326` / `#eceae4` | `--foreground` | `#101418` / `#e7eaee` |
| Secondary text | `--muted` | `#5b6166` / `#a3a9ad` | `--muted-foreground` | `#5b6470` / `#97a1ac` |
| Edges | `--border` | `#dedad0` / `#353b40` | `--border` | `#e2e5e8` / `#262c33` |
| Brand | `--accent` | `#1d6b73` / `#5fb3ba` | `--primary` | `#2f6b3f` / `#5fd08a` |
| Text on brand | `--accent-text` | `#ffffff` / `#0e1a1c` | `--primary-foreground` | `#ffffff` / `#08120b` |
| Focus ring | (`--accent` at 30%) | | `--ring` | `#2f6b3f` / `#5fd08a` |
| Meter | `--meter` | same as `--accent` | | |
| Status | `--good`, `--partly`, `--bad` | `#2c7a4b`, `#9a6300`, `#b1352b` / `#6cc38f`, `#e0a846`, `#ef8a7f` | | |

Findings:

- **Same roles, different names, and one name clashes.** `muted` is a text color in
  Fluent Prior and a background in Mini Mind. A shared package has to pick one vocabulary.
  Mini Mind's is shadcn/ui's, and it uses a shadcn Button that depends on those names.
- **Fluent Prior's palette is warm and finished. Mini Mind's is cool, and its own CSS calls
  it a placeholder** until its visual direction is chosen (OPEN-QUESTIONS #2 there).
- **Dark mode switches two different ways.** Fluent Prior follows the system only, through
  a `prefers-color-scheme` media query. Mini Mind lets a person choose: a script in
  `index.html` sets a `.dark` class on `<html>` before first paint, ThemeToggle changes and
  saves it, and the CSS sets `color-scheme: light` on `:root` and `color-scheme: dark` on
  `.dark`.
- **Neither app uses Tailwind's `dark:` variant.** Every color goes through a token, so
  light and dark differ only in token values.
- **Colors outside the token files:** Fluent Prior's Sparkline strokes with
  `var(--meter)`. Mini Mind repeats its light and dark page colors in `index.html` (the
  `theme-color` meta tag and the pre-paint script) and in `vite.config.ts` (the PWA
  manifest), and ThemeToggle reads `--background` with `getPropertyValue`.

## 3. Contrast

WCAG 2.2 AA: 4.5:1 for text under 18.66px bold or 24px, and 3:1 for the edges of a
control when the edge is what shows there's a control (1.4.11). Ratios are computed with
WCAG's relative-luminance formula. A tinted badge background is the status color at 15%
over the card color, the way Tailwind's `/15` modifier draws it.

Passing: text and secondary text on every surface, in both apps and both modes (5.2:1 to
17.4:1), and both apps' filled buttons (6.2:1 and up).

Below the minimum:

| Pair | Mode | Ratio | Needs |
|---|---|---|---|
| Fluent Prior "Did every part" badge: good on good/15 | light | 4.29 | 4.5 |
| Fluent Prior "Did part of it" and "Second try" badges: partly on partly/15 | light | 4.15 | 4.5 |
| Fluent Prior answer box edge: border on the page (the box sits outside any card) | light / dark | 1.27 / 1.57 | 3 |
| Mini Mind theme toggle edge: border on the page | light / dark | 1.19 / 1.35 | 3, but not required: the icon shows it's a control |

Card edges and dividers this faint (1.2:1 to 1.6:1) are fine. They're decorative: nothing on a card
depends on seeing its edge.

Colors that would fix the failures, from the same hues:

| Use | Light | Dark |
|---|---|---|
| `good` | `#2a7548` (4.56 on its badge, 5.62 on the card) | unchanged, `#6cc38f` (5.61) |
| `partly` | `#915d00` (4.54 on its badge, 5.57 on the card) | unchanged, `#e0a846` (5.64) |
| A new edge color for form controls | `#858279` (3.84 on the card, 3.49 on the page) | `#737779` (3.54 on the card, 3.94 on the page) |

## 4. Scales in use

Neither app defines a scale of its own. Both use Tailwind's default spacing, type, radius,
and shadow scales.

- **Spacing (4px steps):** Fluent Prior uses steps 0.5, 1, 2, 3, 4, 5, 6, and 10. Mini
  Mind uses 1, 2, 3, 4, and 6.
- **Type:** Fluent Prior uses `text-xs`, `sm` (17 of its 24 size classes), `base`, `lg`,
  and `2xl`. Mini Mind uses `xs`, `sm`, `lg`, and `2xl`. Both use medium and semibold
  weights; Fluent Prior also bolds its ✓ and ✗ marks.
- **Radius:** Fluent Prior uses `rounded-2xl` on cards, `xl` on the answer box, buttons,
  and inset boxes, `full` on pills and meters, and `md` on the sparkline box. Mini Mind
  uses `md` on buttons and tabs and `lg` on cards.
- **Shadow:** Fluent Prior puts `shadow-sm` on cards and on the selected segment. Mini
  Mind uses none.
- **Touch targets:** every control in both apps is at least 44px tall (`min-h-11` or
  `h-11`). Mini Mind's PRINCIPLES (P9) require it.
- **Font:** both set a system font stack on `body`. Tailwind's preflight already sets one
  on `html`, along with `-webkit-text-size-adjust: 100%` and zero margins, so those lines
  in both apps repeat it.

The scales are shared already. What neither app has is rules for which step goes where:
how much space sits inside a row versus between rows, and how a group heading differs from
a row.

## 5. Components that exist today

| Pattern | Fluent Prior | Mini Mind |
|---|---|---|
| Card | The same classes three times: `rounded-2xl border bg-surface p-5 shadow-sm` | Home's section links: `rounded-lg border bg-card p-4` |
| Button | Classes in AnswerForm: a filled and an outlined button, `min-h-11 rounded-xl` | shadcn's Button with class-variance-authority: `default`, `outline`, and `ghost` variants; `default` and `icon` sizes |
| Segmented control | Now / Over time in MasteryPanel: a fieldset of `aria-pressed` buttons | None (the header's section tabs are links) |
| Pill | ScenarioCard's role and "Second try" chips, FeedbackCard's result label | None |
| List row with a meter | MasteryPanel's `Meter` | None |
| Theme toggle | None | ThemeToggle |

Mini Mind's web app also depends on `class-variance-authority`, `clsx`, `tailwind-merge`,
and `lucide-react` (its ADR 0001 and ARCHITECTURE pick shadcn/ui). Fluent Prior uses none
of them.

## 6. Notes for Mini Mind's migration, later

Not part of the first scope (ADR 0002). Recorded so they aren't rediscovered:

- If tokens are written with `light-dark()` (ADR 0002), `getPropertyValue("--background")`
  returns the text `light-dark(#f7f8f8, #0d1013)`, not a color (checked in Chromium 152).
  ThemeToggle would read `getComputedStyle(document.body).backgroundColor` instead.
- The page colors repeated in `index.html` and `vite.config.ts` have to change with the
  tokens.
- With shadcn's token names, Mini Mind's Button keeps working unchanged.

# @kyzarky/ui

Design tokens and React components for Ky Merritt's apps: a Tailwind CSS 4 theme with
light and dark values, and the components built on it
([ADR 0002](docs/decisions/0002-first-scope.md)). First consumer: Fluent Prior. Next:
Merritt's Mini Mind.

## Use

```bash
npm install --save-exact @kyzarky/ui
```

Then import the theme after Tailwind in the app's CSS:

```css
@import "tailwindcss";
@import "@kyzarky/ui/theme.css";
```

It needs Tailwind CSS 4, and React 19 for the components. The import also has the app's
Tailwind scan the package's components, so their classes are generated with the app's own.
**Pin an exact version and upgrade on purpose,** so work in
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

- **Browsers:** both themes need `light-dark()`: Safari 17.5, Chrome 123, Firefox 120, or
  later. A browser without it gets the light theme, whatever the system is set to
  ([ADR 0003](docs/decisions/0003-light-fallback-and-browser-check.md)).
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

## Components

```tsx
import { List, ListRow, Meter } from "@kyzarky/ui";

<List heading={<h3>Grammar</h3>} description="Optional help text.">
  <ListRow label="Question word order" detail="99% · 9 answers">
    <Meter value={0.99} />
  </ListRow>
</List>
```

- **`List`** is a group of rows with a divider between them. Pass the `heading` as an
  element, at whatever level the page needs; `List` sets its look. A `List` that follows
  something sits 32px below it.
- **`ListRow`** is one row: a `label`, a `detail` on the right, and optional children
  below for a graphic.
- **`Meter`** is a bar for a `value` from 0 to 1. It's hidden from screen readers, so
  state the value in the row's `detail`.

```tsx
import { Button, Card, SegmentedControl } from "@kyzarky/ui";

<Card aria-labelledby="progress-heading" className="flex flex-col gap-4">
  <SegmentedControl
    label="Show"
    value={view}
    onChange={setView}
    options={[
      { value: "now", label: "Now" },
      { value: "over-time", label: "Over time" },
    ]}
  />
  <Button type="submit">Check my answer</Button>
  <Button variant="outline" onClick={next}>Next situation</Button>
</Card>
```

- **`Card`** is a raised surface, rendered as a `<section>`. Name it with
  `aria-labelledby` or `aria-label`.
- **`Button`** takes shadcn/ui's props: `variant` is `default` (filled), `outline`, or
  `ghost`, and `size` is `default` or `icon`. Unlike a bare `<button>`, its `type` is
  `button` unless you pass `submit`. It also takes every native button prop.
- **`PageHeader`** is the top of a page: `title` (its only `h1`), an optional one-sentence
  `description` (a string), and optional `actions`, such as a `Link`.
- **`SegmentedControl`** picks one option from a few. It's a group of radio buttons
  underneath, so arrow keys move between options. `label` names the group for screen
  readers and isn't shown.

`Card` and `Button` take a `className` for layout only (`flex-1`, `w-full`, a `gap`). It's
added after the component's own classes, not merged with them, so don't use it to restyle.

## Rules

- **Less space inside a group than between groups,** at least 1:2.
- **Rows are separated by dividers; groups by space and a heading.**
- **Type roles:** page title `text-2xl` semibold; card title `text-lg` semibold; group
  heading `text-base` semibold; body `text-base`; row labels and help text `text-sm`;
  details `text-sm` in `muted-foreground`, with `tabular-nums` for numbers; counters and
  chips `text-xs`.
- **Every control is at least 44px tall.**
- **A value shown as a graphic is also shown as text.**
- **Links go somewhere; buttons do something.** Anything that looks like a link is a
  `Link`: an `<a href>` to a page or a place on one, underlined, with a pointer, a hover
  state, and a focus ring. Anything that fills, switches, submits, or erases is a
  `Button`, and looks like one.
- **A page starts with a `PageHeader`:** the title, a one-sentence description at body
  size in `muted-foreground`, and the page's own links or actions, never inside the
  description's sentence. Below 640px the actions sit beside the title; from 640px up they
  have a row of their own. Each action is at least 24px tall. 6px between the parts, and
  at least twice that (12px) between the header and the page below it.
- **A button never sits inside a paragraph.** A `<p>` holds text and inline links. A
  button goes on its own row, after the text it follows.
- **A modal has a title and a body.** The title and the close button are in a header that
  stays in view; only the body scrolls. The body takes any content, styled like the rest
  of the page, with its headings starting at `h3` under the title. Use `Modal`.

## Why

- One visual language across Ky's portfolio apps.
- A token-themed design system is related to the kind of frontend work Ky's job search targets.

## Decisions

- **[ADR 0001](docs/decisions/0001-name-registry-and-contents.md), accepted:** the package
  is `@kyzarky/ui`, published to public npm from this repo, with tokens and React
  components.
- **[ADR 0002](docs/decisions/0002-first-scope.md), accepted:** the first scope, based on
  a [style audit](docs/audit/README.md) of both apps.
- **[ADR 0003](docs/decisions/0003-light-fallback-and-browser-check.md), accepted:** a
  light fallback for browsers without `light-dark()`, and a browser check in CI.
- **[ADR 0004](docs/decisions/0004-modal-and-link.md), accepted:** `Modal` and `Link` before
  a second app needs them, because they come with rules.
- **[ADR 0005](docs/decisions/0005-page-header.md), accepted:** `PageHeader`, for the same
  reason.

## Development

| Command | What it does |
|---|---|
| `npm run verify` | Typecheck, lint, test, and build |
| `npm run build` | Compiles `src` to `dist` with `tsc`. `npm pack` and `npm publish` run it first |
| `npm test` | The contrast, fallback, and component tests, and a Tailwind build of the theme |
| `npm run test:browsers` | Opens `browser-check.html` in Chromium, Firefox, and WebKit, in light and dark. Needs `npx playwright install` once. Add engine names to run only those: `npm run test:browsers -- webkit` |
| `npm run format` | Biome: format and apply safe lint fixes |

## Releasing

1. In a pull request: bump `version` in `package.json` and add a changelog entry.
2. Try it in an app before merging: `npm pack`, then in the app
   `npm install --no-save <path to the .tgz>` and its `npm run verify`.
3. After merging, tag the merge commit and push the tag:
   `git tag v0.2.0 && git push origin v0.2.0`. The publish workflow checks that the tag
   matches `package.json`, runs `verify`, and publishes with provenance. It skips a
   version that's already on npm, so running it again is safe.

**How publishing is set up** ([ADR 0001](docs/decisions/0001-name-registry-and-contents.md)).
npm adds a trusted publisher only to a package that already exists, and a new one expires
unless it makes a successful publish within 2 days. So:

1. `0.0.0` is a placeholder with no theme in it, published by hand so the package exists.
   It's deprecated.
2. The trusted publisher is added with
   `npm trust github @kyzarky/ui --file publish.yml --repo KyzarKy/design-system --allow-publish`.
3. Pushing `v0.1.0` within those 2 days has CI publish the first real version, which
   confirms the setup. A replacement trusted publisher would have the same 2 days.
4. Then publishing access is set to require two-factor auth and disallow tokens, in the
   package's settings on npmjs.com.

# 0003. A light fallback for older browsers, and a browser check in CI

**Status:** accepted, 2026-10-10 (Ky). Amends [ADR 0002](0002-first-scope.md), sections 2
and 5.

## Context

ADR 0002 chose `light-dark()` for the tokens and left two things open: the theme had only
been checked in Chromium, and what an older browser shows was reasoned from the spec, not
tested. On 2026-10-10 the check page was run in the engines Playwright ships.

| Engine | Has `light-dark()` | Result |
|---|---|---|
| Chromium 156 | Yes | Every check passes, with the system set to light and to dark |
| WebKit 27.2, Safari's engine | Yes | Every check passes, light and dark |
| WebKit 17.4 (Playwright 1.40's build) | No | Every check fails |
| Firefox 157, Chromium 120 | | Not run: neither would start in the session that ran the others (a Windows side-by-side loading error, unrelated to the theme) |

What WebKit 17.4 showed is worse than ADR 0002 said
([screenshot](0003-webkit-17.4-without-fallback.png)). Text stays readable, but each
background colored by a token computes to transparent, so card surfaces, meter bars, and
badge tints disappear, and borders take the text color. A filled button's background would
go the same way, leaving its label looking like plain text.

That reaches real phones. The iPhone 8, 8 Plus, and X can't be updated past iOS 16, and
`light-dark()` arrived in Safari 17.5, so iOS 17.0 through 17.4 lack it too.

## Options

| | No fallback (ADR 0002) | Plain values, then `@supports` | A second set of variables | Two blocks, no `light-dark()` |
|---|---|---|---|---|
| Older browsers get | Text, with every token-colored fill gone | The whole light theme | The whole light theme | Both themes |
| Each value written | Once | Light values twice | Once | Dark values twice |
| Cost | None | A test has to keep the two copies of each light value equal | 12 more variables (`--card-light` beside `--card`), and an app theming `--card` has to know which to set | The duplication ADR 0002 turned down, and each app's switching method needs its own selector |

## Decision

**`theme.css` declares each token as a plain light value first, then as a `light-dark()`
pair inside `@supports (color: light-dark(#000, #fff))`. And the theme is checked in three
browser engines on every pull request.**

- **The fallback is the light theme.** The first `:root` rule sets `color-scheme: light`
  and the light values. The rule inside `@supports` sets `color-scheme: light dark` and
  the pairs. A browser without `light-dark()` skips the second rule and shows the light
  theme, whatever the system is set to.
- **A test keeps the two copies equal.** `theme.test.ts` fails if a token's fallback isn't
  the light value of its pair, or if a token has one and not the other. It also builds the
  theme the way an app's production build does and checks that both rules survive, in
  that order.
- **`browser-check.html` is the check, kept in the repo.** It loads `theme.css` and
  compares what the browser computes for a card, its text, and a `/15` badge against the
  token's own value, in a panel forced light, one forced dark, and one following the
  system. Opened by hand it shows a verdict, so it also works on a phone.
- **`npm run test:browsers` runs it** in Chromium, Firefox, and WebKit, with the system
  set to light and then dark, and CI runs that on every pull request. It fails unless
  every check passes with the `light-dark()` values in effect. The page reads that from a
  token, not from what the browser supports, so a theme stuck on its fallback in a modern
  browser fails.
- **CI's run replaces ADR 0002's by-hand check** as what has to pass before a release.
  Opening the page on a real iPhone is still worth doing when one is at hand.

## Why

- **Without it, people on the oldest phones get a page with no button shapes and no
  meters.** The fix is a few lines of CSS.
- **Plain values and `@supports` over a second set of variables:** the duplication is
  visible and a test guards it. Extra variables would remove the duplication by adding a
  second name for every token, and the names are the package's contract.
- **CI over a hosted device service:** it needs no account, runs on every change, and
  covers the three engines. What it can't cover is listed below.

## Checked, and not

- **Checked, 2026-10-10:** with the fallback, WebKit 17.4 shows the light theme in all
  three panels, with the system set to light and to dark
  ([screenshot](0003-webkit-17.4-with-fallback.png)). Chromium 156 and WebKit 27.2
  pass with the `light-dark()` values. Breaking the theme on purpose fails the checks: a
  wrong fallback value, a missing fallback, an `@supports` condition that never matches,
  and a badge mixing the wrong token.
- **Firefox is checked by CI,** since it wouldn't start locally. Its first run is on the
  pull request that adds this ADR.
- **Not checked:** Safari on a real iPhone, and Safari 17.5 itself. Playwright's WebKit is
  Safari's engine built for other systems, and its builds don't match Safari's version
  numbers one to one.
- **Not checked:** an app that sets `color-scheme: dark` itself, as Mini Mind's toggle
  does, in a browser without `light-dark()`. By the cascade it would get the light theme
  with dark form controls and scrollbars.

## Consequences

- Below Safari 17.5 the theme is light only. There is no dark theme without
  `light-dark()`.
- A palette change edits each light value in two places. The test names any that differ.
- CI gains a job that downloads three browsers, and the repo gains Playwright as a
  development dependency. Neither ships in the package.

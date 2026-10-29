# ADR 0005: PageHeader, before a second app needs it

**Status:** accepted, 2026-10-29, when #5 merged. Ky asked for the header's layout to be a
design-system rule.

## Context

Fluent Prior's header was a title over a small muted line, with "How it works" as a link
at the end of that line's sentence. On a phone the link wrapped onto a line of its own
anyway, and the line read as small print. Ky asked for a layout that follows common
practice, kept here so the next app's header matches.

## Decision

Make the same exception to ADR 0002 as ADR 0004: `PageHeader` comes with a rule, and a
rule is only shared if the code that follows it is.

The layout follows what other design systems do. GitHub's Primer, Grommet, and Shopify's
Polaris all split a page header into a title, a description, and actions or navigation,
each in its own place. GOV.UK sets a page's intro paragraph larger than body text, so it's
read before the rest. This goes one step up, from `text-sm` to body size, not as far as
GOV.UK: Fluent Prior's description is one short line, not an intro paragraph.

- **Title:** the page's only `h1`, `text-2xl` semibold, with a tight line height
  (`leading-tight`), so a title that wraps reads as one block.
- **Description:** one sentence at body size (`text-base`), in `muted-foreground`, no wider
  than `max-w-prose` (65 characters). Fluent Prior had it at `text-sm`, which read as a
  footnote.
- **Actions:** the page's own links or buttons, at `text-sm`, never at the end of the
  description's sentence, where a link is hard to find and looks misplaced when it wraps.
  Each action is at least 24px tall, the WCAG 2.5.8 target size.
- **Beside the title below 640px, on a row of their own from 640px up.** Stacked on a
  phone, the header was 118px tall, and at 375×667 only about 25px of Fluent Prior's answer
  box showed above the fold. Beside the title, the header is one line shorter. On a wider
  screen there's room, and a row of their own is easier to scan.
- **Reading order stays title, description, actions.** On a phone the actions show before
  the description, but the HTML keeps them last, so a screen reader reads the header in
  the order it makes sense (WCAG 1.3.2). The actions are the only part that takes focus,
  so focus order doesn't change.
- **Spacing:** 6px between the parts. The page puts at least twice that (12px) between the
  header and what follows (the 1:2 rule). The component can't set the space outside
  itself, so that's the app's `gap`.

A second rule came out of the same review: **a button never sits inside a paragraph.**
Fluent Prior had a `<p>` holding a sentence and then a button, which put the button partway
along the text's last line. A `<p>` holds text and inline links; a button goes after it.

## Not decided here

- **Breadcrumbs, back links, and a leading icon,** which Primer's header also has. Neither
  app has a page that needs them yet.

# ADR 0005: PageHeader, before a second app needs it

**Status:** proposed, 2026-10-28. Ky asked for the header's layout to be a design-system
rule; merging this accepts it.

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
read before the rest.

- **Title:** the page's only `h1`, `text-2xl` semibold, with a tight line height
  (`leading-tight`), so a title that wraps reads as one block.
- **Description:** one sentence at body size (`text-base`), in `muted-foreground`, no wider
  than `max-w-prose` (65 characters). Fluent Prior had it at `text-sm`, which read as a
  footnote.
- **Actions:** the page's own links or buttons, on a row of their own, at `text-sm`. A link
  at the end of the description's sentence is hard to find and looks misplaced when it
  wraps. The row is at least 24px tall, the WCAG 2.5.8 target size for a link on its own
  line.
- **Spacing:** 6px between the parts, plus 4px above the actions row. The page puts at
  least twice the largest of those between the header and what follows (the 1:2 rule).
  The component can't set the space outside itself, so that's the app's `gap`.

A second rule came out of the same review: **a button never sits inside a paragraph.**
Fluent Prior had a `<p>` holding a sentence and then a button, which put the button partway
along the text's last line. A `<p>` holds text and inline links; a button goes after it.

## Not decided here

- **Breadcrumbs, back links, and a leading icon,** which Primer's header also has. Neither
  app has a page that needs them yet.

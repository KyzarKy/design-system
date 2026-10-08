# Design system (`@kyzarky/ui`)

A shared design system for Ky Merritt's apps, published as a versioned package that each
app depends on (Ky, 2026-10-07). First consumer: Fluent Prior. Next: Merritt's Mini Mind.

## Why

- One visual language across Ky's portfolio apps.
- Fluent Prior's "What you know" list is hard to read: it's hard to tell where one row ends
  and the next starts. The fix is rules the app never defined (a spacing scale, a type
  scale, a list row), and those belong here, not in one app.
- A token-themed design system is the kind of frontend work Ky's job search targets.

## Constraints

- **Apps pin a version and upgrade when they choose,** so no app is ever blocked by work in
  progress here. That's the reason behind Fluent Prior's independence rule (its CLAUDE.md).
- **Both apps:** React 19, Tailwind CSS v4, Vite 8, design tokens as CSS variables with light
  and dark modes. See `../fluent-prior/src/web/styles.css` and
  `../merritts-mini-mind/apps/web/src/index.css`.
- **Vercel builds both apps,** so installing the package must work there.

## Decisions

- **[ADR 0001](docs/decisions/0001-name-registry-and-contents.md), accepted:** the package
  is `@kyzarky/ui`, published to public npm from this repo, with tokens and React
  components.
- **[ADR 0002](docs/decisions/0002-first-scope.md), accepted:** the first scope, based on
  a [style audit](docs/audit/README.md) of both apps.

## How we work

Ky decides; Claude proposes and implements. Docs first: decisions go in ADRs before code.
Small commits, each saying what changed and why, how to verify it, and three questions an
interviewer might ask, with short answers. Never commit secrets. Never force-push. Commits
use Ky's GitHub noreply email (set in this repo's git config). In anything written in Ky's
voice: no em dashes, and use Oxford commas.

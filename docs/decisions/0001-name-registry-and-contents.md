# 0001. Publish @kyzarky/ui on public npm, with tokens and components

**Status:** accepted, 2026-10-07 (Ky). Settles the three open decisions in the
[README](../../README.md): names, registry, and what ships. Amended 2026-10-10: the
version published by hand is a placeholder (the Decision's amendment).

## Context

Each app pins a version of this package and upgrades when it chooses, so work in progress
here never blocks an app. Fluent Prior's CLAUDE.md allows published, versioned packages
and no other shared code. Both apps build on Vercel, so installing the package has to work
there with no extra setup.

## Options

**Registry**

| | Public npm | GitHub Packages | Git tag dependency |
|---|---|---|---|
| Consumer setup | None | An `.npmrc` and a read token in every app, and in each Vercel project's environment, even for a public package | None |
| Pin strength | A published version can never be changed or reused | A published version can't be overwritten | A tag can be moved to another commit |
| Who can see it | Anyone | Can be private | Same as the repo |
| Publishing | From CI with trusted publishing: no stored token, provenance attached | From CI with `GITHUB_TOKEN` | Push a tag; each install builds from source |

**What ships**

- **Tokens only:** one CSS file, no build step. Each app builds its own components, so
  Fluent Prior's list fix stays in Fluent Prior.
- **Tokens and React components in one package:** one version covers both, so they can't
  drift apart. Needs a compile step for the components.
- **Two packages (tokens, components):** a non-React consumer could take tokens alone. Two
  versions to pin and keep in step, for a consumer that doesn't exist yet.

## Decision

**Repo `KyzarKy/design-system` (public, created 2026-10-07). Package `@kyzarky/ui`,
published to public npm. It ships tokens and React components.**

- **The scope matches the GitHub account.** GitHub Packages would require that, so the
  name stays the same if the registry ever changes.
- **Releases publish from GitHub Actions through npm trusted publishing.** The workflow
  proves its identity to npm with a short-lived OIDC token, so no npm token is stored in
  the repo or in GitHub's secrets. For a public repo and a public package, npm attaches
  provenance automatically: anyone can check which commit and workflow built a version.
  npm's requirements (checked on its trusted publishers page, 2026-10-07): npm CLI 11.5.1
  or later, Node 22.14 or later, `id-token: write` in the workflow, and a
  `repository.url` in `package.json` that matches the GitHub repo exactly.
- **Ky creates the npm account** (`kyzarky`, with two-factor auth) **and publishes the
  first version by hand.** npm adds a trusted publisher only to a package that already
  exists (`npm help trust`: "The package you're configuring must already exist on the npm
  registry"). After the first CI publish works, the package's publishing access is set to
  require two-factor auth and disallow tokens.
- **Amended 2026-10-10 (Ky): the version published by hand is a `0.0.0` placeholder, and
  CI publishes 0.1.0.** npm's trusted publishers page says a new configuration "must
  complete its first successful publish within 2 days", or it expires and can't be used
  or edited. Publishing 0.1.0 by hand would have left the first CI publish until 0.2.0,
  past that deadline. With a placeholder, 0.1.0 comes from CI inside the 2 days, with
  provenance, and the workflow is proven before anything depends on it. The cost is a
  deprecated `0.0.0` that stays listed on npm.
- **`@kyzarky/ui/theme.css`** holds the tokens, Tailwind's `@theme` mapping, and an
  `@source` line pointing at the compiled components. An app adds one `@import` line, and
  its own Tailwind build generates the classes the components use.
- **`@kyzarky/ui`** is the React components, compiled from TSX by `tsc` into ES modules
  with type declarations. There's no bundler, because there's nothing to bundle. React 19
  and Tailwind CSS 4 are peer dependencies, so each app keeps one copy of each.
- **Semantic versioning.** While the version is 0.x, a minor version may break things;
  the changelog says how to upgrade.

## Why

- **No consumer setup.** Public npm is the only option where Vercel installs the package
  exactly as it installs React.
- **Fluent Prior's problem is a row's structure,** where a row starts and ends and what
  spacing sits inside it versus between rows. That's a component, not a token, so tokens
  alone would leave the fix in the app.
- **Class names, not compiled CSS.** The components ship Tailwind class names, and each
  app's Tailwind generates each utility once. Shipping compiled CSS would put a second
  copy of those utilities on the page, in a cascade that competes with the app's. The cost
  is that consumers must use Tailwind 4. Both do.
- **A public package is part of the portfolio.** The source, the provenance, and the
  version history are all visible.

## Consequences

- A version number can never be reused, even after an unpublish. A bad release is fixed
  by publishing the next version.
- A Tailwind or React major upgrade here is a major version of `@kyzarky/ui`, and each app
  takes it when it chooses.
- If a consumer that can't use React appears (Mini Mind's possible Expo app,
  OPEN-QUESTIONS #8 there), the tokens can move to their own package then.

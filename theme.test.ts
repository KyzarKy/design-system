// Checks theme.css three ways (ADRs 0002 and 0003). Every pair of tokens the rules depend
// on meets WCAG AA in light and dark mode, so a palette change that breaks contrast fails
// CI. The fallback for browsers without light-dark() is exactly the light theme. And
// Tailwind, built the way an app's production build runs it, turns every token into
// utilities that read it, with light-dark() and the fallback left intact.

import { readFileSync } from "node:fs";
import { compile, optimize } from "@tailwindcss/node";
import { describe, expect, test } from "vitest";

type Mode = "light" | "dark";
const MODES: Mode[] = ["light", "dark"];

/** The custom properties declared in one rule's body, name to value. */
function declarations(body = ""): Map<string, string> {
  const found = body.matchAll(/--([\w-]+):\s*([^;]+);/g);
  return new Map([...found].map(([, name = "", value = ""]) => [name, value]));
}

// theme.css has two :root rules: the fallback (plain light values), then the themed one
// inside @supports (light-dark() pairs).
const css = readFileSync(new URL("./theme.css", import.meta.url), "utf8");
const [fallbackRule, themedRule] = [...css.matchAll(/:root \{([^}]*)\}/g)].map((rule) => rule[1]);
const fallback = declarations(fallbackRule);
const themed = declarations(themedRule);

/** Each token's light and dark colors. An alias (var(--other)) takes the other token's. */
function readTokens(): Map<string, Record<Mode, string>> {
  const tokens = new Map<string, Record<Mode, string>>();
  for (const [name, value] of fallback) {
    const pair = themed.get(name)?.match(/^light-dark\((#[0-9a-f]{6}), (#[0-9a-f]{6})\)$/);
    const alias = tokens.get(value.match(/^var\(--([\w-]+)\)$/)?.[1] ?? "");
    if (pair?.[1] && pair[2]) tokens.set(name, { light: pair[1], dark: pair[2] });
    else if (alias) tokens.set(name, alias);
    // Fail loudly rather than skip a token this reader doesn't understand.
    else throw new Error(`Can't read --${name}: ${value} / ${themed.get(name)}`);
  }
  return tokens;
}

const tokens = readTokens();

function color(token: string, mode: Mode): string {
  const value = tokens.get(token)?.[mode];
  if (!value) throw new Error(`No token --${token}`);
  return value;
}

const channels = (hex: string) => [1, 3, 5].map((i) => Number.parseInt(hex.slice(i, i + 2), 16));

/** WCAG 2.2 relative luminance. */
function luminance(hex: string): number {
  const [r = 0, g = 0, b = 0] = channels(hex).map((channel) => {
    const c = channel / 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(a: string, b: string): number {
  const [high = 0, low = 0] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (high + 0.05) / (low + 0.05);
}

/** `hex` at `alpha` over `under`: how Tailwind's `/15` modifier draws a badge on a card. */
function over(hex: string, alpha: number, under: string): string {
  const below = channels(under);
  const mixed = channels(hex).map((c, i) => Math.round(c * alpha + (below[i] ?? 0) * (1 - alpha)));
  return `#${mixed.map((c) => c.toString(16).padStart(2, "0")).join("")}`;
}

const TEXT = 4.5; // WCAG 1.4.3, text smaller than 18.66px bold or 24px
const EDGE = 3; // WCAG 1.4.11, a control's edge or a focus ring

const STATUS = ["success", "warning", "destructive"];
const SURFACES = ["background", "card"];

const PAIRS: [foreground: string, background: string, minimum: number][] = [
  ...["foreground", "muted-foreground"].flatMap((text) =>
    [...SURFACES, "muted"].map((bg): [string, string, number] => [text, bg, TEXT]),
  ),
  ["card-foreground", "card", TEXT],
  ["primary-foreground", "primary", TEXT],
  // primary is also link text.
  ...["primary", ...STATUS].flatMap((text) =>
    SURFACES.map((bg): [string, string, number] => [text, bg, TEXT]),
  ),
  ...["input", "ring"].flatMap((edge) =>
    SURFACES.map((bg): [string, string, number] => [edge, bg, EDGE]),
  ),
];

describe("contrast", () => {
  test.each(MODES.flatMap((mode) => PAIRS.map(([fg, bg, minimum]) => ({ mode, fg, bg, minimum }))))(
    "$fg on $bg, $mode: at least $minimum:1",
    ({ mode, fg, bg, minimum }) => {
      expect(contrast(color(fg, mode), color(bg, mode))).toBeGreaterThanOrEqual(minimum);
    },
  );

  test.each(MODES.flatMap((mode) => STATUS.map((status) => ({ mode, status }))))(
    "$status badge ($status/15 on card), $mode: at least 4.5:1",
    ({ mode, status }) => {
      const badge = over(color(status, mode), 0.15, color("card", mode));
      expect(contrast(color(status, mode), badge)).toBeGreaterThanOrEqual(TEXT);
    },
  );
});

describe("fallback", () => {
  test("every themed token has a fallback, and nothing else is themed", () => {
    expect([...themed.keys()].filter((name) => !fallback.has(name))).toEqual([]);
  });

  test.each([...themed.keys()])("--%s falls back to its light value", (name) => {
    expect(fallback.get(name)).toBe(tokens.get(name)?.light);
  });
});

describe("Tailwind", () => {
  // The same compile and optimize steps @tailwindcss/vite runs in an app's production build.
  const compiling = compile('@import "tailwindcss";\n@import "./theme.css";', {
    base: import.meta.dirname,
    onDependency: () => {},
  });
  async function build(candidates: string[]): Promise<string> {
    return optimize((await compiling).build(candidates)).code;
  }

  test("the theme tells Tailwind to scan the compiled components", async () => {
    const { sources } = await compiling;
    expect(sources).toContainEqual({
      base: import.meta.dirname,
      pattern: "./dist",
      negated: false,
    });
  });

  test("every token gets utilities that read it where they're used", async () => {
    const names = [...tokens.keys()];
    const css = await build(names.map((name) => `bg-${name}`));
    for (const name of names) {
      expect(css).toMatch(
        new RegExp(`\\.bg-${name}\\s*\\{\\s*background-color:\\s*var\\(--${name}\\);`),
      );
    }
  });

  test("opacity modifiers mix the token itself, so badges flip with the theme", async () => {
    const css = await build(["bg-success/15"]);
    expect(css).toContain("color-mix(in oklab, var(--success) 15%, transparent)");
  });

  test("the production build keeps light-dark(), rather than rewriting it for older browsers", async () => {
    const css = await build([]);
    expect(css).toContain("color-scheme: light dark");
    // Lightning CSS may shorten a hex color (#ffffff to #fff), so match any hex.
    expect(css).toMatch(/--success: light-dark\(#[0-9a-f]{3,6}, #[0-9a-f]{3,6}\)/);
  });

  test("the production build keeps the fallback, ahead of the @supports block", async () => {
    const css = await build([]);
    const plain = css.search(/--success: #[0-9a-f]{3,6};/);
    const guarded = css.search(/@supports[^{]*light-dark/);
    expect(plain).toBeGreaterThan(-1);
    expect(guarded).toBeGreaterThan(plain);
  });
});

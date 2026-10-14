// Renders each component to HTML and checks its structure: what a screen reader gets, and
// that optional parts are left out when not given. Then checks that every class the
// components render is one Tailwind generates.

import { fileURLToPath } from "node:url";
import { compile } from "@tailwindcss/node";
import type { ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { expect, test } from "vitest";
import * as ui from "./index.js";
import { Button, Card, List, ListRow, Meter, SegmentedControl } from "./index.js";

test.each([
  [0.42, "42%"],
  [1.5, "100%"],
  [-1, "0%"],
  [Number.NaN, "0%"],
])("Meter draws %s as a bar %s wide", (value, width) => {
  expect(renderToStaticMarkup(<Meter value={value} />)).toContain(`width:${width}`);
});

test("Meter is hidden from screen readers", () => {
  expect(renderToStaticMarkup(<Meter value={0.5} />)).toMatch(/^<div aria-hidden="true"/);
});

test("ListRow is a list item with its label, detail, and graphic", () => {
  const html = renderToStaticMarkup(
    <ListRow label="Question word order" detail="99% · 9 answers">
      <Meter value={0.99} />
    </ListRow>,
  );
  expect(html).toMatch(/^<li /);
  expect(html).toContain("<span>Question word order</span>");
  expect(html).toContain("99% · 9 answers");
  expect(html).toContain("width:99%");
});

test("ListRow leaves out the detail and the graphic's wrapper when they aren't given", () => {
  const html = renderToStaticMarkup(<ListRow label="Tone" />);
  expect(html).toBe(
    '<li class="py-3"><div class="flex items-baseline justify-between gap-3 text-sm"><span>Tone</span></div></li>',
  );
});

test("List keeps the page's own heading element and puts the rows in a ul", () => {
  const html = renderToStaticMarkup(
    <List heading={<h3>Grammar</h3>} description="Help text">
      <ListRow label="A" />
      <ListRow label="B" />
    </List>,
  );
  expect(html).toContain("<h3>Grammar</h3>");
  expect(html).toContain("Help text</p>");
  expect(html.match(/<li /g)).toHaveLength(2);
  expect(html).toMatch(/<ul [^>]*>(<li .*<\/li>){1}<\/ul><\/div>$/);
});

test("List with no heading or description is just the rows", () => {
  const html = renderToStaticMarkup(
    <List>
      <ListRow label="A" />
    </List>,
  );
  expect(html).not.toContain("font-semibold");
  expect(html).not.toContain("<p");
});

test("Button is a plain button unless asked to submit", () => {
  expect(renderToStaticMarkup(<Button>Next</Button>)).toMatch(/^<button type="button"/);
  expect(renderToStaticMarkup(<Button type="submit">Check</Button>)).toMatch(
    /^<button type="submit"/,
  );
});

test("Button passes native props through and adds className after its own classes", () => {
  const html = renderToStaticMarkup(
    <Button variant="outline" className="flex-1" disabled aria-label="More">
      …
    </Button>,
  );
  expect(html).toContain('disabled=""');
  expect(html).toContain('aria-label="More"');
  expect(html).toMatch(/class="[^"]*border-input[^"]* flex-1"/);
});

test("Card is a section that keeps its accessible name", () => {
  const html = renderToStaticMarkup(<Card aria-labelledby="title">Body</Card>);
  expect(html).toMatch(/^<section class="[^"]+" aria-labelledby="title">Body<\/section>$/);
});

test("SegmentedControl is one named group of radio buttons with the value checked", () => {
  const html = renderToStaticMarkup(
    <SegmentedControl
      label="Show"
      value="over-time"
      onChange={() => {}}
      options={[
        { value: "now", label: "Now" },
        { value: "over-time", label: "Over time" },
      ]}
    />,
  );
  expect(html).toMatch(/^<fieldset [^>]*><legend class="sr-only">Show<\/legend>/);
  const radios = [...html.matchAll(/<input type="radio"[^>]*>/g)].map((match) => match[0]);
  expect(radios).toHaveLength(2);
  const names = radios.map((radio) => radio.match(/name="([^"]+)"/)?.[1]);
  expect(names[0]).toBeTruthy();
  expect(names[1]).toBe(names[0]);
  expect(radios.map((radio) => radio.includes("checked"))).toEqual([false, true]);
});

// One rendering of every component, with each variant and optional part, for the class
// check below. A new component has to be added here: the first test fails until it is.
const SAMPLES: Record<string, ReactNode> = {
  Button: (
    <>
      <Button>Default</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost" size="icon" aria-label="Ghost" />
    </>
  ),
  Card: <Card>Body</Card>,
  List: (
    <List heading={<h3>Heading</h3>} description="Description">
      <ListRow label="Row" />
    </List>
  ),
  ListRow: (
    <ListRow label="Row" detail="Detail">
      graphic
    </ListRow>
  ),
  Meter: <Meter value={0.5} />,
  SegmentedControl: (
    <SegmentedControl
      label="Show"
      value="a"
      onChange={() => {}}
      options={[
        { value: "a", label: "A" },
        { value: "b", label: "B" },
      ]}
    />
  ),
};

test("the class check covers every component the package exports", () => {
  expect(Object.keys(SAMPLES).sort()).toEqual(Object.keys(ui).sort());
});

// An app can't catch a mistyped class inside a package: Tailwind skips names it doesn't
// know, and the style is silently missing.
test("every class the components render is one Tailwind generates", async () => {
  const html = renderToStaticMarkup(Object.values(SAMPLES));
  const classes = [
    ...new Set([...html.matchAll(/class="([^"]+)"/g)].flatMap((match) => match[1]?.split(" "))),
  ].filter((name) => name !== undefined);
  expect(classes.length).toBeGreaterThan(20);
  const compiler = await compile('@import "tailwindcss";\n@import "./theme.css";', {
    base: fileURLToPath(new URL("..", import.meta.url)),
    onDependency: () => {},
  });
  const css = compiler.build(classes);
  const escaped = (name: string) => name.replace(/[:/.]/g, (character) => `\\${character}`);
  const missing = classes.filter((name) => !css.includes(`.${escaped(name)}`));
  expect(missing).toEqual([]);
});

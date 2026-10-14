// Renders each component to HTML and checks its structure: what a screen reader gets, and
// that optional parts are left out when not given.

import { renderToStaticMarkup } from "react-dom/server";
import { expect, test } from "vitest";
import { List, ListRow, Meter } from "./index.js";

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

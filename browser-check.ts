// Opens browser-check.html in Chromium, Firefox, and WebKit, with the system set to light
// and then dark, and fails unless every check on the page passes (ADR 0003). The page must
// also report "themed": these engines all have light-dark(), so landing on the fallback
// would mean the @supports block stopped applying. Run with `npm run test:browsers`.

import { chromium, firefox, webkit } from "playwright";

const url = new URL("./browser-check.html", import.meta.url).href;

// All three by default. Name engines to run only those: npm run test:browsers -- webkit
const named = process.argv.slice(2);
const engines = [chromium, firefox, webkit].filter(
  (engine) => named.length === 0 || named.includes(engine.name()),
);
if (engines.length === 0) throw new Error(`No engine named ${named.join(", ")}`);

for (const engine of engines) {
  const browser = await engine.launch();
  for (const colorScheme of ["light", "dark"] as const) {
    const page = await browser.newPage({ colorScheme });
    await page.goto(url);
    const mode = await page.locator("html").getAttribute("data-mode");
    const result = await page.locator("html").getAttribute("data-result");
    const ok = mode === "themed" && result === "pass";
    console.log(
      `${ok ? "pass" : "FAIL"}  ${engine.name()} ${browser.version()}, system ${colorScheme}: ${mode}`,
    );
    if (!ok) {
      process.exitCode = 1;
      for (const line of await page.locator('#checks li[data-ok="false"]').allInnerTexts()) {
        console.log(`      ${line.replaceAll("\n", ": ")}`);
      }
    }
    await page.close();
  }
  await browser.close();
}

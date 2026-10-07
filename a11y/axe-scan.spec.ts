import { readFileSync } from 'node:fs';
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const baseline: string[] = JSON.parse(readFileSync('a11y-baseline.json', 'utf8'));

// A deliberately inaccessible demo page: no network needed, no real site involved
const demoPage = `<!doctype html>
<html>
<head><title>Demo store</title></head>
<body>
  <main>
    <h1>Demo store</h1>
    <img src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==">
    <p style="color:#aaa;background:#fff">Light grey text on a white background</p>
    <button></button>
    <input type="text">
  </main>
</body>
</html>`;

test('axe scan: demo-store', async ({ page }, testInfo) => {
  await page.setContent(demoPage);

  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
    .analyze();

  await testInfo.attach('axe-results-demo-store', {
    body: JSON.stringify(results, null, 2),
    contentType: 'application/json',
  });

  const newViolations = results.violations.filter(
    (v) => !baseline.includes(`demo-store::${v.id}`)
  );
  expect(newViolations).toEqual([]);
});
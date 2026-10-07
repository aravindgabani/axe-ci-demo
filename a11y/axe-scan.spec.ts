import { readFileSync } from 'node:fs';
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const baseline: string[] = JSON.parse(readFileSync('a11y-baseline.json', 'utf8'));

const routes = [{ name: 'mars-demo', path: '/demo/mars/' }];

for (const { name, path } of routes) {
  test(`axe scan: ${name}`, async ({ page }, testInfo) => {
    await page.goto(path);
    await page.waitForLoadState('load');

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
      .analyze();

    await testInfo.attach(`axe-results-${name}`, {
      body: JSON.stringify(results, null, 2),
      contentType: 'application/json',
    });

    const newViolations = results.violations.filter(
      (v) => !baseline.includes(`${path}::${v.id}`)
    );
    expect(newViolations).toEqual([]);
  });
}
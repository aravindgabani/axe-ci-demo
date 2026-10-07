import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './a11y',
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html', { open: 'never' }],
    ['junit', { outputFile: 'test-results/a11y-junit.xml' }],
  ],
  use: { baseURL: 'https://dequeuniversity.com' },
});
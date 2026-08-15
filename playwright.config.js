const { defineConfig } = require('@playwright/test');

/**
 * Playwright configuration wired for Google Chrome via playwright-core
 */
module.exports = defineConfig({
  testDir: './tests',
  timeout: 45000,
  expect: {
    timeout: 5000,
  },
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 2,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: 'http://localhost:8080',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    channel: 'chrome', // Wire to Google Chrome
  },
  projects: [
    {
      name: 'Google Chrome',
      use: {
        channel: 'chrome',
      },
    },
  ],
  webServer: {
    command: 'node scripts/server.js',
    url: 'http://localhost:8080',
    reuseExistingServer: !process.env.CI,
    timeout: 10000,
  },
});

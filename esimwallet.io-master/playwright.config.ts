import { defineConfig, devices, ReporterDescription } from '@playwright/test';

const TEST_DIR = './tests-e2e';
const TEST_RESULTS_DIR = './tests-e2e/test-results'; // outputDir
const TEST_REPORTS_DIR = './tests-e2e/reports';

const isCI = !!process.env.CI;
const runsFromNpmScripts = !!process.env.npm_lifecycle_script;
const isUIMode = (process.env.npm_lifecycle_script ?? '').includes('--ui');

/**
 * See https://playwright.dev/docs/test-configuration.
 */
const config = defineConfig({
  name: 'eSIMwallet',

  testMatch: '*.spec.ts',
  testDir: TEST_DIR,
  outputDir: TEST_RESULTS_DIR,
  reporter: [
    // 'html' reporter included at the end of this script - but only for non-UI mode
    ['list'],
  ],

  globalTimeout: 15 * 60 * 1000, // 15min
  fullyParallel: true,
  forbidOnly: isCI, // Fail when `test.only()` left in the source code.
  retries: isCI ? 3 : 0,
  workers: isCI ? 1 : undefined,

  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    baseURL: process.env.PW_BASE_URL ?? 'http://localhost:3000',
    // trace: isCI ? 'on-first-retry' : 'on',
    trace: 'on',
    colorScheme: 'dark',
  },

  /* Run your local dev server before starting the tests */
  globalSetup: './tests-e2e/e2e-setup',
  webServer: {
    command: 'pnpm start',
    url: 'http://localhost:3000',
    reuseExistingServer: true,
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],
});

if (runsFromNpmScripts && !isUIMode) {
  // If 'html' is added always, it causes some issues with UI inspector
  // i.e. quitting right away after the test run and thus loosing ability to inspect the tests.
  // That's why we add it only when running w/o --ui flag.
  (config.reporter as ReporterDescription[]).push([
    'html',
    {
      outputDir: TEST_RESULTS_DIR,
      outputFolder: TEST_REPORTS_DIR,
    },
  ]);
}

export default config;

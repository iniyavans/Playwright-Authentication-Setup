// @ts-check
const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  // Directory containing the test files
  testDir: './tests',
  
  // Set a global timeout for each test (in milliseconds)
  timeout: 3000000,
  
  // Run tests in parallel across multiple files
  fullyParallel: true,
  
  // Prevents `test.only` from being committed accidentally by failing the build in CI
  forbidOnly: !!process.env.CI,
  
  // Retry failed tests twice only on CI
  retries: process.env.CI ? 2 : 0,
  
  // Run tests sequentially on CI to avoid resource contention
  workers: process.env.CI ? 1 : undefined,
  
  // Set the reporter for test results; 'html' generates a detailed HTML report
  reporter: 'html',
  
  // Shared settings for all projects
  use: {
    // Enable trace collection on the first retry of a failed test
    trace: 'on-first-retry',
  },

  // Define multiple projects for different browsers or setups
  projects: [
    // Setup project to handle authentication before running tests
    { name: 'setup', testMatch: 'setup.js' },
    
    // Chromium project using Desktop Chrome settings and the authentication state
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        storageState: 'playwright/.auth/user.json', // Load saved authentication state
      },
      dependencies: ['setup'], // Ensure setup runs before this project
    },
  ],

  // Uncomment to run a local dev server before starting the tests
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://127.0.0.1:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});

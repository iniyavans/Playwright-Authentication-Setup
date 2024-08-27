
# 🚀 Playwright Authentication Setup

This repository demonstrates how to efficiently set up authentication in Playwright using environment variables and by storing the authenticated state for reuse in tests. This approach minimizes repetitive login actions, enhancing both test speed and reliability.

## 🔐 Why Use Authentication in Playwright?

In many testing scenarios, you may need to:
1. **Perform login before each test** - Ensures a fresh session for each test.

2. **Reuse an authenticated session** - Avoids repeated logins by saving and reusing the session state.

3. **Run tests without re-authentication** - Leverages existing authenticated sessions, speeding up the test suite.

All of these can be implemented using Playwright's `BrowserContext`.

**Benefits**:
- **Increased Test Efficiency**: Reduces the time spent on repetitive login steps, allowing more tests to be executed in less time.
- **Improved Test Reliability**: Minimizes the risk of login-related flakiness by using a consistent, authenticated state across tests.
- **Enhanced Maintainability**: Centralizes the authentication logic, making your test code easier to manage and update.

## 🖥️ What is `BrowserContext`?

`BrowserContext` in Playwright acts as an isolated environment within a browser instance, similar to incognito mode. It allows for multiple independent browser sessions, enabling parallel execution of tests with separate storage, cookies, and cache. This isolation is crucial for testing multiple user interactions or distinct states within the same application.

### ✨ Key Features of `BrowserContext`:

- **Isolation**: Each context operates independently, preventing data sharing between them.
- **Parallel Execution**: Run multiple contexts simultaneously to speed up test execution.
- **Persistent Context**: Store session data (e.g., login state) for reuse across tests.
- **Multiple Pages**: Simulate real-world scenarios with multiple tabs within the same session.

## 📋 Prerequisites

Before you begin, ensure you have the following:

- **Node.js** installed. [Download Node.js](https://nodejs.org/) if you don't have it installed.
- **Playwright** installed in your project:

   ```bash
   npm install @playwright/test
   ```

- **Environment Variables**: Set up a `.env` file in the root directory of your project to store sensitive data such as URLs and user credentials. Example:

  ```bash
  URL=https://example.com/
  USER_EMAIL=your-email@example.com
  USER_PASSWORD=your-password
  ```

## 🔧 Setting Up Authentication

To handle authentication efficiently, it's common to store the authenticated browser state on the file system. You can create a `playwright/.auth` directory and add it to your `.gitignore` to avoid committing sensitive data.

```bash
mkdir -p playwright/.auth
echo $'\nplaywright/.auth' >> .gitignore
```

### 1️⃣ Sign-In with Setup

Implement the login functionality in a setup script to authenticate before each test execution:

```javascript
import { test as setup, expect } from '@playwright/test';
const LoginPage = require('../pages/LoginPage');

// Load environment variables from the .env file
require('dotenv').config();

// Path to save authentication state
const authFile = 'playwright/.auth/user.json';

setup('Perform login and store auth details', async ({ browser }) => {
    if (!process.env.URL || !process.env.USER_EMAIL || !process.env.USER_PASSWORD) {
        throw new Error('Missing required environment variables');
    }

    const context = await browser.newContext();
    const page = await context.newPage();
    const loginPage = new LoginPage(page);

    await page.goto(`${process.env.URL}login`);
    await loginPage.userLogin(process.env.USER_EMAIL, process.env.USER_PASSWORD);
    await expect(page).toHaveTitle(/Notification Status/);
    await context.storageState({ path: authFile });
    await context.close();
});
```

### 🔑 Code Breakdown:

- **Environment Variables**: The login details and URL are securely managed via environment variables.
- **Storage of Authentication State**: The authenticated session is saved in the `user.json` file, which can be reused across tests.
- **Error Handling**: Basic error handling ensures that the required environment variables are present.

### 2️⃣ Reuse Signed-In State

Configure Playwright to reuse the authenticated state stored during setup to avoid repeated logins.

```javascript
// Playwright config file

projects: [
  { name: 'setup', testMatch: 'setup.js' },
  {
    name: 'chromium',
    use: {
      ...devices['Desktop Chrome'],
      storageState: 'playwright/.auth/user.json',
    },
    dependencies: ['setup'],
  },
],
```

### ⚙️ Config Explanation:

- **Setup Project**: Runs the setup script to perform login and store the session state.
- **Dependencies**: The test project depends on the setup project, ensuring that the authentication state is always prepared before tests run.

### 3️⃣ Running Tests Without Additional Sign-Ins

After storing authentication details in `user.json`, leverage the existing session to run tests:

```javascript
const { test, expect } = require('@playwright/test');
test.use({ storageState: 'playwright/.auth/user.json' });

test('Navigate to Notification Status page', async ({ page }) => {
    await page.goto(`${process.env.URL}notifier/notification-status`);
    await expect(page).toHaveTitle(/Notification Status/);
});
```

### 🔍 Test Example Explanation:

- **Reuse State**: The `storageState` option loads the previously saved session, allowing tests to bypass the login step.
- **Test Scenario**: The test verifies that the user can access the "Notification Status" page without needing to log in again.

## ⚠️ Common Pitfalls

- **Expired Sessions**: Ensure that your session state is up-to-date. If the session expires, you may need to re-run the setup script to generate a new `user.json`.
- **Sensitive Data Management**: Always store sensitive information, like user credentials, in environment variables or secure vaults. Never hard-code these into your tests.
- **Context Leaks**: Make sure contexts are properly closed after each test to prevent memory leaks and ensure test isolation.

## 🏁 Conclusion

By setting up authentication as shown, you streamline your Playwright tests, reduce redundant steps, and make your test suite more efficient and reliable. This approach not only speeds up execution but also ensures that your tests are more robust and less prone to failure due to login issues.
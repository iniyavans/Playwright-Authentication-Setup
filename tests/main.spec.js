const { test, expect } = require('@playwright/test');
// Load environment variables from the .env file
require('dotenv').config();

// Use the storage state generated in auth.setup.js for authentication
test.use({ storageState: 'playwright/.auth/user.json' });

// Test to verify navigation to the Notification Status page using a direct URL
test('Verify Notifier can move to the Notification status page by using the direct URL', async ({ page }) => {

    // Navigate to the Notification Status page using the direct URL from environment variables
    await page.goto(`${process.env.URL}notifier/notification-status`);

    // Verify that the page title matches the expected title "Notification Status"
    await expect(page).toHaveTitle(/Notification Status/);

});

// Test to verify navigation to the Profile page using a direct URL
test('Verify Notifier can move to the Profile page by using the direct URL', async ({ page }) => {

    // Navigate to the Profile page using the direct URL from environment variables
    await page.goto(`${process.env.URL}notifier/profile`);

    // Verify that the page title matches the expected title "Profile"
    await expect(page).toHaveTitle(/Profile/);

});

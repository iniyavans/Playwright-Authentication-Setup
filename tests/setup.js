import { test as setup, expect } from '@playwright/test';
const LoginPage = require('../pages/LoginPage');

// Load environment variables from the .env file
require('dotenv').config();

// Path to save authentication state
const authFile = 'playwright/.auth/user.json';

// Test to handle the setup for login functionality and store authentication details
setup('login functionality - And Add the auth details.', async ({ browser }) => {

    // Validate the existence of required environment variables
    if (!process.env.URL || !process.env.USER_EMAIL || !process.env.USER_PASSWORD) {
        throw new Error('Missing required environment variables');
    }

    // Create a new browser context
    const context = await browser.newContext();

    // Open a new page within the context
    const page = await context.newPage();

    // Instantiate the LoginPage class with the page object
    const loginPage = new LoginPage(page);

    // Navigate to the login page using the URL from environment variables
    await page.goto(`${process.env.URL}login`);

    // Perform the login using email and password from environment variables
    await loginPage.userLogin(process.env.USER_EMAIL, process.env.USER_PASSWORD);

    // Verify that the page title matches the expected title after login
    await expect(page).toHaveTitle(/Notification Status/);

    // Save the browser's storage state (including authentication) to a file
    await context.storageState({ path: authFile });

    // Close the browser context to clean up
    await context.close();
});

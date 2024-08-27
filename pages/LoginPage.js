class LoginPage {
    // Constructor to initialize the page object
    constructor(page) {
        this.page = page;
    }

    // Getter method to locate the email input field using its label
    get emailAddress() {
        return this.page.getByLabel('Email *');
    }

    // Getter method to locate the password input field using XPath
    get password() {
        return this.page.locator("//*[@id='password']");
    }

    // Getter method to locate the sign-in button using its type attribute
    get signinButton() {
        return this.page.locator("//*[@type='submit']");
    }

    // Method to perform the user login operation
    async userLogin(email, password) {
        // Click on the email input field
        await this.emailAddress.click();

        // Fill the email input field with the provided email address
        await this.emailAddress.fill(email);

        // Click on the password input field
        await this.password.click();

        // Fill the password input field with the provided password
        await this.password.fill(password);

        // Optional: Wait for 1 second (can be removed or adjusted as needed)
        await this.page.waitForTimeout(1000);

        // Click on the sign-in button to submit the form
        await this.signinButton.click();
    }
}

// Export the LoginPage class as a module
module.exports = LoginPage;

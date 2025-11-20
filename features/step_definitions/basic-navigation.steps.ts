import { Given, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../support/world';

Given('I open the application', async function (this: CustomWorld) {
    await this.page.goto('http://localhost:5173');
});

Then('I should see {string} heading', async function (this: CustomWorld, text: string) {
    const heading = this.page.getByRole('heading', { name: text });
    await expect(heading).toBeVisible();
});

import { Before, After, setWorldConstructor, World } from '@cucumber/cucumber';
import { Browser, BrowserContext, Page, chromium } from '@playwright/test';

export class CustomWorld extends World {
    browser!: Browser;
    context!: BrowserContext;
    page!: Page;
}

setWorldConstructor(CustomWorld);

Before(async function (this: CustomWorld) {
    this.browser = await chromium.launch();
    this.context = await this.browser.newContext();
    this.page = await this.context.newPage();
});

After(async function (this: CustomWorld) {
    await this.page?.close();
    await this.context?.close();
    await this.browser?.close();
});

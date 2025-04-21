import { Page } from '@playwright/test';

export class BasePage {
  constructor(protected page: Page) {}

  // Common methods used across all pages
  async waitForPageLoad() {
    await this.page.waitForLoadState('networkidle');
  }

  async getPageTitle() {
    return this.page.title();
  }

  async navigateTo(path: string) {
    await this.page.goto(path);
    await this.waitForPageLoad();
  }
} 
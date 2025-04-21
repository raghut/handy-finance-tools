import { Page } from '@playwright/test';
import { BasePage } from './base-page';

export class HomePage extends BasePage {
  // Selectors
  private readonly calculatorHubTitle = this.page.getByTestId('calculator-hub-title');
  private readonly calculatorGrid = this.page.getByTestId('calculator-grid');
  private readonly emiCalculatorCard = this.page.getByTestId('calculator-card-0');
  private readonly emiCalculatorLink = this.page.getByTestId('calculator-card-0-link');
  private readonly interestCalculatorCard = this.page.getByTestId('calculator-card-1');
  private readonly interestCalculatorLink = this.page.getByTestId('calculator-card-1-link');

  constructor(page: Page) {
    super(page);
  }

  // Navigation
  async navigate() {
    await this.navigateTo('/');
  }

  // Actions
  async clickEmiCalculatorLink() {
    await this.emiCalculatorLink.click();
    await this.waitForPageLoad();
  }

  async clickInterestCalculatorLink() {
    await this.interestCalculatorLink.click();
    await this.waitForPageLoad();
  }

  // State
  async isCalculatorHubTitleVisible() {
    return this.calculatorHubTitle.isVisible();
  }

  async isEmiCalculatorCardVisible() {
    return this.emiCalculatorCard.isVisible();
  }

  async isInterestCalculatorCardVisible() {
    return this.interestCalculatorCard.isVisible();
  }

  async getCalculatorHubTitle() {
    return this.calculatorHubTitle.textContent();
  }
} 
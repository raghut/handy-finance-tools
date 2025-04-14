import type { Page } from '@playwright/test';

export class CalculatorHelper {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async fillCalculatorInputs(data: {
    principal: string;
    rate: string;
    time: string;
  }) {
    await this.page.getByTestId('principal-amount-input').fill(data.principal);
    await this.page.getByTestId('interest-rate-input').fill(data.rate);
    await this.page.getByTestId('time-period-input').fill(data.time);
  }

  async clickCalculate() {
    await this.page.getByTestId('calculate-interest-button').click();
  }

  async getInterestValue() {
    return this.page.getByTestId('interest-amount-value').textContent();
  }
} 
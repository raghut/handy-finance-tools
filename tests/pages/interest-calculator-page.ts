import { Page, expect } from '@playwright/test';
import { BasePage } from './base-page';

export class InterestCalculatorPage extends BasePage {
  // Selectors
  private readonly calculatorContainer = this.page.getByTestId('interest-calculator-container');
  private readonly calculatorTitle = this.page.getByTestId('interest-calculator-title');
  private readonly calculatorForm = this.page.getByTestId('interest-calculator-form');
  
  // Input fields and labels
  private readonly principalInput = this.page.getByTestId('principal-amount-input');
  private readonly principalLabel = this.page.getByTestId('principal-amount-label');
  private readonly principalError = this.page.getByTestId('principal-error');
  
  private readonly rateInput = this.page.getByTestId('interest-rate-input');
  private readonly rateLabel = this.page.getByTestId('interest-rate-label');
  private readonly rateError = this.page.getByTestId('rate-error');
  
  private readonly timeInput = this.page.getByTestId('time-period-input');
  private readonly timeLabel = this.page.getByTestId('time-period-label');
  private readonly timeError = this.page.getByTestId('time-error');
  
  // Interest Type radio buttons
  private readonly interestTypeGroup = this.page.getByTestId('interest-type-group');
  private readonly interestTypeLabel = this.page.getByTestId('interest-type-label');
  private readonly simpleInterestRadio = this.page.getByTestId('simple-interest-radio');
  private readonly compoundInterestRadio = this.page.getByTestId('compound-interest-radio');
  
  // Calculate button
  private readonly calculateButton = this.page.getByTestId('calculate-interest-button');
  
  // Results
  private readonly resultContainer = this.page.getByTestId('interest-result');
  private readonly finalAmountValue = this.page.getByTestId('final-amount-value');
  private readonly interestAmountValue = this.page.getByTestId('interest-amount-value');
  
  constructor(page: Page) {
    super(page);
  }
  
  // Navigation
  async navigate() {
    await this.navigateTo('/interest-calculator');
  }
  
  // Actions
  async fillPrincipalAmount(value: string | number) {
    await this.principalInput.fill(String(value));
  }
  
  async fillInterestRate(value: string | number) {
    await this.rateInput.fill(String(value));
  }
  
  async fillTimePeriod(value: string | number) {
    await this.timeInput.fill(String(value));
  }
  
  async selectSimpleInterest() {
    await this.simpleInterestRadio.check();
  }
  
  async selectCompoundInterest() {
    await this.compoundInterestRadio.check();
  }
  
  async clickCalculateButton() {
    await this.calculateButton.click();
  }
  
  async calculateInterest(principal: string | number, rate: string | number, time: string | number, interestType: 'simple' | 'compound' = 'simple') {
    await this.fillPrincipalAmount(principal);
    await this.fillInterestRate(rate);
    await this.fillTimePeriod(time);
    
    if (interestType === 'simple') {
      await this.selectSimpleInterest();
    } else {
      await this.selectCompoundInterest();
    }
    
    await this.clickCalculateButton();
  }
  
  // State - Getters for element content
  async getCalculatorTitle() {
    return this.calculatorTitle.textContent();
  }
  
  async getFinalAmount() {
    return this.finalAmountValue.textContent();
  }
  
  async getInterestAmount() {
    return this.interestAmountValue.textContent();
  }
  
  async getPrincipalError() {
    if (await this.principalError.isVisible()) {
      return this.principalError.textContent();
    }
    return null;
  }
  
  async getRateError() {
    if (await this.rateError.isVisible()) {
      return this.rateError.textContent();
    }
    return null;
  }
  
  async getTimeError() {
    if (await this.timeError.isVisible()) {
      return this.timeError.textContent();
    }
    return null;
  }
  
  // State - Visibility checks
  async isCalculatorTitleVisible() {
    return this.calculatorTitle.isVisible();
  }
  
  async isResultVisible() {
    return this.resultContainer.isVisible();
  }
  
  async isPrincipalErrorVisible() {
    return this.principalError.isVisible();
  }
  
  async isRateErrorVisible() {
    return this.rateError.isVisible();
  }
  
  async isTimeErrorVisible() {
    return this.timeError.isVisible();
  }
  
  async isSimpleInterestSelected() {
    return this.simpleInterestRadio.isChecked();
  }
  
  async isCompoundInterestSelected() {
    return this.compoundInterestRadio.isChecked();
  }
  
  // Utility methods
  async validateResult(expectedFinalAmount: string, expectedInterestAmount: string) {
    await expect(this.finalAmountValue).toBeVisible();
    const finalAmount = await this.getFinalAmount();
    const interestAmount = await this.getInterestAmount();
    
    expect(finalAmount).toContain(expectedFinalAmount);
    expect(interestAmount).toContain(expectedInterestAmount);
  }
} 
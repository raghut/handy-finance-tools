import { Page } from '@playwright/test';
import { BasePage } from './base-page';

export class EmiCalculatorPage extends BasePage {
  // Selectors
  private readonly calculatorTitle = this.page.getByTestId('emi-calculator-title');
  private readonly calculatorForm = this.page.getByTestId('emi-calculator-form');
  
  // Input fields
  private readonly loanAmountInput = this.page.getByTestId('loan-amount-input');
  private readonly interestRateInput = this.page.getByTestId('interest-rate-input');
  private readonly loanTermInput = this.page.getByTestId('loan-term-input');
  
  // Buttons
  private readonly calculateButton = this.page.getByTestId('calculate-emi-button');
  
  // Error messages
  private readonly loanAmountError = this.page.getByTestId('loan-amount-error');
  private readonly interestRateError = this.page.getByTestId('interest-rate-error');
  private readonly loanTermError = this.page.getByTestId('loan-term-error');
  
  // Result
  private readonly emiResult = this.page.getByTestId('emi-result');
  private readonly monthlyEmiValue = this.page.getByTestId('monthly-emi-value');

  constructor(page: Page) {
    super(page);
  }

  // Navigation
  async navigate() {
    await this.navigateTo('/emi-calculator');
  }

  // Actions
  async fillLoanAmount(amount: string | number) {
    await this.loanAmountInput.fill(amount.toString());
  }

  async fillInterestRate(rate: string | number) {
    await this.interestRateInput.fill(rate.toString());
  }

  async fillLoanTerm(years: string | number) {
    await this.loanTermInput.fill(years.toString());
  }

  async clickCalculateButton() {
    await this.calculateButton.click();
  }

  async calculateEmi(amount: string | number, rate: string | number, term: string | number) {
    await this.fillLoanAmount(amount);
    await this.fillInterestRate(rate);
    await this.fillLoanTerm(term);
    await this.clickCalculateButton();
  }

  async resetForm() {
    await this.loanAmountInput.fill('');
    await this.interestRateInput.fill('');
    await this.loanTermInput.fill('');
  }

  // State
  async isCalculatorTitleVisible() {
    return this.calculatorTitle.isVisible();
  }

  async getCalculatorTitle() {
    return this.calculatorTitle.textContent();
  }

  async isEmiResultVisible() {
    return this.emiResult.isVisible();
  }

  async getMonthlyEmiValue() {
    const emiText = await this.monthlyEmiValue.textContent() || '';
    // Extract the numeric value from "Monthly EMI: ₹X,XXX.XX" or "Monthly EMI: ₹XXX.XX"
    // Updated regex to make the comma optional to support both formats
    const match = emiText.match(/₹([0-9,.]+)/);
    return match ? match[1] : '';
  }

  async isLoanAmountErrorVisible() {
    return this.loanAmountError.isVisible();
  }

  async getLoanAmountError() {
    return this.loanAmountError.textContent();
  }

  async isInterestRateErrorVisible() {
    return this.interestRateError.isVisible();
  }

  async getInterestRateError() {
    return this.interestRateError.textContent();
  }

  async isLoanTermErrorVisible() {
    return this.loanTermError.isVisible();
  }

  async getLoanTermError() {
    return this.loanTermError.textContent();
  }
} 
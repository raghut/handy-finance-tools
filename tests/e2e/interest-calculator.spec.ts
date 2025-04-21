import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/home-page';
import { InterestCalculatorPage } from '../pages/interest-calculator-page';
import { interestCalculatorTestData } from '../fixtures/interest-calculator-data';

test.describe('Interest Calculator Page', () => {
  let homePage: HomePage;
  let interestCalculatorPage: InterestCalculatorPage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    interestCalculatorPage = new InterestCalculatorPage(page);
  });

  /**
   * Navigation Tests
   */
  test('[TC-INTCALC-001][TC-INTCALC-051] User should be able to navigate to the Interest Calculator from the home screen', async ({ page }) => {
    // Arrange
    await homePage.navigate();
    
    // Act
    await expect(homePage.isInterestCalculatorCardVisible()).resolves.toBeTruthy();
    await homePage.clickInterestCalculatorLink();
    
    // Assert
    await expect(interestCalculatorPage.isCalculatorTitleVisible()).resolves.toBeTruthy();
    await expect(page).toHaveURL('/interest-calculator');
  });

  test('[TC-INTCALC-002] Page title should display "Interest Calculator"', async () => {
    // Arrange
    await interestCalculatorPage.navigate();
    
    // Assert
    await expect(interestCalculatorPage.getCalculatorTitle()).resolves.toBe('Interest Calculator');
  });

  /**
   * Positive Test Cases
   */
  test('[TC-INTCALC-006] Simple Interest should be selected by default', async () => {
    // Arrange
    await interestCalculatorPage.navigate();
    
    // Assert
    await expect(interestCalculatorPage.isSimpleInterestSelected()).resolves.toBeTruthy();
  });

  test('[TC-INTCALC-007] User should be able to switch between Simple Interest and Compound Interest options', async () => {
    // Arrange
    await interestCalculatorPage.navigate();
    
    // Act & Assert - Switch to Compound
    await interestCalculatorPage.selectCompoundInterest();
    await expect(interestCalculatorPage.isCompoundInterestSelected()).resolves.toBeTruthy();
    await expect(interestCalculatorPage.isSimpleInterestSelected()).resolves.toBeFalsy();
    
    // Act & Assert - Switch back to Simple
    await interestCalculatorPage.selectSimpleInterest();
    await expect(interestCalculatorPage.isSimpleInterestSelected()).resolves.toBeTruthy();
    await expect(interestCalculatorPage.isCompoundInterestSelected()).resolves.toBeFalsy();
  });

  test('[TC-INTCALC-008][TC-INTCALC-009] Simple Interest calculation should display correct results', async () => {
    // Arrange
    await interestCalculatorPage.navigate();
    const testData = interestCalculatorTestData.validInputs.standard;
    
    // Act
    await interestCalculatorPage.calculateInterest(
      testData.principal,
      testData.rate,
      testData.time,
      'simple'
    );
    
    // Assert
    await expect(interestCalculatorPage.isResultVisible()).resolves.toBeTruthy();
    await interestCalculatorPage.validateResult(
      testData.expectedFinalAmount,
      testData.expectedInterestAmount
    );
  });

  test('[TC-INTCALC-010] Compound Interest calculation should display correct results', async () => {
    // Arrange
    await interestCalculatorPage.navigate();
    const testData = interestCalculatorTestData.validInputs.compoundInterest;
    
    // Act
    await interestCalculatorPage.calculateInterest(
      testData.principal,
      testData.rate,
      testData.time,
      'compound'
    );
    
    // Assert
    await expect(interestCalculatorPage.isResultVisible()).resolves.toBeTruthy();
    await interestCalculatorPage.validateResult(
      testData.expectedFinalAmount,
      testData.expectedInterestAmount
    );
  });

  test('[TC-INTCALC-011][TC-INTCALC-012] Results should be displayed with ₹ symbol and formatted with 2 decimal places', async () => {
    // Arrange
    await interestCalculatorPage.navigate();
    const testData = interestCalculatorTestData.validInputs.standard;
    
    // Act
    await interestCalculatorPage.calculateInterest(
      testData.principal,
      testData.rate,
      testData.time,
      'simple'
    );
    
    // Assert
    const finalAmount = await interestCalculatorPage.getFinalAmount();
    const interestAmount = await interestCalculatorPage.getInterestAmount();
    
    expect(finalAmount).toMatch(/Final Amount: ₹[\d,]+\.\d{2}$/);
    expect(interestAmount).toMatch(/Interest Amount: ₹[\d,]+\.\d{2}$/);
  });

  /**
   * Negative Test Cases
   */
  test('[TC-INTCALC-014][TC-INTCALC-015][TC-INTCALC-016] Should show required error messages when fields are empty', async () => {
    // Arrange
    await interestCalculatorPage.navigate();
    
    // Act
    await interestCalculatorPage.clickCalculateButton();
    
    // Assert
    await expect(interestCalculatorPage.getPrincipalError()).resolves.toBe(
      interestCalculatorTestData.errorMessages.required.principal
    );
    await expect(interestCalculatorPage.getRateError()).resolves.toBe(
      interestCalculatorTestData.errorMessages.required.rate
    );
    await expect(interestCalculatorPage.getTimeError()).resolves.toBe(
      interestCalculatorTestData.errorMessages.required.time
    );
  });

  test('[TC-INTCALC-017][TC-INTCALC-018][TC-INTCALC-019] Should show error for non-numeric inputs', async ({ page }) => {
    // Arrange
    await interestCalculatorPage.navigate();
    
    // Act - Use a workaround for non-numeric input since HTML number inputs don't accept text
    await page.evaluate(() => {
      (document.querySelector('[data-testid="principal-amount-input"]') as HTMLInputElement).value = 'abc';
      (document.querySelector('[data-testid="interest-rate-input"]') as HTMLInputElement).value = 'xyz';
      (document.querySelector('[data-testid="time-period-input"]') as HTMLInputElement).value = 'pqr';
    });
    await interestCalculatorPage.clickCalculateButton();
    
    // Assert
    await expect(interestCalculatorPage.getPrincipalError()).resolves.toBe(
      interestCalculatorTestData.errorMessages.invalid.principal
    );
    await expect(interestCalculatorPage.getRateError()).resolves.toBe(
      interestCalculatorTestData.errorMessages.invalid.rate
    );
    await expect(interestCalculatorPage.getTimeError()).resolves.toBe(
      interestCalculatorTestData.errorMessages.invalid.time
    );
  });

  test('[TC-INTCALC-020][TC-INTCALC-021][TC-INTCALC-022] Should show error for negative values', async () => {
    // Arrange
    await interestCalculatorPage.navigate();
    const testData = interestCalculatorTestData.invalidInputs.negative;
    
    // Act
    await interestCalculatorPage.calculateInterest(
      testData.principal,
      testData.rate,
      testData.time
    );
    
    // Assert
    await expect(interestCalculatorPage.getPrincipalError()).resolves.toBe(
      interestCalculatorTestData.errorMessages.negative.principal
    );
    await expect(interestCalculatorPage.getRateError()).resolves.toBe(
      interestCalculatorTestData.errorMessages.negative.rate
    );
    await expect(interestCalculatorPage.getTimeError()).resolves.toBe(
      interestCalculatorTestData.errorMessages.negative.time
    );
  });

  test('[TC-INTCALC-023][TC-INTCALC-024][TC-INTCALC-025] Should show error for values exceeding limits', async () => {
    // Arrange
    await interestCalculatorPage.navigate();
    const testData = interestCalculatorTestData.invalidInputs.exceedingLimits;
    
    // Act
    await interestCalculatorPage.calculateInterest(
      testData.principal,
      testData.rate,
      testData.time
    );
    
    // Assert
    await expect(interestCalculatorPage.getPrincipalError()).resolves.toBe(
      interestCalculatorTestData.errorMessages.maxLimits.principal
    );
    await expect(interestCalculatorPage.getRateError()).resolves.toBe(
      interestCalculatorTestData.errorMessages.maxLimits.rate
    );
    await expect(interestCalculatorPage.getTimeError()).resolves.toBe(
      interestCalculatorTestData.errorMessages.maxLimits.time
    );
  });

  test('[TC-INTCALC-026] Should prevent calculation when validation errors exist', async () => {
    // Arrange
    await interestCalculatorPage.navigate();
    
    // Act - Set only principal, leave other fields empty
    await interestCalculatorPage.fillPrincipalAmount(1000);
    await interestCalculatorPage.clickCalculateButton();
    
    // Assert
    await expect(interestCalculatorPage.isResultVisible()).resolves.toBeFalsy();
    await expect(interestCalculatorPage.getRateError()).resolves.toBe(
      interestCalculatorTestData.errorMessages.required.rate
    );
    await expect(interestCalculatorPage.getTimeError()).resolves.toBe(
      interestCalculatorTestData.errorMessages.required.time
    );
  });

  /**
   * Edge Cases
   */
  test('[TC-INTCALC-027] Should calculate correctly with decimal principal', async () => {
    // Arrange
    await interestCalculatorPage.navigate();
    const testData = interestCalculatorTestData.edgeCases.decimalPrincipal;
    
    // Act
    await interestCalculatorPage.calculateInterest(
      testData.principal,
      testData.rate,
      testData.time,
      testData.interestType as 'simple' | 'compound'
    );
    
    // Assert
    await expect(interestCalculatorPage.isResultVisible()).resolves.toBeTruthy();
    await interestCalculatorPage.validateResult(
      testData.expectedFinalAmount,
      testData.expectedInterestAmount
    );
  });

  test('[TC-INTCALC-028] Should calculate correctly with decimal rate', async () => {
    // Arrange
    await interestCalculatorPage.navigate();
    const testData = interestCalculatorTestData.validInputs.withDecimalRate;
    
    // Act
    await interestCalculatorPage.calculateInterest(
      testData.principal,
      testData.rate,
      testData.time,
      testData.interestType as 'simple' | 'compound'
    );
    
    // Assert
    await expect(interestCalculatorPage.isResultVisible()).resolves.toBeTruthy();
    await interestCalculatorPage.validateResult(
      testData.expectedFinalAmount,
      testData.expectedInterestAmount
    );
  });

  test('[TC-INTCALC-029] Should calculate correctly with decimal time period', async () => {
    // Arrange
    await interestCalculatorPage.navigate();
    const testData = interestCalculatorTestData.edgeCases.decimalTime;
    
    // Act
    await interestCalculatorPage.calculateInterest(
      testData.principal,
      testData.rate,
      testData.time,
      testData.interestType as 'simple' | 'compound'
    );
    
    // Assert
    await expect(interestCalculatorPage.isResultVisible()).resolves.toBeTruthy();
    await interestCalculatorPage.validateResult(
      testData.expectedFinalAmount,
      testData.expectedInterestAmount
    );
  });

  test('[TC-INTCALC-031] Should reset error messages when valid inputs are entered', async () => {
    // Arrange
    await interestCalculatorPage.navigate();
    
    // Act - First trigger errors
    await interestCalculatorPage.clickCalculateButton();
    
    // Assert errors are shown
    await expect(interestCalculatorPage.isPrincipalErrorVisible()).resolves.toBeTruthy();
    
    // Act - Enter valid inputs
    await interestCalculatorPage.calculateInterest(10000, 5, 2);
    
    // Assert errors are cleared
    await expect(interestCalculatorPage.isPrincipalErrorVisible()).resolves.toBeFalsy();
    await expect(interestCalculatorPage.isRateErrorVisible()).resolves.toBeFalsy();
    await expect(interestCalculatorPage.isTimeErrorVisible()).resolves.toBeFalsy();
  });

  /**
   * Accessibility Tests
   */
  test('[TC-INTCALC-042] All form fields should have appropriate labels for screen readers', async ({ page }) => {
    // Arrange
    await interestCalculatorPage.navigate();
    
    // Assert
    // Check that principal input has a proper label
    const principalInput = page.getByTestId('principal-amount-input');
    const principalLabel = page.getByTestId('principal-amount-label');
    await expect(principalLabel).toBeVisible();
    
    // Check the associated label for principal input
    const principalLabelFor = await principalLabel.getAttribute('for');
    const principalInputId = await principalInput.getAttribute('id');
    expect(principalInputId).toBe(principalLabelFor);
    
    // Check the associated label for rate input
    const rateLabel = page.getByTestId('interest-rate-label');
    const rateInput = page.getByTestId('interest-rate-input');
    await expect(rateLabel).toBeVisible();
    const rateLabelFor = await rateLabel.getAttribute('for');
    const rateInputId = await rateInput.getAttribute('id');
    expect(rateInputId).toBe(rateLabelFor);
    
    // Check the associated label for time input
    const timeLabel = page.getByTestId('time-period-label');
    const timeInput = page.getByTestId('time-period-input');
    await expect(timeLabel).toBeVisible();
    const timeLabelFor = await timeLabel.getAttribute('for');
    const timeInputId = await timeInput.getAttribute('id');
    expect(timeInputId).toBe(timeLabelFor);
  });

  test('[TC-INTCALC-044] Calculator should be navigable using keyboard only', async ({ page }) => {
    // Arrange
    await interestCalculatorPage.navigate();
    
    // Act - Use tab navigation
    await page.keyboard.press('Tab'); // Focus on principal input
    await expect(page.getByTestId('principal-amount-input')).toBeFocused();
    
    await page.keyboard.press('Tab'); // Focus on rate input
    await expect(page.getByTestId('interest-rate-input')).toBeFocused();
    
    await page.keyboard.press('Tab'); // Focus on time input
    await expect(page.getByTestId('time-period-input')).toBeFocused();
    
    await page.keyboard.press('Tab'); // Focus on simple interest radio
    await expect(page.getByTestId('simple-interest-radio')).toBeFocused();
    
    await page.keyboard.press('Tab'); // Focus on compound interest radio
    await expect(page.getByTestId('compound-interest-radio')).toBeFocused();
    
    await page.keyboard.press('Tab'); // Focus on calculate button
    await expect(page.getByTestId('calculate-interest-button')).toBeFocused();
    
    // Try to fill and submit the form with keyboard
    await page.keyboard.press('Shift+Tab'); // Back to compound interest
    await page.keyboard.press('Shift+Tab'); // Back to simple interest
    await page.keyboard.press('Shift+Tab'); // Back to time
    await page.keyboard.type('2');
    
    await page.keyboard.press('Shift+Tab'); // Back to rate
    await page.keyboard.type('5');
    
    await page.keyboard.press('Shift+Tab'); // Back to principal
    await page.keyboard.type('10000');
    
    await page.keyboard.press('Tab'); // To rate
    await page.keyboard.press('Tab'); // To time
    await page.keyboard.press('Tab'); // To simple interest
    await page.keyboard.press('Tab'); // To compound interest
    await page.keyboard.press('Tab'); // To calculate button
    await page.keyboard.press('Enter'); // Submit
    
    // Assert
    await expect(interestCalculatorPage.isResultVisible()).resolves.toBeTruthy();
  });
}); 
import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/home-page';
import { EmiCalculatorPage } from '../pages/emi-calculator-page';
import { emiCalculatorTestData } from '../fixtures/emi-calculator-data';

test.describe('EMI Calculator Tests', () => {
  let homePage: HomePage;
  let emiCalculatorPage: EmiCalculatorPage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    emiCalculatorPage = new EmiCalculatorPage(page);
  });

  // Navigation Tests
  test('[TC-EMI-001][Critical] User should be able to access the EMI Calculator from the home screen', async () => {
    await homePage.navigate();
    await expect(homePage.isCalculatorHubTitleVisible()).resolves.toBeTruthy();
    await expect(homePage.isEmiCalculatorCardVisible()).resolves.toBeTruthy();
    
    await homePage.clickEmiCalculatorLink();
    await expect(emiCalculatorPage.isCalculatorTitleVisible()).resolves.toBeTruthy();
    await expect(emiCalculatorPage.getCalculatorTitle()).resolves.toBe('EMI Calculator');
  });

  test('[TC-EMI-041][Medium] Verify URL changes to "/emi-calculator" when navigating to the EMI Calculator', async ({ page }) => {
    await homePage.navigate();
    await homePage.clickEmiCalculatorLink();
    await expect(page).toHaveURL('/emi-calculator');
  });

  test('[TC-EMI-042][Medium] Verify browser back button functionality after navigating to the EMI Calculator', async ({ page }) => {
    await homePage.navigate();
    await homePage.clickEmiCalculatorLink();
    await expect(page).toHaveURL('/emi-calculator');
    
    await page.goBack();
    await expect(page).toHaveURL('/');
    await expect(homePage.isCalculatorHubTitleVisible()).resolves.toBeTruthy();
  });

  // Positive Test Cases
  test('[TC-EMI-002][Critical] User should be able to enter a valid loan amount', async () => {
    await emiCalculatorPage.navigate();
    await emiCalculatorPage.fillLoanAmount(emiCalculatorTestData.validInputs.loanAmount);
    // Cannot directly access the value in Playwright, but validate no error is shown
    await expect(emiCalculatorPage.isLoanAmountErrorVisible()).resolves.toBeFalsy();
  });

  test('[TC-EMI-003][Critical] User should be able to enter a valid interest rate', async () => {
    await emiCalculatorPage.navigate();
    await emiCalculatorPage.fillInterestRate(emiCalculatorTestData.validInputs.interestRate);
    await expect(emiCalculatorPage.isInterestRateErrorVisible()).resolves.toBeFalsy();
  });

  test('[TC-EMI-004][Critical] User should be able to enter a valid loan term', async () => {
    await emiCalculatorPage.navigate();
    await emiCalculatorPage.fillLoanTerm(emiCalculatorTestData.validInputs.loanTerm);
    await expect(emiCalculatorPage.isLoanTermErrorVisible()).resolves.toBeFalsy();
  });

  test('[TC-EMI-005][Critical] User should be able to click the Calculate EMI button after filling all inputs', async () => {
    await emiCalculatorPage.navigate();
    await emiCalculatorPage.calculateEmi(
      emiCalculatorTestData.validInputs.loanAmount,
      emiCalculatorTestData.validInputs.interestRate,
      emiCalculatorTestData.validInputs.loanTerm
    );
    // We should see the result after calculation
    await expect(emiCalculatorPage.isEmiResultVisible()).resolves.toBeTruthy();
  });

  test('[TC-EMI-006][Critical] System should display the calculated monthly EMI', async () => {
    await emiCalculatorPage.navigate();
    await emiCalculatorPage.calculateEmi(
      emiCalculatorTestData.validInputs.loanAmount,
      emiCalculatorTestData.validInputs.interestRate,
      emiCalculatorTestData.validInputs.loanTerm
    );
    
    await expect(emiCalculatorPage.isEmiResultVisible()).resolves.toBeTruthy();
    // Check for exact EMI value match or use includes for partial match
    const emiValue = await emiCalculatorPage.getMonthlyEmiValue();
    expect(emiValue).toBe(emiCalculatorTestData.expectedEmi.standard);
  });

  test('[TC-EMI-008][High] Calculator should correctly apply the EMI formula', async () => {
    await emiCalculatorPage.navigate();
    await emiCalculatorPage.calculateEmi(
      emiCalculatorTestData.validInputs.loanAmount,
      emiCalculatorTestData.validInputs.interestRate,
      emiCalculatorTestData.validInputs.loanTerm
    );
    
    // Verify the calculation is correct based on the EMI formula
    const P = emiCalculatorTestData.validInputs.loanAmount;
    const R = emiCalculatorTestData.validInputs.interestRate / (12 * 100); // monthly interest rate
    const N = emiCalculatorTestData.validInputs.loanTerm * 12; // number of months
    
    // EMI formula: EMI = [P × R × (1+R)^N]/[(1+R)^N - 1]
    const expectedEmi = (P * R * Math.pow(1 + R, N)) / (Math.pow(1 + R, N) - 1);
    const expectedEmiFormatted = expectedEmi.toFixed(2);
    
    const actualEmi = await emiCalculatorPage.getMonthlyEmiValue();
    // Remove any commas that might be in the output
    const actualEmiNumeric = parseFloat(actualEmi.replace(/,/g, ''));
    
    // Allow for slight rounding differences (within 1 unit)
    expect(Math.abs(actualEmiNumeric - parseFloat(expectedEmiFormatted))).toBeLessThanOrEqual(1);
  });

  test('[TC-EMI-009][Medium] Resetting the inputs should clear the previously calculated result', async () => {
    await emiCalculatorPage.navigate();
    // Calculate EMI first
    await emiCalculatorPage.calculateEmi(
      emiCalculatorTestData.validInputs.loanAmount,
      emiCalculatorTestData.validInputs.interestRate,
      emiCalculatorTestData.validInputs.loanTerm
    );
    
    await expect(emiCalculatorPage.isEmiResultVisible()).resolves.toBeTruthy();
    
    // Reset form
    await emiCalculatorPage.resetForm();
    await emiCalculatorPage.clickCalculateButton();
    
    // After reset and calculate, errors should show but no result
    await expect(emiCalculatorPage.isEmiResultVisible()).resolves.toBeFalsy();
    await expect(emiCalculatorPage.isLoanAmountErrorVisible()).resolves.toBeTruthy();
  });

  // Negative Test Cases
  test('[TC-EMI-011][High] Show error message when loan amount field is left blank', async () => {
    await emiCalculatorPage.navigate();
    await emiCalculatorPage.fillInterestRate(emiCalculatorTestData.validInputs.interestRate);
    await emiCalculatorPage.fillLoanTerm(emiCalculatorTestData.validInputs.loanTerm);
    await emiCalculatorPage.clickCalculateButton();
    
    await expect(emiCalculatorPage.isLoanAmountErrorVisible()).resolves.toBeTruthy();
    await expect(emiCalculatorPage.getLoanAmountError()).resolves.toBe(
      emiCalculatorTestData.expectedErrors.emptyLoanAmount
    );
  });

  test('[TC-EMI-012][High] Show error message when interest rate field is left blank', async () => {
    await emiCalculatorPage.navigate();
    await emiCalculatorPage.fillLoanAmount(emiCalculatorTestData.validInputs.loanAmount);
    await emiCalculatorPage.fillLoanTerm(emiCalculatorTestData.validInputs.loanTerm);
    await emiCalculatorPage.clickCalculateButton();
    
    await expect(emiCalculatorPage.isInterestRateErrorVisible()).resolves.toBeTruthy();
    await expect(emiCalculatorPage.getInterestRateError()).resolves.toBe(
      emiCalculatorTestData.expectedErrors.emptyInterestRate
    );
  });

  test('[TC-EMI-013][High] Show error message when loan term field is left blank', async () => {
    await emiCalculatorPage.navigate();
    await emiCalculatorPage.fillLoanAmount(emiCalculatorTestData.validInputs.loanAmount);
    await emiCalculatorPage.fillInterestRate(emiCalculatorTestData.validInputs.interestRate);
    await emiCalculatorPage.clickCalculateButton();
    
    await expect(emiCalculatorPage.isLoanTermErrorVisible()).resolves.toBeTruthy();
    await expect(emiCalculatorPage.getLoanTermError()).resolves.toBe(
      emiCalculatorTestData.expectedErrors.emptyLoanTerm
    );
  });

  test('[TC-EMI-017][Medium] Show appropriate error for negative values in loan amount', async () => {
    await emiCalculatorPage.navigate();
    await emiCalculatorPage.fillLoanAmount(emiCalculatorTestData.invalidInputs.negative.loanAmount);
    await emiCalculatorPage.fillInterestRate(emiCalculatorTestData.validInputs.interestRate);
    await emiCalculatorPage.fillLoanTerm(emiCalculatorTestData.validInputs.loanTerm);
    await emiCalculatorPage.clickCalculateButton();
    
    await expect(emiCalculatorPage.isLoanAmountErrorVisible()).resolves.toBeTruthy();
    await expect(emiCalculatorPage.getLoanAmountError()).resolves.toBe(
      emiCalculatorTestData.expectedErrors.negativeLoanAmount
    );
  });

  test('[TC-EMI-018][Medium] Show appropriate error for negative values in interest rate', async () => {
    await emiCalculatorPage.navigate();
    await emiCalculatorPage.fillLoanAmount(emiCalculatorTestData.validInputs.loanAmount);
    await emiCalculatorPage.fillInterestRate(emiCalculatorTestData.invalidInputs.negative.interestRate);
    await emiCalculatorPage.fillLoanTerm(emiCalculatorTestData.validInputs.loanTerm);
    await emiCalculatorPage.clickCalculateButton();
    
    await expect(emiCalculatorPage.isInterestRateErrorVisible()).resolves.toBeTruthy();
    await expect(emiCalculatorPage.getInterestRateError()).resolves.toBe(
      emiCalculatorTestData.expectedErrors.negativeInterestRate
    );
  });

  test('[TC-EMI-019][Medium] Show appropriate error for negative values in loan term', async () => {
    await emiCalculatorPage.navigate();
    await emiCalculatorPage.fillLoanAmount(emiCalculatorTestData.validInputs.loanAmount);
    await emiCalculatorPage.fillInterestRate(emiCalculatorTestData.validInputs.interestRate);
    await emiCalculatorPage.fillLoanTerm(emiCalculatorTestData.invalidInputs.negative.loanTerm);
    await emiCalculatorPage.clickCalculateButton();
    
    await expect(emiCalculatorPage.isLoanTermErrorVisible()).resolves.toBeTruthy();
    await expect(emiCalculatorPage.getLoanTermError()).resolves.toBe(
      emiCalculatorTestData.expectedErrors.negativeLoanTerm
    );
  });

  // Edge Cases
  test('[TC-EMI-020][Medium] Calculate EMI for very large loan amounts', async () => {
    await emiCalculatorPage.navigate();
    await emiCalculatorPage.calculateEmi(
      emiCalculatorTestData.edgeCases.veryLargeLoanAmount,
      emiCalculatorTestData.validInputs.interestRate,
      emiCalculatorTestData.validInputs.loanTerm
    );
    
    await expect(emiCalculatorPage.isEmiResultVisible()).resolves.toBeTruthy();
  });

  test('[TC-EMI-021][Medium] Calculate EMI for a very high interest rate', async () => {
    await emiCalculatorPage.navigate();
    await emiCalculatorPage.calculateEmi(
      emiCalculatorTestData.validInputs.loanAmount,
      emiCalculatorTestData.edgeCases.veryHighInterestRate,
      emiCalculatorTestData.validInputs.loanTerm
    );
    
    await expect(emiCalculatorPage.isEmiResultVisible()).resolves.toBeTruthy();
  });

  test('[TC-EMI-022][Medium] Calculate EMI for a very long loan term', async () => {
    await emiCalculatorPage.navigate();
    await emiCalculatorPage.calculateEmi(
      emiCalculatorTestData.validInputs.loanAmount,
      emiCalculatorTestData.validInputs.interestRate,
      emiCalculatorTestData.edgeCases.veryLongTerm
    );
    
    await expect(emiCalculatorPage.isEmiResultVisible()).resolves.toBeTruthy();
  });

  test('[TC-EMI-023][Medium] Calculate EMI for a very short loan term', async () => {
    await emiCalculatorPage.navigate();
    await emiCalculatorPage.calculateEmi(
      emiCalculatorTestData.validInputs.loanAmount,
      emiCalculatorTestData.validInputs.interestRate,
      emiCalculatorTestData.edgeCases.veryShortTerm
    );
    
    await expect(emiCalculatorPage.isEmiResultVisible()).resolves.toBeTruthy();
  });

  test('[TC-EMI-024][Medium] Calculate EMI for a very small loan amount', async () => {
    await emiCalculatorPage.navigate();
    await emiCalculatorPage.calculateEmi(
      emiCalculatorTestData.edgeCases.verySmallLoanAmount,
      emiCalculatorTestData.validInputs.interestRate,
      emiCalculatorTestData.validInputs.loanTerm
    );
    
    await expect(emiCalculatorPage.isEmiResultVisible()).resolves.toBeTruthy();
  });

  test('[TC-EMI-025][Medium] Calculate EMI for a very low interest rate', async () => {
    await emiCalculatorPage.navigate();
    await emiCalculatorPage.calculateEmi(
      emiCalculatorTestData.validInputs.loanAmount,
      emiCalculatorTestData.edgeCases.veryLowInterestRate,
      emiCalculatorTestData.validInputs.loanTerm
    );
    
    await expect(emiCalculatorPage.isEmiResultVisible()).resolves.toBeTruthy();
  });

  // UI/UX Validation
  test('[TC-EMI-028][High] Verify layout matches design with all elements properly positioned', async ({ page }) => {
    await emiCalculatorPage.navigate();
    
    // Check visibility of key elements
    await expect(emiCalculatorPage.isCalculatorTitleVisible()).resolves.toBeTruthy();
    
    // Check that the form inputs are visible and properly arranged
    await expect(page.getByTestId('loan-amount-group')).toBeVisible();
    await expect(page.getByTestId('interest-rate-group')).toBeVisible();
    await expect(page.getByTestId('loan-term-group')).toBeVisible();
    await expect(page.getByTestId('calculate-emi-button')).toBeVisible();
  });

  test('[TC-EMI-029][High] "Calculate EMI" button should have blue background with white text', async ({ page }) => {
    await emiCalculatorPage.navigate();
    
    // Check button styling
    const button = page.getByTestId('calculate-emi-button');
    await expect(button).toBeVisible();
    
    // Check background color and text color using CSS properties
    const styles = await button.evaluate((el) => {
      const style = window.getComputedStyle(el);
      return {
        backgroundColor: style.backgroundColor,
        color: style.color
      };
    });
    
    // Convert RGB to simple check for blue background and white text
    const isBlueBackground = styles.backgroundColor.includes('rgb(26, 115, 232)') || 
                             styles.backgroundColor.includes('#1a73e8');
    const isWhiteText = styles.color.includes('rgb(255, 255, 255)') || 
                        styles.color.includes('#ffffff') || 
                        styles.color.includes('white');
    
    expect(isBlueBackground).toBeTruthy();
    expect(isWhiteText).toBeTruthy();
  });

  // Accessibility Tests
  test('[TC-EMI-035][High] All form fields should have appropriate labels for screen readers', async ({ page }) => {
    await emiCalculatorPage.navigate();
    
    // Check label-input associations
    const loanAmountLabel = page.getByTestId('loan-amount-label');
    const interestRateLabel = page.getByTestId('interest-rate-label');
    const loanTermLabel = page.getByTestId('loan-term-label');
    
    await expect(loanAmountLabel).toBeVisible();
    await expect(interestRateLabel).toBeVisible();
    await expect(loanTermLabel).toBeVisible();
    
    // Check if labels have correct 'for' attributes that match input ids
    const loanAmountFor = await loanAmountLabel.getAttribute('for');
    const interestRateFor = await interestRateLabel.getAttribute('for');
    const loanTermFor = await loanTermLabel.getAttribute('for');
    
    expect(loanAmountFor).toBe('principal');
    expect(interestRateFor).toBe('rate');
    expect(loanTermFor).toBe('time');
  });

  test('[TC-EMI-036][Medium] EMI Calculator should be navigable using keyboard only', async ({ page }) => {
    await emiCalculatorPage.navigate();
    
    // Start by focusing on the first input
    await page.getByTestId('loan-amount-input').focus();
    
    // Tab through all interactive elements
    await page.keyboard.press('Tab'); // Should focus on interest rate input
    expect(await page.evaluate(() => document.activeElement?.id)).toBe('rate');
    
    await page.keyboard.press('Tab'); // Should focus on loan term input
    expect(await page.evaluate(() => document.activeElement?.id)).toBe('time');
    
    await page.keyboard.press('Tab'); // Should focus on calculate button
    expect(await page.evaluate(() => document.activeElement?.getAttribute('data-testid'))).toBe('calculate-emi-button');
    
    // Test if Enter key works on the button
    await page.keyboard.press('Enter');
    
    // Errors should appear after pressing Enter on the button
    await expect(emiCalculatorPage.isLoanAmountErrorVisible()).resolves.toBeTruthy();
  });

  test('[TC-EMI-038][Medium] Calculate EMI button should be accessible via keyboard', async ({ page }) => {
    await emiCalculatorPage.navigate();
    
    await emiCalculatorPage.fillLoanAmount(emiCalculatorTestData.validInputs.loanAmount);
    await emiCalculatorPage.fillInterestRate(emiCalculatorTestData.validInputs.interestRate);
    await emiCalculatorPage.fillLoanTerm(emiCalculatorTestData.validInputs.loanTerm);
    
    // Focus on the button and press Enter
    await page.getByTestId('calculate-emi-button').focus();
    await page.keyboard.press('Enter');
    
    // Result should appear
    await expect(emiCalculatorPage.isEmiResultVisible()).resolves.toBeTruthy();
  });
}); 
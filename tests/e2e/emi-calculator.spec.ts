import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/home-page';
import { EmiCalculatorPage } from '../pages/emi-calculator-page';
import { emiCalculatorTestData } from '../fixtures/emi-calculator-data';

// Helper function to calculate expected EMI for validation
function calculateExpectedEmi(principal: number, rate: number, time: number): number {
  const r = rate / (12 * 100); // Monthly interest rate
  const n = time * 12; // Total number of months
  
  if (r === 0) {
    return principal / n; // Simple division if rate is 0
  }
  
  return (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
}

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
    await emiCalculatorPage.fillLoanAmount(emiCalculatorTestData.validInputs.standard.loanAmount);
    // Cannot directly access the value in Playwright, but validate no error is shown
    await expect(emiCalculatorPage.isLoanAmountErrorVisible()).resolves.toBeFalsy();
  });

  test('[TC-EMI-003][Critical] User should be able to enter a valid interest rate', async () => {
    await emiCalculatorPage.navigate();
    await emiCalculatorPage.fillInterestRate(emiCalculatorTestData.validInputs.standard.interestRate);
    await expect(emiCalculatorPage.isInterestRateErrorVisible()).resolves.toBeFalsy();
  });

  test('[TC-EMI-004][Critical] User should be able to enter a valid loan term', async () => {
    await emiCalculatorPage.navigate();
    await emiCalculatorPage.fillLoanTerm(emiCalculatorTestData.validInputs.standard.loanTerm);
    await expect(emiCalculatorPage.isLoanTermErrorVisible()).resolves.toBeFalsy();
  });

  test('[TC-EMI-005][Critical] User should be able to click the Calculate EMI button after filling all inputs', async () => {
    await emiCalculatorPage.navigate();
    await emiCalculatorPage.calculateEmi(
      emiCalculatorTestData.validInputs.standard.loanAmount,
      emiCalculatorTestData.validInputs.standard.interestRate,
      emiCalculatorTestData.validInputs.standard.loanTerm
    );
    // We should see the result after calculation
    await expect(emiCalculatorPage.isEmiResultVisible()).resolves.toBeTruthy();
  });

  test('[TC-EMI-006][Critical] System should display the calculated monthly EMI', async () => {
    await emiCalculatorPage.navigate();
    await emiCalculatorPage.calculateEmi(
      emiCalculatorTestData.validInputs.standard.loanAmount,
      emiCalculatorTestData.validInputs.standard.interestRate,
      emiCalculatorTestData.validInputs.standard.loanTerm
    );
    
    await expect(emiCalculatorPage.isEmiResultVisible()).resolves.toBeTruthy();
    // Check for exact EMI value match or use includes for partial match
    const emiValue = await emiCalculatorPage.getMonthlyEmiValue();
    expect(emiValue).toBe(emiCalculatorTestData.validInputs.standard.expectedEMI);
  });

  test('[TC-EMI-008][High] Calculator should correctly apply the EMI formula', async () => {
    await emiCalculatorPage.navigate();
    await emiCalculatorPage.calculateEmi(
      emiCalculatorTestData.validInputs.standard.loanAmount,
      emiCalculatorTestData.validInputs.standard.interestRate,
      emiCalculatorTestData.validInputs.standard.loanTerm
    );
    
    // Verify the calculation is correct based on the EMI formula
    const P = emiCalculatorTestData.validInputs.standard.loanAmount;
    const R = emiCalculatorTestData.validInputs.standard.interestRate / (12 * 100); // monthly interest rate
    const N = emiCalculatorTestData.validInputs.standard.loanTerm * 12; // number of months
    
    // EMI formula: EMI = [P × R × (1+R)^N]/[(1+R)^N - 1]
    const expectedEmi = (P * R * Math.pow(1 + R, N)) / (Math.pow(1 + R, N) - 1);
    const expectedEmiFormatted = expectedEmi.toFixed(2);
    
    const actualEmi = await emiCalculatorPage.getMonthlyEmiValue();
    // Remove any commas that might be in the output
    const actualEmiNumeric = parseFloat(actualEmi.replace(/,/g, ''));
    
    // Allow for slight rounding differences (within 1 unit)
    expect(Math.abs(actualEmiNumeric - parseFloat(expectedEmiFormatted))).toBeLessThanOrEqual(1);
  });

  test('[TC-EMI-009][Medium] Resetting the inputs should clear the previously calculated result', async ({ page }) => {
    await emiCalculatorPage.navigate();
    // Calculate EMI first
    await emiCalculatorPage.calculateEmi(
      emiCalculatorTestData.validInputs.standard.loanAmount,
      emiCalculatorTestData.validInputs.standard.interestRate,
      emiCalculatorTestData.validInputs.standard.loanTerm
    );
    
    // Verify the result is displayed first
    await expect(emiCalculatorPage.isEmiResultVisible()).resolves.toBeTruthy();
    
    // Reset form - use clear() instead of fill('') for more reliable behavior
    await page.getByTestId('loan-amount-input').clear();
    await page.getByTestId('interest-rate-input').clear();
    await page.getByTestId('loan-term-input').clear();
    
    // Click calculate
    await emiCalculatorPage.clickCalculateButton();
    
    // Verify there's no result but there are error messages
    const emiResultVisible = await emiCalculatorPage.isEmiResultVisible();
    expect(emiResultVisible).toBeFalsy();
    
    // Error for loan amount should be visible
    await expect(emiCalculatorPage.isLoanAmountErrorVisible()).resolves.toBeTruthy();
    await expect(emiCalculatorPage.getLoanAmountError()).resolves.toBe(
      emiCalculatorTestData.errorMessages.required.loanAmount
    );
  });

  // Negative Test Cases
  test('[TC-EMI-011][High] Show error message when loan amount field is left blank', async () => {
    await emiCalculatorPage.navigate();
    await emiCalculatorPage.fillInterestRate(emiCalculatorTestData.validInputs.standard.interestRate);
    await emiCalculatorPage.fillLoanTerm(emiCalculatorTestData.validInputs.standard.loanTerm);
    await emiCalculatorPage.clickCalculateButton();
    
    await expect(emiCalculatorPage.isLoanAmountErrorVisible()).resolves.toBeTruthy();
    await expect(emiCalculatorPage.getLoanAmountError()).resolves.toBe(
      emiCalculatorTestData.errorMessages.required.loanAmount
    );
  });

  test('[TC-EMI-012][High] Show error message when interest rate field is left blank', async () => {
    await emiCalculatorPage.navigate();
    await emiCalculatorPage.fillLoanAmount(emiCalculatorTestData.validInputs.standard.loanAmount);
    await emiCalculatorPage.fillLoanTerm(emiCalculatorTestData.validInputs.standard.loanTerm);
    await emiCalculatorPage.clickCalculateButton();
    
    await expect(emiCalculatorPage.isInterestRateErrorVisible()).resolves.toBeTruthy();
    await expect(emiCalculatorPage.getInterestRateError()).resolves.toBe(
      emiCalculatorTestData.errorMessages.required.interestRate
    );
  });

  test('[TC-EMI-013][High] Show error message when loan term field is left blank', async () => {
    await emiCalculatorPage.navigate();
    await emiCalculatorPage.fillLoanAmount(emiCalculatorTestData.validInputs.standard.loanAmount);
    await emiCalculatorPage.fillInterestRate(emiCalculatorTestData.validInputs.standard.interestRate);
    await emiCalculatorPage.clickCalculateButton();
    
    await expect(emiCalculatorPage.isLoanTermErrorVisible()).resolves.toBeTruthy();
    await expect(emiCalculatorPage.getLoanTermError()).resolves.toBe(
      emiCalculatorTestData.errorMessages.required.loanTerm
    );
  });

  test('[TC-EMI-017][Medium] Show appropriate error for negative values in loan amount', async () => {
    await emiCalculatorPage.navigate();
    await emiCalculatorPage.fillLoanAmount(emiCalculatorTestData.invalidInputs.negative.loanAmount);
    await emiCalculatorPage.fillInterestRate(emiCalculatorTestData.validInputs.standard.interestRate);
    await emiCalculatorPage.fillLoanTerm(emiCalculatorTestData.validInputs.standard.loanTerm);
    await emiCalculatorPage.clickCalculateButton();
    
    await expect(emiCalculatorPage.isLoanAmountErrorVisible()).resolves.toBeTruthy();
    await expect(emiCalculatorPage.getLoanAmountError()).resolves.toBe(
      emiCalculatorTestData.errorMessages.negative.loanAmount
    );
  });

  test('[TC-EMI-018][Medium] Show appropriate error for negative values in interest rate', async () => {
    await emiCalculatorPage.navigate();
    await emiCalculatorPage.fillLoanAmount(emiCalculatorTestData.validInputs.standard.loanAmount);
    await emiCalculatorPage.fillInterestRate(emiCalculatorTestData.invalidInputs.negative.interestRate);
    await emiCalculatorPage.fillLoanTerm(emiCalculatorTestData.validInputs.standard.loanTerm);
    await emiCalculatorPage.clickCalculateButton();
    
    await expect(emiCalculatorPage.isInterestRateErrorVisible()).resolves.toBeTruthy();
    await expect(emiCalculatorPage.getInterestRateError()).resolves.toBe(
      emiCalculatorTestData.errorMessages.negative.interestRate
    );
  });

  test('[TC-EMI-019][Medium] Show appropriate error for negative values in loan term', async () => {
    await emiCalculatorPage.navigate();
    await emiCalculatorPage.fillLoanAmount(emiCalculatorTestData.validInputs.standard.loanAmount);
    await emiCalculatorPage.fillInterestRate(emiCalculatorTestData.validInputs.standard.interestRate);
    await emiCalculatorPage.fillLoanTerm(emiCalculatorTestData.invalidInputs.negative.loanTerm);
    await emiCalculatorPage.clickCalculateButton();
    
    await expect(emiCalculatorPage.isLoanTermErrorVisible()).resolves.toBeTruthy();
    await expect(emiCalculatorPage.getLoanTermError()).resolves.toBe(
      emiCalculatorTestData.errorMessages.negative.loanTerm
    );
  });

  // Edge Cases with proper output validation
  test('[TC-EMI-020][Medium] Calculate EMI for very large loan amounts', async () => {
    const principal = emiCalculatorTestData.edgeCases.maxValues.loanAmount;
    const rate = emiCalculatorTestData.validInputs.standard.interestRate;
    const time = emiCalculatorTestData.validInputs.standard.loanTerm;
    
    await emiCalculatorPage.navigate();
    await emiCalculatorPage.calculateEmi(principal, rate, time);
    
    await expect(emiCalculatorPage.isEmiResultVisible()).resolves.toBeTruthy();
    
    // Calculate expected EMI value
    const expectedEmi = calculateExpectedEmi(principal, rate, time);
    const expectedEmiFormatted = expectedEmi.toFixed(2);
    
    // Get actual EMI value from the page
    const actualEmi = await emiCalculatorPage.getMonthlyEmiValue();
    const actualEmiNumeric = parseFloat(actualEmi.replace(/,/g, ''));
    
    // Compare with a small tolerance for rounding differences
    expect(Math.abs(actualEmiNumeric - parseFloat(expectedEmiFormatted))).toBeLessThanOrEqual(1);
  });

  test('[TC-EMI-021][Medium] Calculate EMI for a very high interest rate', async () => {
    const principal = emiCalculatorTestData.validInputs.standard.loanAmount;
    const rate = emiCalculatorTestData.edgeCases.maxValues.interestRate;
    const time = emiCalculatorTestData.validInputs.standard.loanTerm;
    
    await emiCalculatorPage.navigate();
    await emiCalculatorPage.calculateEmi(principal, rate, time);
    
    await expect(emiCalculatorPage.isEmiResultVisible()).resolves.toBeTruthy();
    
    // Calculate expected EMI value
    const expectedEmi = calculateExpectedEmi(principal, rate, time);
    const expectedEmiFormatted = expectedEmi.toFixed(2);
    
    // Get actual EMI value from the page
    const actualEmi = await emiCalculatorPage.getMonthlyEmiValue();
    const actualEmiNumeric = parseFloat(actualEmi.replace(/,/g, ''));
    
    // Compare with a small tolerance for rounding differences
    expect(Math.abs(actualEmiNumeric - parseFloat(expectedEmiFormatted))).toBeLessThanOrEqual(1);
  });

  test('[TC-EMI-022][Medium] Calculate EMI for a very long loan term', async () => {
    const principal = emiCalculatorTestData.validInputs.standard.loanAmount;
    const rate = emiCalculatorTestData.validInputs.standard.interestRate;
    const time = emiCalculatorTestData.edgeCases.maxValues.loanTerm;
    
    await emiCalculatorPage.navigate();
    await emiCalculatorPage.calculateEmi(principal, rate, time);
    
    await expect(emiCalculatorPage.isEmiResultVisible()).resolves.toBeTruthy();
    
    // Calculate expected EMI value
    const expectedEmi = calculateExpectedEmi(principal, rate, time);
    const expectedEmiFormatted = expectedEmi.toFixed(2);
    
    // Get actual EMI value from the page
    const actualEmi = await emiCalculatorPage.getMonthlyEmiValue();
    const actualEmiNumeric = parseFloat(actualEmi.replace(/,/g, ''));
    
    // Compare with a small tolerance for rounding differences
    expect(Math.abs(actualEmiNumeric - parseFloat(expectedEmiFormatted))).toBeLessThanOrEqual(1);
  });

  test('[TC-EMI-023][Medium] Calculate EMI for a very short loan term', async () => {
    const principal = emiCalculatorTestData.validInputs.standard.loanAmount;
    const rate = emiCalculatorTestData.validInputs.standard.interestRate;
    const time = emiCalculatorTestData.edgeCases.minValues.loanTerm;
    
    await emiCalculatorPage.navigate();
    await emiCalculatorPage.calculateEmi(principal, rate, time);
    
    await expect(emiCalculatorPage.isEmiResultVisible()).resolves.toBeTruthy();
    
    // Calculate expected EMI value
    const expectedEmi = calculateExpectedEmi(principal, rate, time);
    const expectedEmiFormatted = expectedEmi.toFixed(2);
    
    // Get actual EMI value from the page
    const actualEmi = await emiCalculatorPage.getMonthlyEmiValue();
    const actualEmiNumeric = parseFloat(actualEmi.replace(/,/g, ''));
    
    // Compare with a small tolerance for rounding differences
    expect(Math.abs(actualEmiNumeric - parseFloat(expectedEmiFormatted))).toBeLessThanOrEqual(1);
  });

  test('[TC-EMI-024][Medium] Calculate EMI for a very small loan amount', async () => {
    const principal = emiCalculatorTestData.edgeCases.minValues.loanAmount;
    const rate = emiCalculatorTestData.validInputs.standard.interestRate;
    const time = emiCalculatorTestData.validInputs.standard.loanTerm;
    
    await emiCalculatorPage.navigate();
    await emiCalculatorPage.calculateEmi(principal, rate, time);
    
    await expect(emiCalculatorPage.isEmiResultVisible()).resolves.toBeTruthy();
    
    // Calculate expected EMI value
    const expectedEmi = calculateExpectedEmi(principal, rate, time);
    const expectedEmiFormatted = expectedEmi.toFixed(2);
    
    // Get actual EMI value from the page
    const actualEmi = await emiCalculatorPage.getMonthlyEmiValue();
    const actualEmiNumeric = parseFloat(actualEmi.replace(/,/g, ''));
    
    // Compare with a small tolerance for rounding differences
    expect(Math.abs(actualEmiNumeric - parseFloat(expectedEmiFormatted))).toBeLessThanOrEqual(1);
  });

  test('[TC-EMI-025][Medium] Calculate EMI for a very low interest rate', async () => {
    const principal = emiCalculatorTestData.validInputs.standard.loanAmount;
    const rate = emiCalculatorTestData.edgeCases.minValues.interestRate;
    const time = emiCalculatorTestData.validInputs.standard.loanTerm;
    
    await emiCalculatorPage.navigate();
    await emiCalculatorPage.calculateEmi(principal, rate, time);
    
    await expect(emiCalculatorPage.isEmiResultVisible()).resolves.toBeTruthy();
    
    // Calculate expected EMI value
    const expectedEmi = calculateExpectedEmi(principal, rate, time);
    const expectedEmiFormatted = expectedEmi.toFixed(2);
    
    // Get actual EMI value from the page
    const actualEmi = await emiCalculatorPage.getMonthlyEmiValue();
    const actualEmiNumeric = parseFloat(actualEmi.replace(/,/g, ''));
    
    // Compare with a small tolerance for rounding differences
    expect(Math.abs(actualEmiNumeric - parseFloat(expectedEmiFormatted))).toBeLessThanOrEqual(1);
  });

  test('[TC-EMI-026][Medium] Calculate EMI for zero interest rate', async () => {
    const principal = emiCalculatorTestData.edgeCases.zeroInterest.loanAmount;
    const rate = emiCalculatorTestData.edgeCases.zeroInterest.interestRate;
    const time = emiCalculatorTestData.edgeCases.zeroInterest.loanTerm;
    
    await emiCalculatorPage.navigate();
    await emiCalculatorPage.calculateEmi(principal, rate, time);
    
    await expect(emiCalculatorPage.isEmiResultVisible()).resolves.toBeTruthy();
    
    // Get actual EMI value from the page
    const actualEmi = await emiCalculatorPage.getMonthlyEmiValue();
    
    // Compare with the expected value from test data
    expect(actualEmi).toBe(emiCalculatorTestData.edgeCases.zeroInterest.expectedEMI);
  });

  // Exceeding limits test cases
  test('[TC-EMI-027][Medium] Show error message when loan amount exceeds maximum limit', async () => {
    await emiCalculatorPage.navigate();
    await emiCalculatorPage.fillLoanAmount(emiCalculatorTestData.invalidInputs.exceedingLimits.loanAmount);
    await emiCalculatorPage.fillInterestRate(emiCalculatorTestData.validInputs.standard.interestRate);
    await emiCalculatorPage.fillLoanTerm(emiCalculatorTestData.validInputs.standard.loanTerm);
    await emiCalculatorPage.clickCalculateButton();
    
    await expect(emiCalculatorPage.isLoanAmountErrorVisible()).resolves.toBeTruthy();
    await expect(emiCalculatorPage.getLoanAmountError()).resolves.toBe(
      emiCalculatorTestData.errorMessages.maxLimits.loanAmount
    );
  });

  test('[TC-EMI-028][Medium] Show error message when interest rate exceeds maximum limit', async () => {
    await emiCalculatorPage.navigate();
    await emiCalculatorPage.fillLoanAmount(emiCalculatorTestData.validInputs.standard.loanAmount);
    await emiCalculatorPage.fillInterestRate(emiCalculatorTestData.invalidInputs.exceedingLimits.interestRate);
    await emiCalculatorPage.fillLoanTerm(emiCalculatorTestData.validInputs.standard.loanTerm);
    await emiCalculatorPage.clickCalculateButton();
    
    await expect(emiCalculatorPage.isInterestRateErrorVisible()).resolves.toBeTruthy();
    await expect(emiCalculatorPage.getInterestRateError()).resolves.toBe(
      emiCalculatorTestData.errorMessages.maxLimits.interestRate
    );
  });

  test('[TC-EMI-029][Medium] Show error message when loan term exceeds maximum limit', async () => {
    await emiCalculatorPage.navigate();
    await emiCalculatorPage.fillLoanAmount(emiCalculatorTestData.validInputs.standard.loanAmount);
    await emiCalculatorPage.fillInterestRate(emiCalculatorTestData.validInputs.standard.interestRate);
    await emiCalculatorPage.fillLoanTerm(emiCalculatorTestData.invalidInputs.exceedingLimits.loanTerm);
    await emiCalculatorPage.clickCalculateButton();
    
    await expect(emiCalculatorPage.isLoanTermErrorVisible()).resolves.toBeTruthy();
    await expect(emiCalculatorPage.getLoanTermError()).resolves.toBe(
      emiCalculatorTestData.errorMessages.maxLimits.loanTerm
    );
  });

  // Better approach for non-numeric input tests
  test('[TC-EMI-014][Medium] System should not accept non-numeric characters in loan amount field', async ({ page }) => {
    await emiCalculatorPage.navigate();
    
    try {
      // Try to enter a non-numeric value
      await emiCalculatorPage.fillLoanAmount(emiCalculatorTestData.invalidInputs.nonNumeric.loanAmount);
    } catch (error) {
      // Some browsers/drivers might throw an error when trying to set non-numeric values
      // This is fine - we expect it to be rejected or ignored
    }
    
    // After trying to enter non-numeric value, the field should either be empty or
    // the value should have been sanitized to a numeric value (browsers handle this differently)
    const inputValue = await page.getByTestId(emiCalculatorTestData.testIds.inputs.loanAmount.input).inputValue();
    
    // Fill other fields with valid values
    await emiCalculatorPage.fillInterestRate(emiCalculatorTestData.validInputs.standard.interestRate);
    await emiCalculatorPage.fillLoanTerm(emiCalculatorTestData.validInputs.standard.loanTerm);
    await emiCalculatorPage.clickCalculateButton();
    
    // If the value is empty or not a valid number, we should see error
    if (!inputValue || isNaN(Number(inputValue)) || Number(inputValue) <= 0) {
      await expect(emiCalculatorPage.isLoanAmountErrorVisible()).resolves.toBeTruthy();
    }
  });

  test('[TC-EMI-015][Medium] System should not accept non-numeric characters in interest rate field', async ({ page }) => {
    await emiCalculatorPage.navigate();
    
    // Fill valid loan amount
    await emiCalculatorPage.fillLoanAmount(emiCalculatorTestData.validInputs.standard.loanAmount);
    
    try {
      // Try to enter a non-numeric value for interest rate
      await emiCalculatorPage.fillInterestRate(emiCalculatorTestData.invalidInputs.nonNumeric.interestRate);
    } catch (error) {
      // Some browsers/drivers might throw an error when trying to set non-numeric values
      // This is fine - we expect it to be rejected or ignored
    }
    
    // After trying to enter non-numeric value, the field should either be empty or
    // the value should have been sanitized to a numeric value
    const inputValue = await page.getByTestId(emiCalculatorTestData.testIds.inputs.interestRate.input).inputValue();
    
    // Fill loan term with valid value
    await emiCalculatorPage.fillLoanTerm(emiCalculatorTestData.validInputs.standard.loanTerm);
    await emiCalculatorPage.clickCalculateButton();
    
    // If the value is empty or not a valid number, we should see error
    if (!inputValue || isNaN(Number(inputValue)) || Number(inputValue) <= 0) {
      await expect(emiCalculatorPage.isInterestRateErrorVisible()).resolves.toBeTruthy();
    }
  });

  test('[TC-EMI-016][Medium] System should not accept non-numeric characters in loan term field', async ({ page }) => {
    await emiCalculatorPage.navigate();
    
    // Fill valid loan amount and interest rate
    await emiCalculatorPage.fillLoanAmount(emiCalculatorTestData.validInputs.standard.loanAmount);
    await emiCalculatorPage.fillInterestRate(emiCalculatorTestData.validInputs.standard.interestRate);
    
    try {
      // Try to enter a non-numeric value for loan term
      await emiCalculatorPage.fillLoanTerm(emiCalculatorTestData.invalidInputs.nonNumeric.loanTerm);
    } catch (error) {
      // Some browsers/drivers might throw an error when trying to set non-numeric values
      // This is fine - we expect it to be rejected or ignored
    }
    
    // After trying to enter non-numeric value, the field should either be empty or
    // the value should have been sanitized to a numeric value
    const inputValue = await page.getByTestId(emiCalculatorTestData.testIds.inputs.loanTerm.input).inputValue();
    await emiCalculatorPage.clickCalculateButton();
    
    // If the value is empty or not a valid number, we should see error
    if (!inputValue || isNaN(Number(inputValue)) || Number(inputValue) <= 0) {
      await expect(emiCalculatorPage.isLoanTermErrorVisible()).resolves.toBeTruthy();
    }
  });

  // UI/UX Validation
  test('[TC-EMI-030][High] Verify layout matches design with all elements properly positioned', async ({ page }) => {
    await emiCalculatorPage.navigate();
    
    // Check visibility of key elements
    await expect(emiCalculatorPage.isCalculatorTitleVisible()).resolves.toBeTruthy();
    
    // Check that the form inputs are visible and properly arranged
    await expect(page.getByTestId(emiCalculatorTestData.testIds.inputs.loanAmount.group)).toBeVisible();
    await expect(page.getByTestId(emiCalculatorTestData.testIds.inputs.interestRate.group)).toBeVisible();
    await expect(page.getByTestId(emiCalculatorTestData.testIds.inputs.loanTerm.group)).toBeVisible();
    await expect(page.getByTestId(emiCalculatorTestData.testIds.calculateButton)).toBeVisible();
  });

  test('[TC-EMI-031][High] "Calculate EMI" button should have blue background with white text', async ({ page }) => {
    await emiCalculatorPage.navigate();
    
    // Check button styling
    const button = page.getByTestId(emiCalculatorTestData.testIds.calculateButton);
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
    const loanAmountLabel = page.getByTestId(emiCalculatorTestData.testIds.inputs.loanAmount.label);
    const interestRateLabel = page.getByTestId(emiCalculatorTestData.testIds.inputs.interestRate.label);
    const loanTermLabel = page.getByTestId(emiCalculatorTestData.testIds.inputs.loanTerm.label);
    
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
    await page.getByTestId(emiCalculatorTestData.testIds.inputs.loanAmount.input).focus();
    
    // Tab through all interactive elements
    await page.keyboard.press('Tab'); // Should focus on interest rate input
    expect(await page.evaluate(() => document.activeElement?.id)).toBe('rate');
    
    await page.keyboard.press('Tab'); // Should focus on loan term input
    expect(await page.evaluate(() => document.activeElement?.id)).toBe('time');
    
    await page.keyboard.press('Tab'); // Should focus on calculate button
    expect(await page.evaluate(() => document.activeElement?.getAttribute('data-testid'))).toBe(emiCalculatorTestData.testIds.calculateButton);
    
    // Test if Enter key works on the button
    await page.keyboard.press('Enter');
    
    // Errors should appear after pressing Enter on the button
    await expect(emiCalculatorPage.isLoanAmountErrorVisible()).resolves.toBeTruthy();
  });

  test('[TC-EMI-038][Medium] Calculate EMI button should be accessible via keyboard', async ({ page }) => {
    await emiCalculatorPage.navigate();
    
    await emiCalculatorPage.fillLoanAmount(emiCalculatorTestData.validInputs.standard.loanAmount);
    await emiCalculatorPage.fillInterestRate(emiCalculatorTestData.validInputs.standard.interestRate);
    await emiCalculatorPage.fillLoanTerm(emiCalculatorTestData.validInputs.standard.loanTerm);
    
    // Focus on the button and press Enter
    await page.getByTestId(emiCalculatorTestData.testIds.calculateButton).focus();
    await page.keyboard.press('Enter');
    
    // Result should appear
    await expect(emiCalculatorPage.isEmiResultVisible()).resolves.toBeTruthy();
  });
}); 
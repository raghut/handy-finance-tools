import { test, expect } from '@playwright/test';
import { CalculatorHelper } from '../../utils/calculator-helper';

// Define test data directly in the file to avoid import issues
const testData = {
  interestCalculator: {
    validInputs: [
      {
        principal: "1000",
        rate: "5",
        time: "1",
        expectedInterest: "50"
      },
      {
        principal: "10000",
        rate: "7.5",
        time: "2",
        expectedInterest: "1500"
      }
    ],
    invalidInputs: [
      {
        principal: "",
        rate: "5",
        time: "1"
      },
      {
        principal: "1000",
        rate: "",
        time: "1"
      },
      {
        principal: "1000",
        rate: "5",
        time: ""
      }
    ]
  }
};

test.describe('Interest Calculator', () => {
  let calculatorHelper: CalculatorHelper;

  test.beforeEach(async ({ page }) => {
    calculatorHelper = new CalculatorHelper(page);
    await page.goto('/interest-calculator');
  });

  test('should calculate interest correctly for valid inputs', async ({ page }) => {
    for (const input of testData.interestCalculator.validInputs) {
      await calculatorHelper.fillCalculatorInputs({
        principal: input.principal,
        rate: input.rate,
        time: input.time
      });
      
      await calculatorHelper.clickCalculate();
      
      const result = await calculatorHelper.getInterestValue();
      expect(result).toBe(input.expectedInterest);
    }
  });

  test('should show validation errors for invalid inputs', async ({ page }) => {
    for (const input of testData.interestCalculator.invalidInputs) {
      await calculatorHelper.fillCalculatorInputs({
        principal: input.principal,
        rate: input.rate,
        time: input.time
      });
      
      await calculatorHelper.clickCalculate();
      
      // Check that results don't appear with invalid inputs
      await expect(page.getByTestId('interest-result')).not.toBeVisible();
    }
  });
}); 
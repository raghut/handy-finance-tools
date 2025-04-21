import { Page } from '@playwright/test';

/**
 * Calculate EMI manually using the formula for verification
 * @param principal - Loan amount (principal)
 * @param rate - Annual interest rate (in percent)
 * @param time - Loan duration (in years)
 * @returns Expected monthly EMI
 */
export function calculateExpectedEmi(principal: number, rate: number, time: number): number {
  const r = rate / (12 * 100); // monthly interest rate
  const n = time * 12; // number of months
  
  if (r === 0) {
    return principal / n; // Simple division if rate is 0
  }
  
  return (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
}

/**
 * Format a number as Indian currency (with commas)
 * @param amount - Amount to format
 * @returns Formatted amount string with commas
 */
export function formatIndianCurrency(amount: number): string {
  return amount.toLocaleString('en-IN', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2
  });
}

/**
 * Check if an element has a specific CSS property value
 * @param page - Playwright page
 * @param selector - Element selector
 * @param property - CSS property to check
 * @param expectedValue - Expected value (partial match)
 */
export async function hasCssPropertyValue(
  page: Page,
  selector: string,
  property: string,
  expectedValue: string
): Promise<boolean> {
  return page.evaluate(
    ({ selector, property, expectedValue }) => {
      const element = document.querySelector(selector);
      if (!element) return false;
      
      const styles = window.getComputedStyle(element);
      const value = styles.getPropertyValue(property);
      return value.includes(expectedValue);
    },
    { selector, property, expectedValue }
  );
}

/**
 * Check if an element exists in the DOM
 * @param page - Playwright page
 * @param selector - Element selector
 */
export async function elementExists(page: Page, selector: string): Promise<boolean> {
  return page.evaluate((selector) => !!document.querySelector(selector), selector);
} 
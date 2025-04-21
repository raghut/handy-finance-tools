# Playwright Automation Test Generation Guidelines

## 🔖 Purpose
Use this document as a **standard guide for AI tools to generate Playwright automation tests** from manual test case sentences, HTML structure, and source code.

These automation tests are designed to:
- Provide **reliable, maintainable test automation** using Page Object Model
- Follow **best practices** for Playwright test implementation
- Ensure **consistent patterns** and accessibility across the test suite
- Serve as a **single source of truth** for Playwright test development

---

## ✅ Inputs Required for Generating Automation Tests

When prompting AI to generate automation tests, always provide:

1. **Manual Test Case Sentences** – Previously generated test cases in sentence format
2. **HTML Content** – HTML structure of the page from browser dev tools
3. **Source Code** – Implementation code for the component/page being tested
4. **PRD** – (Optional) For additional context on requirements
5. **UI Screenshots** – (Optional) For visual context

---

## 🔄 Page Object Model Structure

### Core Principles
- Each page/component should have its own Page Object class
- Page Objects should encapsulate all page interactions
- Methods should represent user actions
- Selectors should be maintained in one place
- Keep page-specific assertions within the Page Object
- Use meaningful method names that represent business actions

### Basic Page Object Template
```typescript
export class BasePage {
  constructor(protected page: Page) {}

  // Common methods used across all pages
  async waitForPageLoad() {
    await this.page.waitForLoadState('networkidle');
  }

  async getPageTitle() {
    return this.page.title();
  }
}

export class LoginPage extends BasePage {
  // Selectors as private readonly properties
  private readonly emailInput = this.page.getByLabel('Email');
  private readonly passwordInput = this.page.getByLabel('Password');
  private readonly loginButton = this.page.getByRole('button', { name: 'Login' });
  private readonly errorMessage = this.page.getByRole('alert');

  constructor(page: Page) {
    super(page);
  }

  // Navigation
  async navigate() {
    await this.page.goto('/login');
    await this.waitForPageLoad();
  }

  // Actions
  async login(email: string, password: string) {
    await this.fillEmail(email);
    await this.fillPassword(password);
    await this.clickLoginButton();
  }

  async fillEmail(email: string) {
    await this.emailInput.fill(email);
  }

  async fillPassword(password: string) {
    await this.passwordInput.fill(password);
  }

  async clickLoginButton() {
    await this.loginButton.click();
  }

  // State
  async getErrorMessage() {
    return this.errorMessage.textContent();
  }

  async isErrorVisible() {
    return this.errorMessage.isVisible();
  }
}
```

### Test Implementation Using Page Object
```typescript
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login-page';

test.describe('Login Page', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.navigate();
  });

  test('[TC-LOGIN-001] should allow login with valid credentials', async ({ page }) => {
    await loginPage.login('valid@example.com', 'validPassword123');
    await expect(page).toHaveURL('/dashboard');
  });

  test('[TC-LOGIN-004] should show error for empty email', async () => {
    await loginPage.fillPassword('password123');
    await loginPage.clickLoginButton();
    await expect(await loginPage.isErrorVisible()).toBeTruthy();
    await expect(await loginPage.getErrorMessage()).toBe('Email is required');
  });
});
```

---

## 📁 Project Structure

```
tests/
├── pages/                  # Page Objects
│   ├── base-page.ts       # Base page with common functionality
│   ├── login-page.ts      # Login page object
│   └── dashboard-page.ts  # Dashboard page object
├── e2e/                   # End-to-end tests
│   ├── auth.spec.ts      # Authentication tests
│   └── dashboard.spec.ts # Dashboard tests
├── fixtures/              # Test data and fixtures
│   └── test-data.json    # Test data
└── utils/                # Helper utilities
    └── test-helpers.ts   # Common test helpers
```

---

## 🔄 Prompt to Use with AI
```
Based on the provided manual test cases, HTML structure, and source code, generate Playwright automation tests for <Page/Component Name>.

Each test should:
- Follow the Page Object Model pattern
- Use semantic locators (prioritize getByRole, getByLabel, etc.)
- Include appropriate assertions
- Handle async operations correctly
- Be isolated and independent
- Support accessibility testing through locator choices

Generate code in TypeScript following best practices outlined in our guidelines.
```

---

## 1. Test Structure and Organization

- **Folder Convention**:
  - Store tests under `tests/` folder
  - Page Objects under `tests/pages/`
  - Utilities under `tests/utils/`
- **File Naming**: Use meaningful names for test files (e.g., `login-page.spec.ts`)
- **Grouping**: Group related tests with `test.describe` blocks
- **Setup/Teardown**: Use `test.beforeEach()` and `test.afterEach()`
- **Test Isolation**: Each test should be independent and self-contained

**Example Structure**:
```
tests/
├── pages/
│   ├── login-page.ts
│   └── dashboard-page.ts
├── e2e/
│   ├── authentication.spec.ts
│   └── dashboard.spec.ts
└── utils/
    └── test-helpers.ts
```

---

## 2. Locator Strategy (in order of preference)

1. `page.getByRole()` – Preferred for best accessibility and resilience
2. `page.getByLabel()` – For form elements with associated labels
3. `page.getByPlaceholder()` – For form fields with placeholders
4. `page.getByText()` – When matching visible text is reliable
5. `page.getByTestId()` – Use when semantic selectors aren't available

**Avoid whenever possible**:
- XPath selectors
- Complex CSS selectors based on implementation details
- Selectors relying on specific class names that may change

**Note**: Tests using `getByRole()` or `getByLabel()` will fail if ARIA attributes are missing or incorrect, naturally enforcing accessibility.

---

## 3. Page Object Pattern Implementation

```typescript
// Example Page Object (login-page.ts)
export class LoginPage {
  readonly page: Page;
  
  constructor(page: Page) {
    this.page = page;
  }
  
  // Navigating to the page
  async navigate() {
    await this.page.goto('/login');
  }
  
  // Combined action
  async login(email: string, password: string) {
    await this.fillEmail(email);
    await this.fillPassword(password);
    await this.clickLoginButton();
  }
  
  // Individual actions
  async fillEmail(email: string) {
    await this.page.getByLabel('Email').fill(email);
  }
  
  async fillPassword(password: string) {
    await this.page.getByLabel('Password').fill(password);
  }
  
  async clickLoginButton() {
    await this.page.getByRole('button', { name: 'Login' }).click();
  }
  
  // Getting state information
  async getErrorMessage() {
    return this.page.getByRole('alert').textContent();
  }
}
```

---

## 4. Test Implementation

```typescript
// Example Test File (authentication.spec.ts)
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login-page';

test.describe('Login Page', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.navigate();
  });

  test('[TC-LOGIN-001] should allow login with valid credentials', async ({ page }) => {
    await loginPage.login('valid@example.com', 'validPassword123');
    await expect(page).toHaveURL('/dashboard');
  });

  test('[TC-LOGIN-004] should show error for empty email', async () => {
    await loginPage.fillPassword('password123');
    await loginPage.clickLoginButton();
    await expect(page.getByText('Email is required')).toBeVisible();
  });
});
```

---

## 5. Assertions Best Practices

- Use web-first assertions that auto-wait for elements
- Prefer specific assertions over generic ones:
  - `toBeVisible()` for element visibility
  - `toHaveText()` for text content
  - `toBeEnabled()` / `toBeDisabled()` for button state
  - `toHaveURL()` for page navigation
  - `toHaveValue()` for form input values

**Example**:
```typescript
// Good - specific assertion with auto-waiting
await expect(page.getByRole('heading')).toHaveText('Welcome');

// Avoid - requires manual waiting and less specific
const heading = await page.textContent('h1');
expect(heading).toBe('Welcome');
```

---

## 6. Handling Asynchronous Operations

- Always `await` Playwright async methods
- Leverage auto-waiting features instead of explicit waits
- For complex conditions, use appropriate waiting mechanisms:

```typescript
// Good - Playwright's built-in auto-waiting
await page.getByRole('button').click();
await expect(page.getByText('Success')).toBeVisible();

// Avoid - arbitrary timeouts
await page.getByRole('button').click();
await page.waitForTimeout(1000); // Unreliable
```

---

## 7. Test Data Management

- Use dynamic test data generation for unique values
- Keep test data isolated between tests
- For shared fixtures, use Playwright's test fixtures:

```typescript
// Example of a test fixture
test.beforeEach(async ({ context }) => {
  // Set up authenticated state
  await context.addCookies([/* auth cookies */]);
});
```

---

## 8. Error Handling and Resilience

- Add proper error handling for expected issues
- Use retry logic for potentially flaky operations
- Include clear failure messages for debugging:

```typescript
// Adding helpful assertion messages
await expect(page.getByRole('button'), 
  'Submit button should be enabled after form is valid')
  .toBeEnabled();
```

---

## 🚫 Anti-patterns to Avoid

- Hard-coded timeouts (`await page.waitForTimeout(1000)`)
- Brittle selectors based on implementation details
- Excessive test dependencies
- Overly complex test logic
- Missing assertions
- Insufficient error handling
- Test data that conflicts between test runs

---

## 🚀 Final Tips for AI-Generated Tests

When generating tests with AI:
1. Ensure each test matches exactly one manual test case
2. Maintain traceability by including test case IDs in test names
3. Verify all selectors prioritize accessibility-friendly approaches
4. Check that tests are focused on user behavior, not implementation
5. Make sure generated code follows the provided patterns

---

## 🔹 Review Purpose
The generated automation tests should be reviewed to ensure:
- All manual test cases are properly covered
- Tests are reliable and maintainable
- Locators prioritize accessibility and resilience
- Tests follow project conventions and best practices

---

**End of Guidelines**
Version: 1.1
Last Updated: 2023-11-15 
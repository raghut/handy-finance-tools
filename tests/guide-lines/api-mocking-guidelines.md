# API Mocking Test Guidelines

## 1. Test Case Organization

- **Use descriptive, numbered test IDs**: `TC001`, `TC002`, etc.
- **Group related tests** into test suites using `test.describe()`
- **Document test dependencies** clearly

## 2. API Mocking Patterns

### 2.1 Basic API Mocking

```typescript
await page.route('**/api/endpoint*', route => {
  route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify({ data: 'response' })
  });
});
```

### 2.2 Error Handling Tests

```typescript
// Mock 4xx/5xx responses
await page.route('**/api/endpoint*', route => {
  route.fulfill({
    status: 500,
    contentType: 'application/json',
    body: JSON.stringify({ error: 'Server error' })
  });
});
```

### 2.3 Empty State Tests

```typescript
// Mock empty arrays/data
await page.route('**/api/endpoint*', route => {
  route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify({ items: [] })
  });
});
```

### 2.4 Loading State Tests

```typescript
// Add delay to test loading states
await page.route('**/api/endpoint*', async route => {
  await new Promise(resolve => setTimeout(resolve, 3000));
  route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify({ data: 'response' })
  });
});
```

### 2.5 Selective Mocking

```typescript
// Mock only specific endpoints
await page.route('**/api/endpoint*', route => {
  const url = route.request().url();
  if (url.includes('/specific-part')) {
    route.fulfill({ /* mock data */ });
  } else {
    route.continue();
  }
});
```

### 2.6 Data Dependent Testing

```typescript
// Mock different responses based on request data
await page.route('**/api/endpoint*', async route => {
  const postData = JSON.parse(route.request().postData() || '{}');
  
  if (postData.action === 'create') {
    route.fulfill({ 
      status: 201,
      body: JSON.stringify({ id: 'new-id', ...postData }) 
    });
  } else {
    route.fulfill({ 
      status: 200,
      body: JSON.stringify({ result: 'success' }) 
    });
  }
});
```

### 2.7 Response Conditioning

```typescript
// Track API calls and respond differently on subsequent calls
let callCount = 0;
await page.route('**/api/endpoint*', route => {
  callCount++;
  if (callCount === 1) {
    route.fulfill({ /* first response */ });
  } else {
    route.fulfill({ /* subsequent response */ });
  }
});
```

## 3. Test Coverage Checklist

- [ ] **Happy Path**: Test with valid, complete data
- [ ] **Empty States**: Test with empty data responses
- [ ] **Error Handling**: Test with various error conditions (400, 401, 403, 404, 500)
- [ ] **Loading States**: Test UI during delayed responses
- [ ] **Pagination**: Test with multi-page responses if applicable
- [ ] **Search/Filter**: Test API parameters for search and filtering
- [ ] **Form Submission**: Test create/update endpoints
- [ ] **Validation**: Test server-side validation responses
- [ ] **Authentication**: Test auth token handling
- [ ] **Edge Cases**: Test with boundary values and special characters

## 4. Best Practices

1. **Mock data should be realistic** - use data structures that match actual API responses
2. **Create test data factories** for generating diverse mock data
3. **Keep mocked responses separate** from test logic to improve readability
4. **Take screenshots** at critical points in tests with consistent naming
5. **Isolate tests** - avoid dependencies between tests
6. **Clean up after tests** - reset state if necessary
7. **Use meaningful test IDs** and descriptions
8. **Document expected behavior** in test comments

## 5. Example Test Structure

```typescript
test('TC001: should handle API error gracefully', async ({ page }) => {
  // ARRANGE: Mock the API error
  await page.route('**/api/endpoint*', route => {
    route.fulfill({
      status: 500,
      contentType: 'application/json',
      body: JSON.stringify({ error: 'Server error' })
    });
  });
  
  // ACT: Navigate to the page
  await page.goto('/page-under-test');
  await page.waitForLoadState('networkidle');
  
  // ASSERT: Verify error handling
  await takeScreenshot(page, 'TC001', 'error_display');
  await expect(page.locator('.error-message')).toBeVisible();
  await expect(page.locator('.retry-button')).toBeEnabled();
  
  // Verify the page remains functional
  await expect(page.locator('nav')).toBeVisible();
  await expect(page.locator('button.home')).toBeEnabled();
});
```

## 6. Screenshot Best Practices

1. **Naming convention**: `TC###_scenario_timestamp.png`
2. **Store in organized directory structure**: `playwright-report/screenshots/`
3. **Take screenshots at key verification points**:
   - Before/after API responses
   - When showing error states
   - After UI changes or interactions
4. **Include full page screenshots** when checking layouts

## 7. Creating a Screenshot Helper

```typescript
import fs from 'fs';
import path from 'path';
import { Page } from '@playwright/test';

export async function takeScreenshot(page: Page, testId: string, description: string): Promise<void> {
  const screenshotDir = path.join(process.cwd(), 'playwright-report', 'screenshots');
  
  // Create directory if it doesn't exist
  if (!fs.existsSync(screenshotDir)) {
    fs.mkdirSync(screenshotDir, { recursive: true });
  }
  
  const timestamp = new Date().toISOString().replace(/:/g, '-');
  const safeName = description.replace(/[^a-z0-9]/gi, '_').toLowerCase();
  const fileName = `${testId}_${safeName}_${timestamp}.png`;
  
  await page.screenshot({ 
    path: path.join(screenshotDir, fileName),
    fullPage: true 
  });
}
``` 
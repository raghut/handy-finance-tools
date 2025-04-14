# Test Data Generation Guidelines

## 🔖 Purpose
This document serves as a **standard guide for creating and maintaining test data** for both manual and automated testing. The guidelines ensure:
- Consistent test data structure across features
- Easy maintenance and updates
- Clear mapping to test cases
- Reusability across different test types

---

## 📁 File Structure

### Location
- All test data files should be stored in the `tests/fixtures` directory
- Each feature should have its own JSON file named `{feature-name}.test-data.json`
- Common/shared test data should be in `common.test-data.json`

### Format
```json
{
  "featureName": {
    "validInputs": [],
    "invalidInputs": [],
    "edgeCases": [],
    "expectedOutputs": {},
    "mockData": {}
  }
}
```

---

## 📝 Test Data Categories

### 1. Valid Inputs
- Representative set of valid input combinations
- Cover different ranges (small, medium, large values)
- Include expected results for validation
- Map to positive test cases

### 2. Invalid Inputs
- Common validation scenarios
- Boundary conditions
- Invalid data types
- Empty/null values
- Map to negative test cases

### 3. Edge Cases
- Extreme values
- Boundary conditions
- Special characters
- Locale-specific data
- Map to edge case test scenarios

### 4. Expected Outputs
- Expected results for calculations
- Expected UI states
- Expected error messages
- Format specifications

### 5. Mock Data
- API response mocks
- External service data
- System state data
- User session data

---

## 🔄 Data Types & Formats

### Numbers
- Use string format for precision-sensitive numbers
- Include decimal and integer variations
- Consider locale-specific formats
- Example: `"amount": "1000.50"`

### Dates
- Use ISO format (YYYY-MM-DD)
- Include timezone when relevant
- Consider different date formats
- Example: `"date": "2024-03-15"`

### Currency
- Use standard currency codes
- Include symbol and formatting info
- Consider internationalization
- Example: `"currency": {"code": "INR", "symbol": "₹"}`

### Text 
- Include multi-language support
- Consider character limits
- Include special characters
- Example: `"text": {"en": "Hello", "es": "Hola"}`

---

## 📋 Best Practices

1. **Maintainability**
   - Use clear, descriptive names
   - Group related data logically
   - Comment complex data structures
   - Version control test data

2. **Reusability**
   - Create modular data sets
   - Avoid duplicating data
   - Use references for common values
   - Create helper functions for data generation

3. **Security**
   - Never include real user data
   - Mask sensitive information
   - Use realistic but fake data
   - Follow data privacy guidelines

4. **Performance**
   - Keep data files manageable
   - Split large data sets
   - Consider load time impact
   - Optimize file size

---

## 🎯 Example Structure
```json
{
  "featureName": {
    "validInputs": [
      {
        "id": "VALID-001",
        "description": "Basic valid case",
        "input": {},
        "expectedOutput": {}
      }
    ],
    "invalidInputs": [
      {
        "id": "INVALID-001",
        "description": "Missing required field",
        "input": {},
        "expectedError": {}
      }
    ]
  }
}
```

---

## 📐 Schema Validation & Quality

### JSON Schema Definition
```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "properties": {
    "featureName": {
      "type": "object",
      "required": ["positiveCases", "negativeCases", "edgeCases", "uiUxValidation", "accessibilityTests"],
      "properties": {
        "positiveCases": {
          "type": "array",
          "items": {
            "type": "object",
            "required": ["testCaseId", "description", "input", "expectedOutput"],
            "properties": {
              "testCaseId": { 
                "type": "string",
                "pattern": "^TC-[A-Z]+-\\d{3}$"
              },
              "description": { "type": "string" },
              "input": { "type": "object" },
              "expectedOutput": { "type": "object" }
            }
          }
        }
      }
    }
  }
}
```

### Validation Process
1. Pre-commit validation using JSON schema
2. Automated testing of data structure
3. CI/CD pipeline integration
4. Regular data quality audits

---

## 🎲 Data Generation Strategies

### 1. Test Data Factory Pattern
```typescript
class TestDataFactory {
  static createPositiveCase(params: {
    feature: string,
    caseNumber: number,
    customData?: any
  }) {
    return {
      testCaseId: `TC-${feature.toUpperCase()}-${String(caseNumber).padStart(3, '0')}`,
      description: `Positive test case ${caseNumber}`,
      input: { ...customData },
      expectedOutput: {}
    };
  }
}
```

### 2. Automated Generation Tools
- Faker.js for realistic data
- JSON Schema Faker for schema-based generation
- Custom generators for specific scenarios

### 3. Data Combinations
- Use pairwise testing for input combinations
- Generate boundary value pairs
- Consider state-based combinations

### 4. Manual Data Creation
- Create data manually for critical test cases
- Useful for edge cases and specific scenarios
- Time-consuming but precise

### 5. Parameterized Data
```typescript
function generateEMITestData(params: {
  minAmount: number,
  maxAmount: number,
  count: number
}) {
  // Generate test data based on parameters
}
```

### 6. Real-World Data Anonymization
- Sanitize production data
- Remove sensitive information
- Maintain data relationships
- Tools for data masking

---

## 🚀 Performance & Scaling

### Large Dataset Handling
- Split test data into smaller files
- Lazy loading strategies
- Compression techniques

### Optimization Guidelines
- Keep individual files under 1MB
- Use data references instead of duplication
- Implement caching strategies

### Monitoring & Metrics
- Track test data load times
- Monitor file size growth
- Measure data generation performance

---

## 🔍 Review Checklist
- [ ] Data covers all test scenarios
- [ ] Follows naming conventions
- [ ] Includes documentation
- [ ] Validates against schema
- [ ] No sensitive data included
- [ ] Optimized file size
- [ ] Proper error messages
- [ ] Locale support where needed
- [ ] Schema validation implemented
- [ ] Data generation strategy documented
- [ ] Combinatorial coverage analyzed
- [ ] Performance impact assessed

## ✅ Enhanced Review Checklist
- [ ] Test case IDs are included
- [ ] Each category has at least one valid entry
- [ ] No sensitive or real data used
- [ ] Input and output structure is clear
- [ ] Matches manual test case expectations
- [ ] UI/UX and accessibility aspects covered
- [ ] Locale and edge conditions considered
- [ ] Schema validation passes
- [ ] Performance metrics within limits
- [ ] Data generation strategy documented
- [ ] Combination coverage adequate
- [ ] File size optimized

---

**End of Guidelines**
Version: 1.1
Last Updated: 2024-03-15 
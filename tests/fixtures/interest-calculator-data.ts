export const interestCalculatorTestData = {
  // Basic valid test cases
  validInputs: {
    standard: {
      principal: 10000,
      rate: 5,
      time: 2,
      interestType: 'simple',
      expectedFinalAmount: '11000.00',
      expectedInterestAmount: '1000.00'
    },
    withDecimalRate: {
      principal: 50000,
      rate: 7.5,
      time: 3,
      interestType: 'simple',
      expectedFinalAmount: '61250.00',
      expectedInterestAmount: '11250.00'
    },
    compoundInterest: {
      principal: 10000,
      rate: 5,
      time: 2,
      interestType: 'compound',
      expectedFinalAmount: '11025.00',
      expectedInterestAmount: '1025.00'
    },
    compoundWithDecimal: {
      principal: 50000,
      rate: 7.5,
      time: 3,
      interestType: 'compound',
      expectedFinalAmount: '61899.38',
      expectedInterestAmount: '11899.38'
    }
  },

  // Edge cases with boundary values
  edgeCases: {
    maxValues: {
      principal: 999999999, // Just under 1 billion limit
      rate: 100,           // Maximum allowed rate
      time: 100,           // Maximum allowed time
      interestType: 'simple'
    },
    minValues: {
      principal: 0.01,    // Very small principal
      rate: 0.1,          // Very low rate
      time: 0.1,          // Very short time
      interestType: 'simple',
      expectedFinalAmount: '0.0100',
      expectedInterestAmount: '0.0000'
    },
    decimalPrincipal: {
      principal: 1000.50,
      rate: 5,
      time: 2,
      interestType: 'simple',
      expectedFinalAmount: '1100.55',
      expectedInterestAmount: '100.05'
    },
    decimalTime: {
      principal: 10000,
      rate: 6,
      time: 2.5,
      interestType: 'simple',
      expectedFinalAmount: '11500.00',
      expectedInterestAmount: '1500.00'
    },
    largeCompoundInterest: {
      principal: 10000,
      rate: 20,
      time: 10,
      interestType: 'compound',
      expectedFinalAmount: '61917.36',
      expectedInterestAmount: '51917.36'
    }
  },

  // Invalid input scenarios
  invalidInputs: {
    negative: {
      principal: -10000,
      rate: -5,
      time: -2
    },
    exceedingLimits: {
      principal: 1000000001, // Exceeds 1 billion
      rate: 101,            // Exceeds 100%
      time: 101             // Exceeds 100 years
    },
    nonNumeric: {
      principal: 'abc',
      rate: 'xyz',
      time: 'pqr'
    },
    empty: {
      principal: '',
      rate: '',
      time: ''
    }
  },

  // Expected error messages
  errorMessages: {
    required: {
      principal: 'Principal amount is required',
      rate: 'Interest rate is required',
      time: 'Time period is required'
    },
    invalid: {
      principal: 'Please enter a valid number',
      rate: 'Please enter a valid number',
      time: 'Please enter a valid number'
    },
    negative: {
      principal: 'Principal must be greater than 0',
      rate: 'Rate must be greater than 0',
      time: 'Time must be greater than 0'
    },
    maxLimits: {
      principal: 'Principal amount is too large',
      rate: 'Rate should not exceed 100%',
      time: 'Time period is too long'
    }
  },

  // Simple and compound interest formulas for reference
  formulas: {
    simple: {
      description: 'Simple Interest formula: I = (P × R × T) / 100',
      finalAmount: 'P + (P × R × T) / 100'
    },
    compound: {
      description: 'Compound Interest formula: I = P × ((1 + R/100)^T - 1)',
      finalAmount: 'P × (1 + R/100)^T'
    }
  },

  // UI Test IDs for accessibility and testing
  testIds: {
    container: 'interest-calculator-container',
    title: 'interest-calculator-title',
    form: 'interest-calculator-form',
    inputs: {
      principal: {
        group: 'principal-amount-group',
        input: 'principal-amount-input',
        label: 'principal-amount-label',
        error: 'principal-error'
      },
      rate: {
        group: 'interest-rate-group',
        input: 'interest-rate-input',
        label: 'interest-rate-label',
        error: 'rate-error'
      },
      time: {
        group: 'time-period-group',
        input: 'time-period-input',
        label: 'time-period-label',
        error: 'time-error'
      },
      interestType: {
        group: 'interest-type-group',
        label: 'interest-type-label',
        options: 'interest-type-options',
        simpleInterest: {
          option: 'simple-interest-option',
          radio: 'simple-interest-radio'
        },
        compoundInterest: {
          option: 'compound-interest-option',
          radio: 'compound-interest-radio'
        }
      }
    },
    calculateButton: 'calculate-interest-button',
    result: {
      container: 'interest-result',
      finalAmount: 'final-amount-value',
      interestAmount: 'interest-amount-value'
    }
  },

  // Mapping to test cases for traceability
  testCaseMapping: {
    'TC-INTCALC-003': ['validInputs.standard', 'validInputs.withDecimalRate'],
    'TC-INTCALC-004': ['validInputs.standard', 'validInputs.withDecimalRate'],
    'TC-INTCALC-005': ['validInputs.standard', 'validInputs.withDecimalRate'],
    'TC-INTCALC-007': ['validInputs.compoundInterest', 'validInputs.compoundWithDecimal'],
    'TC-INTCALC-008': ['validInputs.standard', 'validInputs.compoundInterest'],
    'TC-INTCALC-009': ['validInputs.standard', 'validInputs.withDecimalRate'],
    'TC-INTCALC-010': ['validInputs.compoundInterest', 'validInputs.compoundWithDecimal'],
    'TC-INTCALC-014': ['invalidInputs.empty'],
    'TC-INTCALC-015': ['invalidInputs.empty'],
    'TC-INTCALC-016': ['invalidInputs.empty'],
    'TC-INTCALC-017': ['invalidInputs.nonNumeric'],
    'TC-INTCALC-018': ['invalidInputs.nonNumeric'],
    'TC-INTCALC-019': ['invalidInputs.nonNumeric'],
    'TC-INTCALC-020': ['invalidInputs.negative'],
    'TC-INTCALC-021': ['invalidInputs.negative'],
    'TC-INTCALC-022': ['invalidInputs.negative'],
    'TC-INTCALC-023': ['invalidInputs.exceedingLimits'],
    'TC-INTCALC-024': ['invalidInputs.exceedingLimits'],
    'TC-INTCALC-025': ['invalidInputs.exceedingLimits'],
    'TC-INTCALC-027': ['edgeCases.decimalPrincipal'],
    'TC-INTCALC-028': ['validInputs.withDecimalRate', 'validInputs.compoundWithDecimal'],
    'TC-INTCALC-029': ['edgeCases.decimalTime'],
    'TC-INTCALC-030': ['edgeCases.minValues']
  }
}; 
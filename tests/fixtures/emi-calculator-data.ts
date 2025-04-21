export const emiCalculatorTestData = {
    // Basic valid test cases
    validInputs: {
      standard: {
        loanAmount: 100000,
        interestRate: 10,
        loanTerm: 5,
        expectedEMI: '2124.70'
      },
      withDecimalRate: {
        loanAmount: 500000,
        interestRate: 7.5,
        loanTerm: 10,
        expectedEMI: '5959.62'
      },
      smallLoan: {
        loanAmount: 75000,
        interestRate: 8.75,
        loanTerm: 3,
        expectedEMI: '2375.66'
      }
    },
  
    // Edge cases with boundary values
    edgeCases: {
      maxValues: {
        loanAmount: 99999999, // Just under 10 crore limit
        interestRate: 50,     // Maximum allowed rate
        loanTerm: 30         // Maximum allowed term
      },
      minValues: {
        loanAmount: 1000,    // Very small loan
        interestRate: 0.1,   // Very low rate
        loanTerm: 1         // Minimum term
      },
      zeroInterest: {
        loanAmount: 120000,
        interestRate: 0,
        loanTerm: 2,
        expectedEMI: '5000.00'
      }
    },
  
    // Invalid input scenarios
    invalidInputs: {
      negative: {
        loanAmount: -10000,
        interestRate: -5,
        loanTerm: -2
      },
      exceedingLimits: {
        loanAmount: 100000001, // Exceeds 10 crore
        interestRate: 51,      // Exceeds 50%
        loanTerm: 31          // Exceeds 30 years
      },
      nonNumeric: {
        loanAmount: 'abc',
        interestRate: 'xyz',
        loanTerm: 'pqr'
      },
      empty: {
        loanAmount: '',
        interestRate: '',
        loanTerm: ''
      }
    },
  
    // Expected error messages
    errorMessages: {
      required: {
        loanAmount: 'Loan amount is required',
        interestRate: 'Interest rate is required',
        loanTerm: 'Loan term is required'
      },
      negative: {
        loanAmount: 'Loan amount must be greater than 0',
        interestRate: 'Interest rate must be greater than 0',
        loanTerm: 'Loan term must be greater than 0'
      },
      maxLimits: {
        loanAmount: 'Loan amount cannot exceed ₹10 crore',
        interestRate: 'Interest rate cannot exceed 50%',
        loanTerm: 'Loan term cannot exceed 30 years'
      }
    },
  
    // UI Test IDs for accessibility and testing
    testIds: {
      container: 'emi-calculator-container',
      title: 'emi-calculator-title',
      form: 'emi-calculator-form',
      inputs: {
        loanAmount: {
          group: 'loan-amount-group',
          input: 'loan-amount-input',
          label: 'loan-amount-label',
          error: 'loan-amount-error'
        },
        interestRate: {
          group: 'interest-rate-group',
          input: 'interest-rate-input',
          label: 'interest-rate-label',
          error: 'interest-rate-error'
        },
        loanTerm: {
          group: 'loan-term-group',
          input: 'loan-term-input',
          label: 'loan-term-label',
          error: 'loan-term-error'
        }
      },
      calculateButton: 'calculate-emi-button',
      result: {
        container: 'emi-result',
        monthlyEMI: 'monthly-emi-value'
      }
    }
  };
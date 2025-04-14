export const emiCalculatorTestData = {
  validInputs: {
    loanAmount: 100000,
    interestRate: 10,
    loanTerm: 5
  },
  edgeCases: {
    veryLargeLoanAmount: 99999999,
    veryHighInterestRate: 50,
    veryLongTerm: 30,
    veryShortTerm: 1,
    verySmallLoanAmount: 1000,
    veryLowInterestRate: 1
  },
  invalidInputs: {
    negative: {
      loanAmount: -10000,
      interestRate: -5,
      loanTerm: -2
    },
    nonNumeric: {
      loanAmount: 'abc',
      interestRate: 'xyz',
      loanTerm: 'pqr'
    }
  },
  expectedErrors: {
    emptyLoanAmount: 'Loan amount is required',
    emptyInterestRate: 'Interest rate is required',
    emptyLoanTerm: 'Loan term is required',
    negativeLoanAmount: 'Loan amount must be greater than 0',
    negativeInterestRate: 'Interest rate must be greater than 0',
    negativeLoanTerm: 'Loan term must be greater than 0'
  },
  expectedEmi: {
    // For loan amount 100000, interest rate 10%, term 5 years
    // Updating to match actual output format (without comma)
    standard: '2124.70'
  }
}; 
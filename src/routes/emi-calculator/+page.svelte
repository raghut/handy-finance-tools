<script lang="ts">
  let principal = 0;
  let rate = 0;
  let time = 0;
  let emi = 0;

  // Error states
  let errors = {
    principal: '',
    rate: '',
    time: ''
  };

  // Validation function
  function validate(): boolean {
    let isValid = true;
    
    // Reset errors
    errors = {
      principal: '',
      rate: '',
      time: ''
    };

    // Validate principal (loan amount)
    if (!principal) {
      errors.principal = 'Loan amount is required';
      isValid = false;
    } else if (principal <= 0) {
      errors.principal = 'Loan amount must be greater than 0';
      isValid = false;
    } else if (principal > 100000000) { // 10 crore limit
      errors.principal = 'Loan amount cannot exceed ₹10 crore';
      isValid = false;
    }

    // Validate interest rate
    if (!rate) {
      errors.rate = 'Interest rate is required';
      isValid = false;
    } else if (rate <= 0) {
      errors.rate = 'Interest rate must be greater than 0';
      isValid = false;
    } else if (rate > 50) { // Reasonable upper limit
      errors.rate = 'Interest rate cannot exceed 50%';
      isValid = false;
    }

    // Validate loan term
    if (!time) {
      errors.time = 'Loan term is required';
      isValid = false;
    } else if (time <= 0) {
      errors.time = 'Loan term must be greater than 0';
      isValid = false;
    } else if (time > 30) { // Most loans don't exceed 30 years
      errors.time = 'Loan term cannot exceed 30 years';
      isValid = false;
    }

    return isValid;
  }

  function calculateEMI() {
    if (!validate()) {
      return; // Stop if validation fails
    }

    const p = parseFloat(principal.toString());
    const r = parseFloat(rate.toString()) / (12 * 100); // monthly interest rate
    const n = parseFloat(time.toString()) * 12; // number of months
    
    // Check for potential calculation issues
    if (r === 0) {
      emi = p / n; // Simple division if rate is 0
    } else {
      emi = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    }

    // Check for invalid results (NaN, Infinity)
    if (!isFinite(emi)) {
      emi = 0;
      errors.principal = 'Calculation resulted in an invalid amount';
    }
  }

  // Reset errors when user changes input
  function clearFieldError(field: 'principal' | 'rate' | 'time') {
    errors[field] = '';
  }
</script>

<div class="calculator-container" data-testid="emi-calculator-container" id="emi-calculator-container">
  <h1 data-testid="emi-calculator-title" id="emi-calculator-title">EMI Calculator</h1>
  <div class="calculator-form" data-testid="emi-calculator-form" id="emi-calculator-form">
    <div class="input-group" data-testid="loan-amount-group" id="loan-amount-group">
      <label for="principal" data-testid="loan-amount-label" id="loan-amount-label">Loan Amount (₹)</label>
      <input 
        type="number" 
        id="principal" 
        bind:value={principal} 
        min="0" 
        on:input={() => clearFieldError('principal')}
        class={errors.principal ? 'error-input' : ''}
        data-testid="loan-amount-input"
        aria-describedby="loan-amount-error"
      >
      {#if errors.principal}
        <div class="error-message" data-testid="loan-amount-error" id="loan-amount-error">{errors.principal}</div>
      {/if}
    </div>
    
    <div class="input-group" data-testid="interest-rate-group" id="interest-rate-group">
      <label for="rate" data-testid="interest-rate-label" id="interest-rate-label">Interest Rate (% per annum)</label>
      <input 
        type="number" 
        id="rate" 
        bind:value={rate} 
        min="0" 
        step="0.1" 
        on:input={() => clearFieldError('rate')}
        class={errors.rate ? 'error-input' : ''}
        data-testid="interest-rate-input"
        aria-describedby="interest-rate-error"
      >
      {#if errors.rate}
        <div class="error-message" data-testid="interest-rate-error" id="interest-rate-error">{errors.rate}</div>
      {/if}
    </div>
    
    <div class="input-group" data-testid="loan-term-group" id="loan-term-group">
      <label for="time" data-testid="loan-term-label" id="loan-term-label">Loan Term (Years)</label>
      <input 
        type="number" 
        id="time" 
        bind:value={time} 
        min="0" 
        on:input={() => clearFieldError('time')}
        class={errors.time ? 'error-input' : ''}
        data-testid="loan-term-input"
        aria-describedby="loan-term-error"
      >
      {#if errors.time}
        <div class="error-message" data-testid="loan-term-error" id="loan-term-error">{errors.time}</div>
      {/if}
    </div>

    <button on:click={calculateEMI} data-testid="calculate-emi-button" id="calculate-emi-button">Calculate EMI</button>

    {#if emi}
      <div class="result" data-testid="emi-result" id="emi-result">
        <h2 data-testid="monthly-emi-value" id="monthly-emi-value">Monthly EMI: ₹{emi.toFixed(2)}</h2>
      </div>
    {/if}
  </div>
</div>

<style>
  .calculator-container {
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
  }

  h1 {
    text-align: center;
    color: #1a73e8;
  }

  .calculator-form {
    background: white;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  }

  .input-group {
    margin-bottom: 20px;
  }

  label {
    display: block;
    margin-bottom: 5px;
    color: #333;
  }

  input {
    width: 100%;
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
  }

  button {
    width: 100%;
    padding: 10px;
    background-color: #1a73e8;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }

  button:hover {
    background-color: #1557b0;
  }

  .result {
    margin-top: 20px;
    text-align: center;
  }

  .result h2 {
    color: #1a73e8;
  }

  .error-input {
    border-color: #e53935;
    background-color: rgba(229, 57, 53, 0.05);
  }

  .error-message {
    color: #e53935;
    font-size: 0.8rem;
    margin-top: 5px;
  }
</style> 
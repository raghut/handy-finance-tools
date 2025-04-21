<script lang="ts">
  let principal: number | string = '';
  let rate: number | string = '';
  let time: number | string = '';
  let interestType = 'simple';
  let result: number | null = null;
  
  // Error states
  let errors = {
    principal: '',
    rate: '',
    time: ''
  };

  function validateInputs(): boolean {
    // Reset errors
    errors = {
      principal: '',
      rate: '',
      time: ''
    };
    
    let isValid = true;
    
    // Validate principal
    if (principal === '') {
      errors.principal = 'Principal amount is required';
      isValid = false;
    } else {
      const p = parseFloat(principal.toString());
      if (isNaN(p)) {
        errors.principal = 'Please enter a valid number';
        isValid = false;
      } else if (p <= 0) {
        errors.principal = 'Principal must be greater than 0';
        isValid = false;
      } else if (p > 1000000000) { // 1 billion limit for practical purposes
        errors.principal = 'Principal amount is too large';
        isValid = false;
      }
    }
    
    // Validate rate
    if (rate === '') {
      errors.rate = 'Interest rate is required';
      isValid = false;
    } else {
      const r = parseFloat(rate.toString());
      if (isNaN(r)) {
        errors.rate = 'Please enter a valid number';
        isValid = false;
      } else if (r <= 0) {
        errors.rate = 'Rate must be greater than 0';
        isValid = false;
      } else if (r > 100) {
        errors.rate = 'Rate should not exceed 100%';
        isValid = false;
      }
    }
    
    // Validate time
    if (time === '') {
      errors.time = 'Time period is required';
      isValid = false;
    } else {
      const t = parseFloat(time.toString());
      if (isNaN(t)) {
        errors.time = 'Please enter a valid number';
        isValid = false;
      } else if (t <= 0) {
        errors.time = 'Time must be greater than 0';
        isValid = false;
      } else if (t > 100) { // 100 years as a reasonable limit
        errors.time = 'Time period is too long';
        isValid = false;
      }
    }
    
    return isValid;
  }

  function calculateInterest() {
    if (!validateInputs()) {
      result = null;
      return;
    }
    
    const p = parseFloat(principal.toString());
    const r = parseFloat(rate.toString()) / 100;
    const t = parseFloat(time.toString());
    
    try {
      if (interestType === 'simple') {
        result = p * (1 + r * t);
      } else {
        result = p * Math.pow(1 + r, t);
      }
      
      // Check for valid result
      if (!isFinite(result)) {
        result = null;
        errors.rate = 'Calculation resulted in an invalid amount. Try smaller values.';
      }
    } catch (error) {
      result = null;
      console.error('Calculation error:', error);
    }
  }
</script>

<div class="calculator-container" data-testid="interest-calculator-container">
  <h1 data-testid="interest-calculator-title">Interest Calculator</h1>
  <div class="calculator-form" data-testid="interest-calculator-form">
    <div class="input-group" data-testid="principal-amount-group">
      <label for="principal" data-testid="principal-amount-label">Principal Amount (₹)</label>
      <input type="number" id="principal" bind:value={principal} data-testid="principal-amount-input" 
        placeholder="Enter principal amount">
      {#if errors.principal}
        <p class="error-message" data-testid="principal-error">{errors.principal}</p>
      {/if}
    </div>
    
    <div class="input-group" data-testid="interest-rate-group">
      <label for="rate" data-testid="interest-rate-label">Interest Rate (% per annum)</label>
      <input type="number" id="rate" bind:value={rate} step="0.1" data-testid="interest-rate-input" 
        placeholder="Enter interest rate">
      {#if errors.rate}
        <p class="error-message" data-testid="rate-error">{errors.rate}</p>
      {/if}
    </div>
    
    <div class="input-group" data-testid="time-period-group">
      <label for="time" data-testid="time-period-label">Time Period (Years)</label>
      <input type="number" id="time" bind:value={time} data-testid="time-period-input" 
        placeholder="Enter time period">
      {#if errors.time}
        <p class="error-message" data-testid="time-error">{errors.time}</p>
      {/if}
    </div>

    <div class="input-group" data-testid="interest-type-group">
      <label data-testid="interest-type-label">Interest Type</label>
      <div class="radio-group" data-testid="interest-type-options">
        <label data-testid="simple-interest-option">
          <input type="radio" bind:group={interestType} value="simple" data-testid="simple-interest-radio">
          Simple Interest
        </label>
        <label data-testid="compound-interest-option">
          <input type="radio" bind:group={interestType} value="compound" data-testid="compound-interest-radio">
          Compound Interest
        </label>
      </div>
    </div>

    <button on:click={calculateInterest} data-testid="calculate-interest-button">Calculate Interest</button>

    {#if result !== null}
      <div class="result" data-testid="interest-result">
        <h2 data-testid="final-amount-value">Final Amount: ₹{result.toFixed(2)}</h2>
        <p data-testid="interest-amount-value">Interest Amount: ₹{(result - parseFloat(principal.toString())).toFixed(2)}</p>
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

  .radio-group {
    display: flex;
    gap: 20px;
  }

  .radio-group label {
    display: flex;
    align-items: center;
    gap: 5px;
  }

  .radio-group input[type="radio"] {
    width: auto;
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

  .error-message {
    color: #d32f2f;
    font-size: 0.85rem;
    margin-top: 5px;
    margin-bottom: 0;
  }
  
  input.error {
    border-color: #d32f2f;
  }
</style> 
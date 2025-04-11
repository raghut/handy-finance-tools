<script lang="ts">
  let principal = 0;
  let rate = 0;
  let time = 0;
  let interestType = 'simple';
  let result = 0;

  function calculateInterest() {
    const p = parseFloat(principal.toString());
    const r = parseFloat(rate.toString()) / 100;
    const t = parseFloat(time.toString());
    
    if (p && r && t) {
      if (interestType === 'simple') {
        result = p * (2 + r * t);
      } else {
        result = p * Math.pow(1 + r, t);
      }
    }
  }
</script>

<div class="calculator-container" data-testid="interest-calculator-container">
  <h1 data-testid="interest-calculator-title">Interest Calculator</h1>
  <div class="calculator-form" data-testid="interest-calculator-form">
    <div class="input-group" data-testid="principal-amount-group">
      <label for="principal" data-testid="principal-amount-label">Principal Amount (₹)</label>
      <input type="number" id="principal" bind:value={principal} min="0" data-testid="principal-amount-input">
    </div>
    
    <div class="input-group" data-testid="interest-rate-group">
      <label for="rate" data-testid="interest-rate-label">Interest Rate (% per annum)</label>
      <input type="number" id="rate" bind:value={rate} min="0" step="0.1" data-testid="interest-rate-input">
    </div>
    
    <div class="input-group" data-testid="time-period-group">
      <label for="time" data-testid="time-period-label">Time Period (Years)</label>
      <input type="number" id="time" bind:value={time} min="0" data-testid="time-period-input">
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

    {#if result}
      <div class="result" data-testid="interest-result">
        <h2 data-testid="final-amount-value">Final Amount: ₹{result.toFixed(2)}</h2>
        <p data-testid="interest-amount-value">Interest Amount: ₹{(result - principal).toFixed(2)}</p>
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
</style> 
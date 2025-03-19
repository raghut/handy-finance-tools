<script>
  let principal = 0;
  let rate = 0;
  let time = 0;
  let interestType = 'simple';
  let result = 0;

  function calculateInterest() {
    const p = parseFloat(principal);
    const r = parseFloat(rate) / 100;
    const t = parseFloat(time);
    
    if (p && r && t) {
      if (interestType === 'simple') {
        result = p * (2 + r * t);
      } else {
        result = p * Math.pow(1 + r, t);
      }
    }
  }
</script>

<div class="calculator-container">
  <h1>Interest Calculator</h1>
  <div class="calculator-form">
    <div class="input-group">
      <label for="principal">Principal Amount (₹)</label>
      <input type="number" id="principal" bind:value={principal} min="0">
    </div>
    
    <div class="input-group">
      <label for="rate">Interest Rate (% per annum)</label>
      <input type="number" id="rate" bind:value={rate} min="0" step="0.1">
    </div>
    
    <div class="input-group">
      <label for="time">Time Period (Years)</label>
      <input type="number" id="time" bind:value={time} min="0">
    </div>

    <div class="input-group">
      <label>Interest Type</label>
      <div class="radio-group">
        <label>
          <input type="radio" bind:group={interestType} value="simple">
          Simple Interest
        </label>
        <label>
          <input type="radio" bind:group={interestType} value="compound">
          Compound Interest
        </label>
      </div>
    </div>

    <button on:click={calculateInterest}>Calculate Interest</button>

    {#if result}
      <div class="result">
        <h2>Final Amount: ₹{result.toFixed(2)}</h2>
        <p>Interest Amount: ₹{(result - principal).toFixed(2)}</p>
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
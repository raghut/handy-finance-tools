<script>
  let principal = 0;
  let rate = 0;
  let time = 0;
  let emi = 0;

  function calculateEMI() {
    const p = parseFloat(principal);
    const r = parseFloat(rate) / (12 * 100); // monthly interest rate
    const n = parseFloat(time) * 12; // number of months
    
    if (p && r && n) {
      emi = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    }
  }
</script>

<div class="calculator-container">
  <h1>EMI Calculator</h1>
  <div class="calculator-form">
    <div class="input-group">
      <label for="principal">Loan Amount (₹)</label>
      <input type="number" id="principal" bind:value={principal} min="0">
    </div>
    
    <div class="input-group">
      <label for="rate">Interest Rate (% per annum)</label>
      <input type="number" id="rate" bind:value={rate} min="0" step="0.1">
    </div>
    
    <div class="input-group">
      <label for="time">Loan Term (Years)</label>
      <input type="number" id="time" bind:value={time} min="0">
    </div>

    <button on:click={calculateEMI}>Calculate EMI</button>

    {#if emi}
      <div class="result">
        <h2>Monthly EMI: ₹{emi.toFixed(2)}</h2>
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
</style> 
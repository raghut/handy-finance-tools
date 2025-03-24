<script>
    let principalAmount = '';
    let interestAmount = '';
    let durationMonths = '';
    
    let simpleInterestRate = 0;
    let compoundInterestRate = 0;

    function calculateRates() {
        if (principalAmount && interestAmount && durationMonths) {
            // Convert to numbers
            const P = parseFloat(principalAmount);
            const I = parseFloat(interestAmount);
            const T = parseFloat(durationMonths) / 12; // Convert months to years
            
            // Calculate Simple Interest Rate
            // I = P * R * T
            // R = I / (P * T)
            simpleInterestRate = (I / (P * T)) * 100;
            console.log("simpleInterestRate: ",simpleInterestRate);
            
            // Calculate Compound Interest Rate
            // A = P(1 + R)^T
            // R = (A/P)^(1/T) - 1
            const totalAmount = P + I;
            compoundInterestRate = (Math.pow(totalAmount / P, 1/T) - 1) * 100;
        }
    }

    function resetForm() {
        principalAmount = '';
        interestAmount = '';
        durationMonths = '';
        simpleInterestRate = 0;
        compoundInterestRate = 0;
    }

    // Input validation
    function validateNumber(event) {
        const value = event.target.value;
        if (value < 0) event.target.value = 0;
    }
</script>

<div class="calculator-container">
    <h1>Interest Rate Calculator</h1>
    
    <div class="calculator-form">
        <div class="input-group">
            <label for="principal">Principal Amount (₹)</label>
            <input 
                type="number" 
                id="principal" 
                bind:value={principalAmount} 
                placeholder="Enter principal amount"
                min="0"
                on:input={validateNumber}
            />
        </div>

        <div class="input-group">
            <label for="interest">Interest Amount (₹)</label>
            <input 
                type="number" 
                id="interest" 
                bind:value={interestAmount} 
                placeholder="Enter interest amount"
                min="0"
                on:input={validateNumber}
            />
        </div>

        <div class="input-group">
            <label for="duration">Duration (Months)</label>
            <input 
                type="number" 
                id="duration" 
                bind:value={durationMonths} 
                placeholder="Enter duration in months"
                min="0"
                on:input={validateNumber}
            />
        </div>

        <div class="button-group">
            <button 
                on:click={calculateRates}
                disabled={!principalAmount || !interestAmount || !durationMonths}
            >
                Calculate
            </button>
            <button on:click={resetForm} class="reset">Reset</button>
        </div>

        {#if simpleInterestRate > 0}
            <div class="results">
                <div class="result-card">
                    <h3>Simple Interest Rate</h3>
                    <p class="percentage">{simpleInterestRate.toFixed(2)}% per annum</p>
                    <small>Based on simple interest formula: I = P × R × T</small>
                </div>
                
                <div class="result-card">
                    <h3>Compound Interest Rate</h3>
                    <p class="percentage">{compoundInterestRate.toFixed(2)}% per annum</p>
                    <small>Based on compound interest formula: A = P(1 + R)ᵗ</small>
                </div>
                
                <div class="result-card">
                    <h3>Total Amount</h3>
                    <p class="amount">₹ {(parseFloat(principalAmount) + parseFloat(interestAmount)).toFixed(2)}</p>
                </div>
            </div>
        {/if}
    </div>
</div>

<style>
    .calculator-container {
        max-width: 600px;
        margin: 2rem auto;
        padding: 0 20px;
    }

    h1 {
        text-align: center;
        color: #1a73e8;
        margin-bottom: 2rem;
    }

    .calculator-form {
        background: white;
        padding: 2rem;
        border-radius: 10px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }

    .input-group {
        margin-bottom: 1.5rem;
    }

    label {
        display: block;
        margin-bottom: 0.5rem;
        color: #333;
        font-weight: 500;
    }

    input {
        width: 100%;
        padding: 0.75rem;
        border: 1px solid #ddd;
        border-radius: 5px;
        font-size: 1rem;
        transition: border-color 0.3s ease;
    }

    input:focus {
        outline: none;
        border-color: #1a73e8;
    }

    .button-group {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
        margin-top: 2rem;
    }

    button {
        padding: 0.75rem;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        font-size: 1rem;
        font-weight: 500;
        transition: background-color 0.3s ease;
    }

    button:disabled {
        background-color: #ccc;
        cursor: not-allowed;
    }

    button:not(.reset) {
        background-color: #1a73e8;
        color: white;
    }

    button:not(.reset):hover:not(:disabled) {
        background-color: #1557b0;
    }

    .reset {
        background-color: #f44336;
        color: white;
    }

    .reset:hover {
        background-color: #da190b;
    }

    .results {
        margin-top: 2rem;
        display: grid;
        gap: 1rem;
    }

    .result-card {
        background-color: #f8f9fa;
        padding: 1.5rem;
        border-radius: 5px;
        text-align: center;
    }

    .result-card h3 {
        color: #333;
        margin: 0 0 0.5rem 0;
        font-size: 1.1rem;
    }

    .percentage {
        color: #1a73e8;
        font-size: 1.4rem;
        font-weight: bold;
        margin: 0.5rem 0;
    }

    .amount {
        color: #4CAF50;
        font-size: 1.4rem;
        font-weight: bold;
        margin: 0.5rem 0;
    }

    small {
        color: #666;
        font-size: 0.9rem;
        display: block;
        margin-top: 0.5rem;
    }
</style> 
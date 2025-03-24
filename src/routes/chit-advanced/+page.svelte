<script lang="ts">
    import type { ChitCalculation } from './types';
    import { calculateChitDetails } from './calculations';

    let chitAmount = 300000;
    let numberOfPeople = 20;
    let numberOfMonths = 20;
    let commissionPercentage = 4;
    let auctionMonth = 14;
    let auctionAmount = 20000;

    $: results = calculateChitDetails({
        chitAmount,
        numberOfPeople,
        numberOfMonths,
        commissionPercentage,
        auctionMonth,
        auctionAmount
    });
</script>

<div class="calculator-container">
    <h1>Advanced Chit Fund Calculator</h1>
    
    <div class="calculator-form">
        <h2>Input Details</h2>
        
        <div class="input-group">
            <label for="chitAmount">Chit Amount (₹)</label>
            <input 
                type="number" 
                id="chitAmount"
                bind:value={chitAmount}
                min="0"
            >
        </div>

        <div class="input-group">
            <label for="numberOfPeople">Number of People</label>
            <input 
                type="number" 
                id="numberOfPeople"
                bind:value={numberOfPeople}
                min="1"
            >
        </div>

        <div class="input-group">
            <label for="numberOfMonths">Number of Months</label>
            <input 
                type="number" 
                id="numberOfMonths"
                bind:value={numberOfMonths}
                min="1"
            >
        </div>

        <div class="input-group">
            <label for="commissionPercentage">Commission (%)</label>
            <input 
                type="number" 
                id="commissionPercentage"
                bind:value={commissionPercentage}
                min="0"
                max="100"
                step="0.1"
            >
        </div>

        <div class="input-group">
            <label for="auctionMonth">Auction Month</label>
            <input 
                type="number" 
                id="auctionMonth"
                bind:value={auctionMonth}
                min="1"
                max={numberOfMonths}
            >
        </div>

        <div class="input-group">
            <label for="auctionAmount">Auction Amount (₹)</label>
            <input 
                type="number" 
                id="auctionAmount"
                bind:value={auctionAmount}
                max={chitAmount}
            >
        </div>

        <div class="result">
            <h2>Calculation Results</h2>
            

            <div class="interest-details">
                <div class="interest-group">
                    <h3>Effective Annual Interest Rate</h3>
                    <p>{results.interestRate}%</p>
                </div>
                <div class="interest-group">
                    <h3>Interest Rate in Rupees</h3>
                    <p>₹{results.interestRateInRupees}</p>
                </div>
                <div class="interest-group">
                    <h3>Remaining Months</h3>
                    <p>{results.remainingMonths}</p>
                </div>
            </div>

            <div class="result-group">
                <h3>Monthly Contribution</h3>
                <p>₹{results.monthlyContribution}</p>
            </div>

            <div class="result-group">
                <h3>Commission Amount</h3>
                <p>₹{results.commission}</p>
            </div>

            <div class="result-group">
                <h3>Dividend Per Person</h3>
                <p>₹{results.dividendPerPerson}</p>
            </div>

            <div class="result-group">
                <h3>Net Payable Per Person</h3>
                <p>₹{results.netPayablePerPerson}</p>
            </div>

        </div>
    </div>
</div>

<style>
    .calculator-container {
        max-width: 800px;
        margin: 0 auto;
        padding: 20px;
    }

    h1 {
        text-align: center;
        color: #1a73e8;
        margin-bottom: 30px;
    }

    h2 {
        color: #1a73e8;
        margin-bottom: 20px;
    }

    .calculator-form {
        background: white;
        padding: 30px;
        border-radius: 10px;
        box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    }

    .input-group {
        margin-bottom: 20px;
    }

    label {
        display: block;
        margin-bottom: 8px;
        color: #333;
        font-weight: 500;
    }

    input {
        width: 100%;
        padding: 10px;
        border: 1px solid #ddd;
        border-radius: 4px;
        font-size: 16px;
    }

    input:focus {
        outline: none;
        border-color: #1a73e8;
        box-shadow: 0 0 0 2px rgba(26,115,232,0.2);
    }

    .result {
        margin-top: 40px;
        padding-top: 20px;
        border-top: 2px solid #eee;
    }

    .result-group {
        background: #f8f9fa;
        padding: 15px;
        border-radius: 8px;
        margin-bottom: 15px;
    }

    .result-group h3 {
        color: #666;
        font-size: 14px;
        margin-bottom: 5px;
    }

    .result-group p {
        color: #1a73e8;
        font-size: 24px;
        font-weight: bold;
        margin: 0;
    }

    .interest-details {
        background: #e8f0fe;
        padding: 20px;
        border-radius: 8px;
        margin-bottom: 20px;
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 20px;
    }

    .interest-group h3 {
        color: #1a73e8;
        font-size: 14px;
        margin-bottom: 5px;
    }

    .interest-group p {
        color: #1557b0;
        font-size: 20px;
        font-weight: bold;
        margin: 0;
    }

    @media (max-width: 768px) {
        .interest-details {
            grid-template-columns: 1fr;
            gap: 15px;
        }
    }
</style>
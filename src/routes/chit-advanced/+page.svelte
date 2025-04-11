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

<div class="calculator-container" data-testid="chit-calculator-container">
    <h1 data-testid="calculator-title">Advanced Chit Fund Calculator</h1>
    
    <div class="calculator-form" data-testid="calculator-form">
        <h2 data-testid="input-section-title">Input Details</h2>
        
        <div class="input-group" data-testid="chit-amount-group">
            <label for="chitAmount" data-testid="chit-amount-label">Chit Amount (₹)</label>
            <input 
                type="number" 
                id="chitAmount"
                data-testid="chit-amount-input"
                bind:value={chitAmount}
                min="0"
            >
        </div>

        <div class="input-group" data-testid="number-of-people-group">
            <label for="numberOfPeople" data-testid="number-of-people-label">Number of People</label>
            <input 
                type="number" 
                id="numberOfPeople"
                data-testid="number-of-people-input"
                bind:value={numberOfPeople}
                min="1"
            >
        </div>

        <div class="input-group" data-testid="number-of-months-group">
            <label for="numberOfMonths" data-testid="number-of-months-label">Number of Months</label>
            <input 
                type="number" 
                id="numberOfMonths"
                data-testid="number-of-months-input"
                bind:value={numberOfMonths}
                min="1"
            >
        </div>

        <div class="input-group" data-testid="commission-percentage-group">
            <label for="commissionPercentage" data-testid="commission-percentage-label">Commission (%)</label>
            <input 
                type="number" 
                id="commissionPercentage"
                data-testid="commission-percentage-input"
                bind:value={commissionPercentage}
                min="0"
                max="100"
                step="0.1"
            >
        </div>

        <div class="input-group" data-testid="auction-month-group">
            <label for="auctionMonth" data-testid="auction-month-label">Auction Month</label>
            <input 
                type="number" 
                id="auctionMonth"
                data-testid="auction-month-input"
                bind:value={auctionMonth}
                min="1"
                max={numberOfMonths}
            >
        </div>

        <div class="input-group" data-testid="auction-amount-group">
            <label for="auctionAmount" data-testid="auction-amount-label">Auction Amount (₹)</label>
            <input 
                type="number" 
                id="auctionAmount"
                data-testid="auction-amount-input"
                bind:value={auctionAmount}
                max={chitAmount}
            >
        </div>

        <div class="result" data-testid="results-section">
            <h2 data-testid="results-section-title">Calculation Results</h2>
            

            <div class="interest-details" data-testid="interest-details-section">
                <div class="interest-group" data-testid="effective-annual-interest-group">
                    <h3 data-testid="effective-annual-interest-label">Effective Annual Interest Rate</h3>
                    <p data-testid="effective-annual-interest-value">{results.interestRate}%</p>
                </div>
                <div class="interest-group" data-testid="interest-rate-rupees-group">
                    <h3 data-testid="interest-rate-rupees-label">Interest Rate in Rupees</h3>
                    <p data-testid="interest-rate-rupees-value">₹{results.interestRateInRupees}</p>
                </div>
                <div class="interest-group" data-testid="remaining-months-group">
                    <h3 data-testid="remaining-months-label">Remaining Months</h3>
                    <p data-testid="remaining-months-value">{results.remainingMonths}</p>
                </div>
            </div>

            <div class="result-group" data-testid="monthly-contribution-group">
                <h3 data-testid="monthly-contribution-label">Monthly Contribution</h3>
                <p data-testid="monthly-contribution-value">₹{results.monthlyContribution}</p>
            </div>

            <div class="result-group" data-testid="commission-amount-group">
                <h3 data-testid="commission-amount-label">Commission Amount</h3>
                <p data-testid="commission-amount-value">₹{results.commission}</p>
            </div>

            <div class="result-group" data-testid="dividend-per-person-group">
                <h3 data-testid="dividend-per-person-label">Dividend Per Person</h3>
                <p data-testid="dividend-per-person-value">₹{results.dividendPerPerson}</p>
            </div>

            <div class="result-group" data-testid="net-payable-group">
                <h3 data-testid="net-payable-label">Net Payable Per Person</h3>
                <p data-testid="net-payable-value">₹{results.netPayablePerPerson}</p>
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
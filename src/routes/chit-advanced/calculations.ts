import type { ChitInput, ChitCalculation } from './types';

export function calculateChitDetails(input: ChitInput): ChitCalculation {
    const monthlyContribution = input.chitAmount / input.numberOfPeople;
    const commission = (input.chitAmount * input.commissionPercentage) / 100;
    const remainingMonths = input.numberOfMonths - input.auctionMonth;
    const dividend = (input.auctionAmount - commission) / input.numberOfPeople;
    const netPayablePerPerson = monthlyContribution - dividend;
    const netPayableAmount = input.chitAmount - input.auctionAmount;

    // Calculate interest rate
    // const totalPayment = monthlyContribution * remainingMonths;
    const interestAmount = input.auctionAmount - commission;
    const annualRate = (interestAmount / (netPayableAmount * remainingMonths/12)) * 100;

    
    console.log("interestAmount:", interestAmount);
    console.log("netPayableAmount:", netPayableAmount);
    console.log("remainingMonths:", remainingMonths);
    console.log("annualRate:", annualRate);

    // Calculate interest rate in rupees
    const interestRateInRupees = annualRate * (1/12);

    return {
        monthlyContribution: monthlyContribution.toFixed(2),
        commission: commission.toFixed(2),
        dividendPerPerson: dividend.toFixed(2),
        netPayablePerPerson: netPayablePerPerson.toFixed(2),
        interestRate: annualRate.toFixed(2),
        interestRateInRupees: interestRateInRupees.toFixed(2),
        remainingMonths
    };
} 
export interface ChitInput {
    chitAmount: number;
    numberOfPeople: number;
    numberOfMonths: number;
    commissionPercentage: number;
    auctionMonth: number;
    auctionAmount: number;
}

export interface ChitCalculation {
    monthlyContribution: string;
    commission: string;
    dividendPerPerson: string;
    netPayablePerPerson: string;
    interestRate: string;
    interestRateInRupees: string;
    remainingMonths: number;
} 
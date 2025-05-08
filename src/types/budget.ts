
export interface Budget {
  id: string;
  category: string;
  amount: number;
  period: 'monthly' | 'yearly';
  startDate: Date;
}

export interface BudgetProgress {
  category: string;
  budgetAmount: number;
  spentAmount: number;
  percentageUsed: number;
  remainingAmount: number;
}

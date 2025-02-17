
export type TransactionType = "income" | "expense";

export type TransactionFrequency = "once" | "monthly" | "yearly";

export interface Transaction {
  id: string;
  amount: number;
  type: TransactionType;
  date: Date;
  description: string;
  category: string;
  isRecurring: boolean;
  frequency?: TransactionFrequency;
  nextDate?: Date;
  endDate?: Date;
}

export interface DashboardStats {
  currentBalance: number;
  totalIncome: number;
  totalExpenses: number;
  recurring: number;
}

export interface CategoryTotal {
  category: string;
  amount: number;
}

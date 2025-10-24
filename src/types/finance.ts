
export type TransactionType = "income" | "expense";

export type TransactionFrequency = "daily" | "weekly" | "monthly" | "yearly";

export interface Channel {
  id: string;
  name: string;
  icon: string;
  color?: string;
}

export interface Transaction {
  id: string;
  amount: number;
  type: TransactionType;
  date: Date;
  description: string;
  category: string;
  channelId: string;
  isRecurring: boolean;
  frequency?: TransactionFrequency;
  nextDate?: Date;
  endDate?: Date;
}

export interface Category {
  id: string;
  emoji: string;
  name: string;
}

export interface DashboardStats {
  currentBalance: number;
  totalIncome: number;
  totalExpenses: number;
  recurring: number;
  channelBalances: Record<string, number>;
}

export interface CategoryTotal {
  category: string;
  amount: number;
}

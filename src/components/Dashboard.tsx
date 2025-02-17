
import { useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Transaction, DashboardStats, CategoryTotal } from "@/types/finance";
import { Euro, TrendingUp, TrendingDown, CalendarClock } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface DashboardProps {
  transactions: Transaction[];
}

const Dashboard = ({ transactions }: DashboardProps) => {
  const stats: DashboardStats = useMemo(() => {
    return transactions.reduce(
      (acc, transaction) => {
        const amount = transaction.amount;
        if (transaction.type === "income") {
          acc.totalIncome += amount;
        } else {
          acc.totalExpenses += amount;
        }
        if (transaction.isRecurring) {
          acc.recurring += 1;
        }
        acc.currentBalance =
          acc.totalIncome - acc.totalExpenses;
        return acc;
      },
      { currentBalance: 0, totalIncome: 0, totalExpenses: 0, recurring: 0 }
    );
  }, [transactions]);

  const categoryTotals: CategoryTotal[] = useMemo(() => {
    const totals = transactions.reduce((acc, transaction) => {
      if (transaction.type === "expense") {
        acc[transaction.category] = (acc[transaction.category] || 0) + transaction.amount;
      }
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(totals)
      .map(([category, amount]) => ({ category, amount }))
      .sort((a, b) => b.amount - a.amount);
  }, [transactions]);

  return (
    <>
      <Card className="p-6 animate-slideIn">
        <div className="flex items-center gap-4">
          <div className="p-4 rounded-full bg-blue-100">
            <Euro className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Solde Actuel
            </p>
            <h2 className="text-3xl font-bold">
              {stats.currentBalance.toLocaleString("fr-FR")}€
            </h2>
          </div>
        </div>
      </Card>

      <Card className="p-6 animate-slideIn [animation-delay:100ms]">
        <div className="flex items-center gap-4">
          <div className="p-4 rounded-full bg-green-100">
            <TrendingUp className="w-6 h-6 text-income" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Revenus Totaux
            </p>
            <h2 className="text-3xl font-bold text-income">
              {stats.totalIncome.toLocaleString("fr-FR")}€
            </h2>
          </div>
        </div>
      </Card>

      <Card className="p-6 animate-slideIn [animation-delay:200ms]">
        <div className="flex items-center gap-4">
          <div className="p-4 rounded-full bg-red-100">
            <TrendingDown className="w-6 h-6 text-expense" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Dépenses Totales
            </p>
            <h2 className="text-3xl font-bold text-expense">
              {stats.totalExpenses.toLocaleString("fr-FR")}€
            </h2>
          </div>
        </div>
      </Card>

      <Card className="col-span-full p-6 animate-slideIn [animation-delay:300ms]">
        <h3 className="text-lg font-semibold mb-4">Dépenses par Catégorie</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={categoryTotals}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="amount" fill="#ef4444" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </>
  );
};

export default Dashboard;

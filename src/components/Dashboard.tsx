
import { useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Transaction, DashboardStats, CategoryTotal, Channel } from "@/types/finance";
import { Euro, TrendingUp, TrendingDown } from "lucide-react";
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
  channels: Channel[];
}

const Dashboard = ({ transactions, channels }: DashboardProps) => {
  const stats: DashboardStats = useMemo(() => {
    const channelBalances: Record<string, number> = {};
    
    // Initialiser tous les canaux à 0
    channels.forEach(channel => {
      channelBalances[channel.id] = 0;
    });
    
    return transactions.reduce(
      (acc, transaction) => {
        const amount = transaction.amount;
        
        if (transaction.type === "income") {
          acc.totalIncome += amount;
          // Ajouter au solde du canal
          acc.channelBalances[transaction.channelId] = 
            (acc.channelBalances[transaction.channelId] || 0) + amount;
        } else {
          acc.totalExpenses += amount;
          // Soustraire du solde du canal
          acc.channelBalances[transaction.channelId] = 
            (acc.channelBalances[transaction.channelId] || 0) - amount;
        }
        
        if (transaction.isRecurring) {
          acc.recurring += 1;
        }
        
        acc.currentBalance = acc.totalIncome - acc.totalExpenses;
        return acc;
      },
      { 
        currentBalance: 0, 
        totalIncome: 0, 
        totalExpenses: 0, 
        recurring: 0,
        channelBalances
      }
    );
  }, [transactions, channels]);

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
              Solde actuel
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
              Revenus totaux
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
              Dépenses totales
            </p>
            <h2 className="text-3xl font-bold text-expense">
              {stats.totalExpenses.toLocaleString("fr-FR")}€
            </h2>
          </div>
        </div>
      </Card>

      {/* Canaux d'argent */}
      {channels.map((channel, index) => (
        <Card key={channel.id} className={`p-6 animate-slideIn [animation-delay:${300 + index * 100}ms]`}>
          <div className="flex items-center gap-4">
            <div className="p-4 rounded-full bg-blue-50">
              <span className="text-xl">{channel.icon}</span>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                {channel.name}
              </p>
              <h2 className={`text-2xl font-bold ${stats.channelBalances[channel.id] >= 0 ? 'text-income' : 'text-expense'}`}>
                {stats.channelBalances[channel.id]?.toLocaleString("fr-FR")}€
              </h2>
            </div>
          </div>
        </Card>
      ))}

      <Card className="col-span-full p-6 animate-slideIn [animation-delay:300ms]">
        <h3 className="text-lg font-semibold mb-4">Dépenses par catégorie</h3>
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

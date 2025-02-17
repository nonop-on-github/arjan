
import { useState } from "react";
import { Transaction } from "@/types/finance";
import { PlusCircle, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import TransactionForm from "@/components/TransactionForm";
import Dashboard from "@/components/Dashboard";
import TransactionList from "@/components/TransactionList";
import { useTheme } from "next-themes";

const Index = () => {
  const [showTransactionForm, setShowTransactionForm] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const { theme, setTheme } = useTheme();

  const addTransaction = (transaction: Transaction) => {
    setTransactions((prev) => [transaction, ...prev]);
    setShowTransactionForm(false);
  };

  const updateTransaction = (updatedTransaction: Transaction) => {
    setTransactions((prev) =>
      prev.map((t) => (t.id === updatedTransaction.id ? updatedTransaction : t))
    );
    setEditingTransaction(null);
  };

  const deleteTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div className="min-h-screen bg-background p-6 animate-fadeIn">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="flex items-center justify-between">
          <h1 className="text-4xl font-bold tracking-tight">Finance Personnel</h1>
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
            <Button
              onClick={() => setShowTransactionForm(true)}
              className="flex items-center gap-2"
            >
              <PlusCircle className="w-5 h-5" />
              Nouvelle Transaction
            </Button>
          </div>
        </header>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Dashboard transactions={transactions} />
        </div>

        <Card className="p-6">
          <TransactionList
            transactions={transactions}
            onEdit={setEditingTransaction}
            onDelete={deleteTransaction}
          />
        </Card>

        {(showTransactionForm || editingTransaction) && (
          <TransactionForm
            transaction={editingTransaction}
            onSubmit={editingTransaction ? updateTransaction : addTransaction}
            onClose={() => {
              setShowTransactionForm(false);
              setEditingTransaction(null);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default Index;

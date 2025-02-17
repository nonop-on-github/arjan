
import { useState } from "react";
import { Transaction } from "@/types/finance";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import TransactionForm from "@/components/TransactionForm";
import Dashboard from "@/components/Dashboard";
import TransactionList from "@/components/TransactionList";

const Index = () => {
  const [showTransactionForm, setShowTransactionForm] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const addTransaction = (transaction: Transaction) => {
    setTransactions((prev) => [transaction, ...prev]);
    setShowTransactionForm(false);
  };

  return (
    <div className="min-h-screen bg-background p-6 animate-fadeIn">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="flex items-center justify-between">
          <h1 className="text-4xl font-bold tracking-tight">Finance Personnel</h1>
          <Button
            onClick={() => setShowTransactionForm(true)}
            className="flex items-center gap-2"
          >
            <PlusCircle className="w-5 h-5" />
            Nouvelle Transaction
          </Button>
        </header>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Dashboard transactions={transactions} />
        </div>

        <Card className="p-6">
          <TransactionList transactions={transactions} />
        </Card>

        {showTransactionForm && (
          <TransactionForm
            onSubmit={addTransaction}
            onClose={() => setShowTransactionForm(false)}
          />
        )}
      </div>
    </div>
  );
};

export default Index;

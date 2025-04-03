
import { useState, useEffect } from "react";
import { Transaction } from "@/types/finance";
import { Card } from "@/components/ui/card";
import TransactionForm from "@/components/TransactionForm";
import Dashboard from "@/components/Dashboard";
import TransactionList from "@/components/TransactionList";
import Header from "@/components/Header";
import IncomeConfetti from "@/components/IncomeConfetti";
import { useTheme } from "next-themes";
import { useTransactions } from "@/hooks/useTransactions";

const Index = () => {
  const [showTransactionForm, setShowTransactionForm] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [mounted, setMounted] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const { setTheme, theme } = useTheme();
  const { transactions, isLoading, addTransaction, updateTransaction, deleteTransaction } = useTransactions();

  // Utilisé pour éviter l'hydration mismatch avec next-themes
  useEffect(() => {
    setMounted(true);
  }, []);

  // Effet pour synchroniser avec le thème système
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = (e: MediaQueryListEvent) => {
        setTheme(e.matches ? 'dark' : 'light');
      };
      
      // Initial setup
      setTheme(mediaQuery.matches ? 'dark' : 'light');
      
      // Listen for changes
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [setTheme]);

  const handleSubmitTransaction = async (transaction: Transaction) => {
    const success = editingTransaction 
      ? await updateTransaction(transaction)
      : await addTransaction(transaction);
    
    if (success) {
      // Montrer les confettis uniquement pour les nouveaux revenus
      if (!editingTransaction && transaction.type === "income") {
        setShowConfetti(true);
      }
      
      setShowTransactionForm(false);
      setEditingTransaction(null);
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background p-6 animate-fadeIn">
      <div className="max-w-7xl mx-auto space-y-8">
        <Header onNewTransaction={() => setShowTransactionForm(true)} />

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
            onSubmit={handleSubmitTransaction}
            onClose={() => {
              setShowTransactionForm(false);
              setEditingTransaction(null);
            }}
          />
        )}
        
        <IncomeConfetti 
          show={showConfetti} 
          onComplete={() => setShowConfetti(false)} 
        />
      </div>
    </div>
  );
};

export default Index;

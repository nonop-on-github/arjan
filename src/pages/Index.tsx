
import { useState, useEffect } from "react";
import { Transaction } from "@/types/finance";
import { PlusCircle, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import TransactionForm from "@/components/TransactionForm";
import Dashboard from "@/components/Dashboard";
import TransactionList from "@/components/TransactionList";
import { useTheme } from "next-themes";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

const Index = () => {
  const [showTransactionForm, setShowTransactionForm] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Utilisé pour éviter l'hydration mismatch avec next-themes
  useEffect(() => {
    setMounted(true);
  }, []);

  // Charger les transactions au démarrage
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const { data, error } = await supabase
          .from('transactions')
          .select('*')
          .order('date', { ascending: false });

        if (error) throw error;

        const formattedTransactions: Transaction[] = data.map(t => ({
          id: t.id,
          amount: Number(t.amount),
          type: t.type,
          date: new Date(t.date),
          description: t.description,
          category: t.category,
          isRecurring: t.is_recurring,
          frequency: t.frequency || undefined,
          nextDate: t.next_date ? new Date(t.next_date) : undefined,
          endDate: t.end_date ? new Date(t.end_date) : undefined,
        }));

        setTransactions(formattedTransactions);
      } catch (error) {
        console.error('Error fetching transactions:', error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les transactions",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactions();
  }, [toast]);

  const addTransaction = async (transaction: Transaction) => {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .insert({
          amount: transaction.amount,
          type: transaction.type,
          date: transaction.date.toISOString().split('T')[0],
          description: transaction.description,
          category: transaction.category,
          is_recurring: transaction.isRecurring,
          frequency: transaction.frequency,
          next_date: transaction.nextDate?.toISOString().split('T')[0],
          end_date: transaction.endDate?.toISOString().split('T')[0],
        })
        .select()
        .single();

      if (error) throw error;

      const newTransaction: Transaction = {
        id: data.id,
        amount: Number(data.amount),
        type: data.type,
        date: new Date(data.date),
        description: data.description,
        category: data.category,
        isRecurring: data.is_recurring,
        frequency: data.frequency || undefined,
        nextDate: data.next_date ? new Date(data.next_date) : undefined,
        endDate: data.end_date ? new Date(data.end_date) : undefined,
      };

      setTransactions(prev => 
        [...prev, newTransaction].sort((a, b) => b.date.getTime() - a.date.getTime())
      );
      setShowTransactionForm(false);
      toast({
        title: "Succès",
        description: "Transaction ajoutée",
      });
    } catch (error) {
      console.error('Error adding transaction:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter la transaction",
        variant: "destructive",
      });
    }
  };

  const updateTransaction = async (updatedTransaction: Transaction) => {
    try {
      const { error } = await supabase
        .from('transactions')
        .update({
          amount: updatedTransaction.amount,
          type: updatedTransaction.type,
          date: updatedTransaction.date.toISOString().split('T')[0],
          description: updatedTransaction.description,
          category: updatedTransaction.category,
          is_recurring: updatedTransaction.isRecurring,
          frequency: updatedTransaction.frequency,
          next_date: updatedTransaction.nextDate?.toISOString().split('T')[0],
          end_date: updatedTransaction.endDate?.toISOString().split('T')[0],
        })
        .eq('id', updatedTransaction.id);

      if (error) throw error;

      setTransactions(prev =>
        prev
          .map((t) => (t.id === updatedTransaction.id ? updatedTransaction : t))
          .sort((a, b) => b.date.getTime() - a.date.getTime())
      );
      setEditingTransaction(null);
      toast({
        title: "Succès",
        description: "Transaction mise à jour",
      });
    } catch (error) {
      console.error('Error updating transaction:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour la transaction",
        variant: "destructive",
      });
    }
  };

  const deleteTransaction = async (id: string) => {
    try {
      const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setTransactions(prev => prev.filter((t) => t.id !== id));
      toast({
        title: "Succès",
        description: "Transaction supprimée",
      });
    } catch (error) {
      console.error('Error deleting transaction:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la transaction",
        variant: "destructive",
      });
    }
  };

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

  if (!mounted) {
    return null;
  }

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

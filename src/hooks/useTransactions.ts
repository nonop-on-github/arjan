
import { useState, useEffect } from "react";
import { Transaction } from "@/types/finance";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useAuthContext } from "@/contexts/AuthContext";
import { Database } from "@/integrations/supabase/types";

// Type for database transactions
type DbTransaction = Database['public']['Tables']['transactions']['Row'];

export const useTransactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuthContext();

  const fetchTransactions = async () => {
    if (!user) {
      setTransactions([]);
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false }) as { 
          data: DbTransaction[] | null; 
          error: Error | null 
        };

      if (error) throw error;

      const formattedTransactions: Transaction[] = data ? data.map(t => ({
        id: t.id,
        amount: Number(t.amount),
        type: t.type,
        date: new Date(t.date),
        description: t.description,
        category: t.category,
        channelId: t.channel_id || "default-card", // Valeur par défaut pour la compatibilité
        isRecurring: t.is_recurring ?? false,
        frequency: t.frequency || undefined,
        nextDate: t.next_date ? new Date(t.next_date) : undefined,
        endDate: t.end_date ? new Date(t.end_date) : undefined,
      })) : [];

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

  const addTransaction = async (transaction: Transaction) => {
    if (!user) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour ajouter une transaction",
        variant: "destructive",
      });
      return false;
    }

    try {
      const { data, error } = await supabase
        .from('transactions')
        .insert({
          user_id: user.id,
          amount: transaction.amount,
          type: transaction.type,
          date: transaction.date.toISOString().split('T')[0],
          description: transaction.description,
          category: transaction.category,
          channel_id: transaction.channelId,
          is_recurring: transaction.isRecurring,
          frequency: transaction.frequency,
          next_date: transaction.nextDate?.toISOString().split('T')[0],
          end_date: transaction.endDate?.toISOString().split('T')[0],
        })
        .select()
        .single() as {
          data: DbTransaction | null;
          error: Error | null;
        };

      if (error) throw error;

      if (data) {
        const newTransaction: Transaction = {
          id: data.id,
          amount: Number(data.amount),
          type: data.type,
          date: new Date(data.date),
          description: data.description,
          category: data.category,
          channelId: data.channel_id || "default-card",
          isRecurring: data.is_recurring ?? false,
          frequency: data.frequency || undefined,
          nextDate: data.next_date ? new Date(data.next_date) : undefined,
          endDate: data.end_date ? new Date(data.end_date) : undefined,
        };

        setTransactions(prev => 
          [...prev, newTransaction].sort((a, b) => b.date.getTime() - a.date.getTime())
        );
        toast({
          title: "Succès",
          description: "Transaction ajoutée",
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error adding transaction:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter la transaction",
        variant: "destructive",
      });
      return false;
    }
  };

  const updateTransaction = async (updatedTransaction: Transaction) => {
    if (!user) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour mettre à jour une transaction",
        variant: "destructive",
      });
      return false;
    }

    try {
      const { error } = await supabase
        .from('transactions')
        .update({
          amount: updatedTransaction.amount,
          type: updatedTransaction.type,
          date: updatedTransaction.date.toISOString().split('T')[0],
          description: updatedTransaction.description,
          category: updatedTransaction.category,
          channel_id: updatedTransaction.channelId,
          is_recurring: updatedTransaction.isRecurring,
          frequency: updatedTransaction.frequency,
          next_date: updatedTransaction.nextDate?.toISOString().split('T')[0],
          end_date: updatedTransaction.endDate?.toISOString().split('T')[0],
        })
        .eq('id', updatedTransaction.id)
        .eq('user_id', user.id);

      if (error) throw error;

      setTransactions(prev =>
        prev
          .map((t) => (t.id === updatedTransaction.id ? updatedTransaction : t))
          .sort((a, b) => b.date.getTime() - a.date.getTime())
      );
      toast({
        title: "Succès",
        description: "Transaction mise à jour",
      });
      return true;
    } catch (error) {
      console.error('Error updating transaction:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour la transaction",
        variant: "destructive",
      });
      return false;
    }
  };

  const deleteTransaction = async (id: string) => {
    if (!user) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour supprimer une transaction",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

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

  useEffect(() => {
    if (user) {
      fetchTransactions();
    } else {
      setTransactions([]);
      setIsLoading(false);
    }
  }, [user]);

  return {
    transactions,
    isLoading,
    addTransaction,
    updateTransaction,
    deleteTransaction
  };
};

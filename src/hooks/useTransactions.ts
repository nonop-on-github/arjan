
import { useState, useEffect } from "react";
import { Transaction } from "@/types/finance";
import { useToast } from "@/components/ui/use-toast";
import { useAuthContext } from "@/contexts/AuthContext";
import { 
  fetchUserTransactions, 
  addUserTransaction, 
  updateUserTransaction, 
  deleteUserTransaction,
  formatDbTransaction
} from "@/services/transactionService";

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
      const data = await fetchUserTransactions(user.id);
      const formattedTransactions = data.map(formatDbTransaction);
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
      const data = await addUserTransaction(transaction, user.id);
      const newTransaction = formatDbTransaction(data);

      setTransactions(prev => 
        [...prev, newTransaction].sort((a, b) => b.date.getTime() - a.date.getTime())
      );
      
      toast({
        title: "Succès",
        description: "Transaction ajoutée",
      });
      return true;
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
      await updateUserTransaction(updatedTransaction, user.id);
      
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
      await deleteUserTransaction(id, user.id);
      
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

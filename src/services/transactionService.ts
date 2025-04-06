
import { supabase } from "@/integrations/supabase/client";
import { DbTransaction, DbInsertTransaction } from "@/types/supabaseTypes";
import { Transaction } from "@/types/finance";

// Format transaction data from the database to application model
export const formatDbTransaction = (t: DbTransaction): Transaction => ({
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
});

// Format transaction from application model to database format
export const formatTransactionForDb = (transaction: Transaction, userId: string): DbInsertTransaction => ({
  user_id: userId,
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
});

// Fetch all transactions for a user
export const fetchUserTransactions = async (userId: string) => {
  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: false });
    
  if (error) throw error;
  return data as DbTransaction[];
};

// Add a new transaction
export const addUserTransaction = async (transaction: Transaction, userId: string) => {
  const { data, error } = await supabase
    .from('transactions')
    .insert(formatTransactionForDb(transaction, userId))
    .select()
    .single();
    
  if (error) throw error;
  return data as DbTransaction;
};

// Update an existing transaction
export const updateUserTransaction = async (transaction: Transaction, userId: string) => {
  const { error } = await supabase
    .from('transactions')
    .update(formatTransactionForDb(transaction, userId))
    .eq('id', transaction.id)
    .eq('user_id', userId);
    
  if (error) throw error;
  return true;
};

// Delete a transaction
export const deleteUserTransaction = async (transactionId: string, userId: string) => {
  const { error } = await supabase
    .from('transactions')
    .delete()
    .eq('id', transactionId)
    .eq('user_id', userId);
    
  if (error) throw error;
  return true;
};

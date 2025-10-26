
import { supabase } from "@/integrations/supabase/client";
import { DbTransaction, DbInsertTransaction } from "@/types/supabaseTypes";
import { Transaction } from "@/types/finance";
import { transactionSchema } from "@/lib/validationSchemas";

// Format transaction data from the database to application model
export const formatDbTransaction = (t: DbTransaction): Transaction => ({
  id: t.id,
  amount: Number(t.amount),
  type: t.type,
  date: new Date(t.date),
  description: t.description || "",
  category: t.category_id || "",
  channelId: t.channel_id || "",
  isRecurring: t.is_recurring ?? false,
  frequency: t.recurring_frequency || undefined,
  nextDate: undefined, // This field is not in the database
  endDate: t.recurring_end_date ? new Date(t.recurring_end_date) : undefined,
});

// Format transaction from application model to database format
export const formatTransactionForDb = (transaction: Transaction, userId: string): DbInsertTransaction => ({
  user_id: userId,
  amount: transaction.amount,
  type: transaction.type,
  date: transaction.date.toISOString().split('T')[0],
  description: transaction.description,
  category_id: transaction.category || null,
  channel_id: transaction.channelId || null,
  is_recurring: transaction.isRecurring,
  recurring_frequency: transaction.frequency || null,
  recurring_end_date: transaction.endDate?.toISOString().split('T')[0] || null,
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
  // Validate input
  transactionSchema.parse(transaction);
  
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
  // Validate input
  transactionSchema.parse(transaction);
  
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

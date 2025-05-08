
import { supabase } from "@/integrations/supabase/client";
import { DbBudget, DbInsertBudget } from "@/types/supabaseTypes";
import { Budget } from "@/types/budget";

// Format budget data from the database to application model
export const formatDbBudget = (b: DbBudget): Budget => ({
  id: b.id,
  category: b.category,
  amount: Number(b.amount),
  period: b.period as 'monthly' | 'yearly',
  startDate: new Date(b.start_date),
});

// Format budget from application model to database format
export const formatBudgetForDb = (budget: Budget, userId: string): DbInsertBudget => ({
  user_id: userId,
  category: budget.category,
  amount: budget.amount,
  period: budget.period,
  start_date: budget.startDate.toISOString().split('T')[0],
});

// Fetch all budgets for a user
export const fetchUserBudgets = async (userId: string) => {
  const { data, error } = await supabase
    .from('budgets')
    .select('*')
    .eq('user_id', userId);
    
  if (error) throw error;
  return data as DbBudget[];
};

// Add a new budget
export const addUserBudget = async (budget: Budget, userId: string) => {
  const { data, error } = await supabase
    .from('budgets')
    .insert(formatBudgetForDb(budget, userId))
    .select()
    .single();
    
  if (error) throw error;
  return data as DbBudget;
};

// Update an existing budget
export const updateUserBudget = async (budget: Budget, userId: string) => {
  const { error } = await supabase
    .from('budgets')
    .update(formatBudgetForDb(budget, userId))
    .eq('id', budget.id)
    .eq('user_id', userId);
    
  if (error) throw error;
  return true;
};

// Delete a budget
export const deleteUserBudget = async (budgetId: string, userId: string) => {
  const { error } = await supabase
    .from('budgets')
    .delete()
    .eq('id', budgetId)
    .eq('user_id', userId);
    
  if (error) throw error;
  return true;
};


import { Database } from "@/integrations/supabase/types";

// Type for database channels
export type DbChannel = Database['public']['Tables']['channels']['Row'];
export type DbInsertChannel = Database['public']['Tables']['channels']['Insert'];
export type DbUpdateChannel = Database['public']['Tables']['channels']['Update'];

// Type for database transactions
export type DbTransaction = Database['public']['Tables']['transactions']['Row'];
export type DbInsertTransaction = Database['public']['Tables']['transactions']['Insert'];
export type DbUpdateTransaction = Database['public']['Tables']['transactions']['Update'];

// Type for database budgets
export type DbBudget = Database['public']['Tables']['budgets']['Row'];
export type DbInsertBudget = Database['public']['Tables']['budgets']['Insert'];
export type DbUpdateBudget = Database['public']['Tables']['budgets']['Update'];

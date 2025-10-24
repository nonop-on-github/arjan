-- Create profiles table for user data
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name TEXT,
  last_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles RLS policies
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, first_name, last_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'first_name', SPLIT_PART(NEW.raw_user_meta_data->>'full_name', ' ', 1)),
    COALESCE(NEW.raw_user_meta_data->>'last_name', SPLIT_PART(NEW.raw_user_meta_data->>'full_name', ' ', 2))
  );
  RETURN NEW;
END;
$$;

-- Trigger to create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create categories table
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  emoji TEXT NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on categories
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- Categories RLS policies
CREATE POLICY "Users can view their own categories"
  ON public.categories FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own categories"
  ON public.categories FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own categories"
  ON public.categories FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own categories"
  ON public.categories FOR DELETE
  USING (auth.uid() = user_id);

-- Create channels table
CREATE TABLE public.channels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  icon TEXT NOT NULL,
  color TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on channels
ALTER TABLE public.channels ENABLE ROW LEVEL SECURITY;

-- Channels RLS policies
CREATE POLICY "Users can view their own channels"
  ON public.channels FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own channels"
  ON public.channels FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own channels"
  ON public.channels FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own channels"
  ON public.channels FOR DELETE
  USING (auth.uid() = user_id);

-- Create transaction type enum
CREATE TYPE public.transaction_type AS ENUM ('income', 'expense');

-- Create transaction frequency enum
CREATE TYPE public.transaction_frequency AS ENUM ('daily', 'weekly', 'monthly', 'yearly');

-- Create transactions table
CREATE TABLE public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount DECIMAL(10, 2) NOT NULL,
  type public.transaction_type NOT NULL,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  channel_id UUID REFERENCES public.channels(id) ON DELETE SET NULL,
  description TEXT,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  is_recurring BOOLEAN NOT NULL DEFAULT false,
  recurring_frequency public.transaction_frequency,
  recurring_end_date DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on transactions
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- Transactions RLS policies
CREATE POLICY "Users can view their own transactions"
  ON public.transactions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own transactions"
  ON public.transactions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own transactions"
  ON public.transactions FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own transactions"
  ON public.transactions FOR DELETE
  USING (auth.uid() = user_id);

-- Create budgets table
CREATE TABLE public.budgets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  category_id UUID REFERENCES public.categories(id) ON DELETE CASCADE,
  amount DECIMAL(10, 2) NOT NULL,
  period TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on budgets
ALTER TABLE public.budgets ENABLE ROW LEVEL SECURITY;

-- Budgets RLS policies
CREATE POLICY "Users can view their own budgets"
  ON public.budgets FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own budgets"
  ON public.budgets FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own budgets"
  ON public.budgets FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own budgets"
  ON public.budgets FOR DELETE
  USING (auth.uid() = user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Trigger for profiles updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger for transactions updated_at
CREATE TRIGGER update_transactions_updated_at
  BEFORE UPDATE ON public.transactions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger for budgets updated_at
CREATE TRIGGER update_budgets_updated_at
  BEFORE UPDATE ON public.budgets
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
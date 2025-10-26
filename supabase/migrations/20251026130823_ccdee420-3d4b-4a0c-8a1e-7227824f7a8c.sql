-- Create a secure database function for account deletion
CREATE OR REPLACE FUNCTION delete_user_account()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id uuid := auth.uid();
BEGIN
  -- Check if user is authenticated
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'User not authenticated';
  END IF;

  -- All deletions in single atomic transaction
  DELETE FROM transactions WHERE user_id = v_user_id;
  DELETE FROM categories WHERE user_id = v_user_id;
  DELETE FROM budgets WHERE user_id = v_user_id;
  DELETE FROM channels WHERE user_id = v_user_id;
  DELETE FROM profiles WHERE user_id = v_user_id;
END;
$$;
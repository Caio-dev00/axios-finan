-- Enable Row Level Security
ALTER TABLE public.incomes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;

-- Create policies for incomes table
CREATE POLICY "Users can only access their own incomes"
  ON public.incomes
  FOR ALL
  USING (auth.uid() = user_id);

-- Create policies for expenses table
CREATE POLICY "Users can only access their own expenses"
  ON public.expenses
  FOR ALL
  USING (auth.uid() = user_id);

-- Create function to handle new records
CREATE OR REPLACE FUNCTION public.handle_new_record()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.user_id IS NULL THEN
    NEW.user_id = auth.uid();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create triggers for incomes table
DROP TRIGGER IF EXISTS on_incomes_insert ON public.incomes;
CREATE TRIGGER on_incomes_insert
  BEFORE INSERT ON public.incomes
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_record();

-- Create triggers for expenses table
DROP TRIGGER IF EXISTS on_expenses_insert ON public.expenses;
CREATE TRIGGER on_expenses_insert
  BEFORE INSERT ON public.expenses
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_record();

-- Add user_id column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'incomes' 
    AND column_name = 'user_id'
  ) THEN
    ALTER TABLE public.incomes ADD COLUMN user_id UUID REFERENCES auth.users(id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'expenses' 
    AND column_name = 'user_id'
  ) THEN
    ALTER TABLE public.expenses ADD COLUMN user_id UUID REFERENCES auth.users(id);
  END IF;
END $$; 
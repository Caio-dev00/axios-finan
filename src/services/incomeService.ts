import { supabase } from "@/integrations/supabase/client";

export interface Income {
  id?: string;
  description: string;
  amount: number;
  source: string;
  date: Date;
  is_recurring?: boolean;
}

export const addIncome = async (income: Income) => {
  const { data, error } = await supabase.from("incomes").insert({
    user_id: (await supabase.auth.getUser()).data.user?.id,
    description: income.description,
    amount: income.amount,
    source: income.source,
    date: income.date.toISOString().split("T")[0],
    is_recurring: income.is_recurring || false,
  }).select();

  if (error) throw error;
  return data?.[0];
};

export const updateIncome = async (income: Income) => {
  const { data, error } = await supabase
    .from("incomes")
    .update({
      description: income.description,
      amount: income.amount,
      source: income.source,
      date: new Date(income.date).toISOString().split("T")[0],
      is_recurring: income.is_recurring || false,
    })
    .eq("id", income.id)
    .select();

  if (error) throw error;
  return data?.[0];
};

export const deleteIncome = async (id: string) => {
  const { error } = await supabase
    .from("incomes")
    .delete()
    .eq("id", id);

  if (error) throw error;
  return true;
};

export const getIncomes = async () => {
  const { data: userData } = await supabase.auth.getUser();
  const userId = userData.user?.id;

  const { data, error } = await supabase
    .from("incomes")
    .select("*")
    .eq("user_id", userId)
    .order("date", { ascending: false });

  if (error) throw error;
  return data.map(income => ({
    ...income,
    date: new Date(income.date),
    amount: Number.parseFloat(income.amount.toString()),
  }));
};

export const getRecentIncomes = async (limit = 3) => {
  const { data: userData } = await supabase.auth.getUser();
  const userId = userData.user?.id;

  const { data, error } = await supabase
    .from("incomes")
    .select("*")
    .eq("user_id", userId)
    .order("date", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data.map(income => ({
    ...income,
    date: new Date(income.date),
    amount: Number.parseFloat(income.amount.toString()),
  }));
};

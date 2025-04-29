
import { supabase } from "@/integrations/supabase/client";

export interface Expense {
  id?: string;
  description: string;
  amount: number;
  category: string;
  date: Date;
  notes?: string;
  is_recurring?: boolean;
}

export const addExpense = async (expense: Expense) => {
  const { data, error } = await supabase.from("expenses").insert({
    user_id: (await supabase.auth.getUser()).data.user?.id,
    description: expense.description,
    amount: expense.amount,
    category: expense.category,
    date: expense.date.toISOString().split("T")[0],
    notes: expense.notes || null,
    is_recurring: expense.is_recurring || false,
  }).select();

  if (error) throw error;
  return data?.[0];
};

export const getExpenses = async () => {
  const { data, error } = await supabase
    .from("expenses")
    .select("*")
    .order("date", { ascending: false });

  if (error) throw error;
  return data.map(expense => ({
    ...expense,
    date: new Date(expense.date),
  }));
};

export const getRecentExpenses = async (limit = 3) => {
  const { data, error } = await supabase
    .from("expenses")
    .select("*")
    .order("date", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data.map(expense => ({
    ...expense,
    date: new Date(expense.date),
  }));
};

export const getExpensesByCategory = async () => {
  const { data, error } = await supabase
    .from("expenses")
    .select("category, amount");

  if (error) throw error;

  // Calcular total por categoria
  const categories: { [key: string]: number } = {};
  let total = 0;
  
  data.forEach(expense => {
    const { category, amount } = expense;
    if (!categories[category]) {
      categories[category] = 0;
    }
    categories[category] += parseFloat(amount);
    total += parseFloat(amount);
  });

  // Converter para porcentagens
  return Object.keys(categories).map(category => ({
    name: category,
    amount: categories[category],
    percentage: Math.round((categories[category] / total) * 100),
  }));
};

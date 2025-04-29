
import { supabase } from "@/integrations/supabase/client";

export interface Budget {
  id?: string;
  category: string;
  amount: number;
  month: number;
  year: number;
}

export const addBudget = async (budget: Budget) => {
  const { data, error } = await supabase.from("budgets").insert({
    user_id: (await supabase.auth.getUser()).data.user?.id,
    category: budget.category,
    amount: budget.amount,
    month: budget.month,
    year: budget.year,
  }).select();

  if (error) throw error;
  return data?.[0];
};

export const getBudgets = async (month?: number, year?: number) => {
  let query = supabase
    .from("budgets")
    .select("*");

  if (month && year) {
    query = query.eq("month", month).eq("year", year);
  }

  const { data, error } = await query.order("category");

  if (error) throw error;
  return data;
};

export const getCurrentMonthBudgets = async () => {
  const currentDate = new Date();
  const month = currentDate.getMonth() + 1;
  const year = currentDate.getFullYear();

  return getBudgets(month, year);
};

export const getExpensesForBudget = async (month?: number, year?: number) => {
  const currentDate = new Date();
  const currentMonth = month || currentDate.getMonth() + 1;
  const currentYear = year || currentDate.getFullYear();

  // Criar data de início e fim do mês
  const startDate = `${currentYear}-${String(currentMonth).padStart(2, '0')}-01`;
  const endDate = new Date(currentYear, currentMonth, 0).toISOString().split('T')[0];

  const { data, error } = await supabase
    .from("expenses")
    .select("category, amount")
    .gte("date", startDate)
    .lte("date", endDate);

  if (error) throw error;

  // Somar despesas por categoria
  const expensesByCategory: { [key: string]: number } = {};
  
  data.forEach(expense => {
    const { category, amount } = expense;
    if (!expensesByCategory[category]) {
      expensesByCategory[category] = 0;
    }
    expensesByCategory[category] += parseFloat(amount);
  });

  return expensesByCategory;
};

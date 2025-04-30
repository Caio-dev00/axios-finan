
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

export const updateExpense = async (expense: Expense) => {
  const { data, error } = await supabase
    .from("expenses")
    .update({
      description: expense.description,
      amount: expense.amount,
      category: expense.category,
      date: new Date(expense.date).toISOString().split("T")[0],
      notes: expense.notes || null,
      is_recurring: expense.is_recurring || false,
    })
    .eq("id", expense.id)
    .select();

  if (error) throw error;
  return data?.[0];
};

export const deleteExpense = async (id: string) => {
  const { error } = await supabase
    .from("expenses")
    .delete()
    .eq("id", id);

  if (error) throw error;
  return true;
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
    amount: parseFloat(expense.amount as any),
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
    amount: parseFloat(expense.amount as any),
  }));
};

export const getExpensesByCategory = async () => {
  // Check if we're on the demo page
  const isDemo = window.location.pathname.includes('saiba-mais');
  
  if (isDemo) {
    return getDemoExpenseCategories();
  }
  
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
    categories[category] += parseFloat(amount as any);
    total += parseFloat(amount as any);
  });

  // Converter para porcentagens
  return Object.keys(categories).map(category => ({
    name: category,
    amount: categories[category],
    percentage: Math.round((categories[category] / total) * 100),
  }));
};

// Function to generate demo data for expense categories
export const getDemoExpenseCategories = () => {
  return [
    { name: "Moradia", amount: 1500, percentage: 30 },
    { name: "Alimentação", amount: 1000, percentage: 20 },
    { name: "Transporte", amount: 750, percentage: 15 },
    { name: "Lazer", amount: 500, percentage: 10 },
    { name: "Saúde", amount: 400, percentage: 8 },
    { name: "Educação", amount: 350, percentage: 7 },
    { name: "Serviços", amount: 300, percentage: 6 },
    { name: "Outros", amount: 200, percentage: 4 }
  ];
};

import { supabase } from "@/integrations/supabase/client";
import { format, startOfMonth, endOfMonth, subMonths } from "date-fns";

export interface FinancialSummary {
  currentBalance: number;
  totalIncome: number;
  totalExpense: number;
  incomeChange: number;
  expenseChange: number;
  lastUpdate: Date;
}

export interface Transaction {
  id: string;
  name: string; 
  category: string;
  amount: number;
  date: string;
  type: 'income' | 'expense';
}

export interface MonthlyData {
  name: string; // Nome do mês
  despesas: number;
  receitas: number;
}

export interface CategoryData {
  name: string;
  valor: number;
}

export interface CashFlowData {
  name: string;
  fluxo: number;
}

export interface ExpenseCategory {
  name: string;
  count?: number;
}

export const getFinancialSummary = async (): Promise<FinancialSummary> => {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  // Define o período para o mês atual
  const currentMonthStart = startOfMonth(now);
  const currentMonthEnd = endOfMonth(now);
  
  // Define o período para o mês anterior
  const lastMonth = new Date(currentYear, currentMonth - 1, 1);
  const lastMonthStart = startOfMonth(lastMonth);
  const lastMonthEnd = endOfMonth(lastMonth);

  // Formato as datas para ISO strings para usar com o Supabase
  const currentStartStr = format(currentMonthStart, "yyyy-MM-dd");
  const currentEndStr = format(currentMonthEnd, "yyyy-MM-dd");
  const lastStartStr = format(lastMonthStart, "yyyy-MM-dd");
  const lastEndStr = format(lastMonthEnd, "yyyy-MM-dd");

  // Obter receitas do mês atual
  const { data: currentIncomes, error: incomeError } = await supabase
    .from("incomes")
    .select("amount")
    .gte("date", currentStartStr)
    .lte("date", currentEndStr);

  if (incomeError) throw incomeError;

  // Obter despesas do mês atual
  const { data: currentExpenses, error: expenseError } = await supabase
    .from("expenses")
    .select("amount")
    .gte("date", currentStartStr)
    .lte("date", currentEndStr);

  if (expenseError) throw expenseError;

  // Obter receitas do mês anterior
  const { data: lastMonthIncomes, error: lastIncomeError } = await supabase
    .from("incomes")
    .select("amount")
    .gte("date", lastStartStr)
    .lte("date", lastEndStr);

  if (lastIncomeError) throw lastIncomeError;

  // Obter despesas do mês anterior
  const { data: lastMonthExpenses, error: lastExpenseError } = await supabase
    .from("expenses")
    .select("amount")
    .gte("date", lastStartStr)
    .lte("date", lastEndStr);

  if (lastExpenseError) throw lastExpenseError;

  // Calcular totais
  const totalIncome = currentIncomes.reduce((sum, record) => sum + parseFloat(record.amount.toString()), 0);
  const totalExpense = currentExpenses.reduce((sum, record) => sum + parseFloat(record.amount.toString()), 0);
  const lastMonthTotalIncome = lastMonthIncomes.reduce((sum, record) => sum + parseFloat(record.amount.toString()), 0);
  const lastMonthTotalExpense = lastMonthExpenses.reduce((sum, record) => sum + parseFloat(record.amount.toString()), 0);

  // Calcular variações percentuais
  const incomeChange = lastMonthTotalIncome === 0 ? 0 : Math.round(((totalIncome - lastMonthTotalIncome) / lastMonthTotalIncome) * 100);
  const expenseChange = lastMonthTotalExpense === 0 ? 0 : Math.round(((totalExpense - lastMonthTotalExpense) / lastMonthTotalExpense) * 100);
  
  return {
    currentBalance: totalIncome - totalExpense,
    totalIncome,
    totalExpense,
    incomeChange,
    expenseChange,
    lastUpdate: now
  };
};

export const getRecentTransactions = async (limit = 4): Promise<Transaction[]> => {
  // Buscar as receitas mais recentes
  const { data: incomesData, error: incomeError } = await supabase
    .from("incomes")
    .select("id, description, source, amount, date")
    .order("date", { ascending: false })
    .limit(limit);

  if (incomeError) throw incomeError;

  // Buscar as despesas mais recentes
  const { data: expensesData, error: expenseError } = await supabase
    .from("expenses")
    .select("id, description, category, amount, date")
    .order("date", { ascending: false })
    .limit(limit);

  if (expenseError) throw expenseError;

  // Formatar receitas para o formato de transação
  const incomes = incomesData.map(income => ({
    id: income.id,
    name: income.description,
    category: income.source,
    amount: parseFloat(income.amount.toString()),
    date: income.date,
    type: 'income' as const
  }));

  // Formatar despesas para o formato de transação
  const expenses = expensesData.map(expense => ({
    id: expense.id,
    name: expense.description,
    category: expense.category,
    amount: parseFloat(expense.amount.toString()),
    date: expense.date,
    type: 'expense' as const
  }));

  // Combinar e ordenar por data
  const transactions = [...incomes, ...expenses]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limit)
    .map((transaction) => {
      // Formatar a data para exibição
      const transactionDate = new Date(transaction.date);
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      
      let formattedDate;
      if (transactionDate.toDateString() === today.toDateString()) {
        formattedDate = "Hoje";
      } else if (transactionDate.toDateString() === yesterday.toDateString()) {
        formattedDate = "Ontem";
      } else {
        formattedDate = transactionDate.toLocaleDateString('pt-BR');
      }
      
      // Adicionar o horário (fictício para melhorar a experiência do usuário)
      const hours = Math.floor(Math.random() * 24);
      const minutes = Math.floor(Math.random() * 60);
      formattedDate += `, ${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
      
      return {
        ...transaction,
        date: formattedDate
      };
    });

  return transactions;
};

// Nova função para obter dados para relatórios
export const getReportData = async () => {
  const now = new Date();
  const monthlyData: MonthlyData[] = [];
  const categoryData: CategoryData[] = [];
  const cashFlowData: CashFlowData[] = [];
  
  // Buscar dados dos últimos 6 meses
  for (let i = 5; i >= 0; i--) {
    const targetDate = subMonths(now, i);
    const monthStart = startOfMonth(targetDate);
    const monthEnd = endOfMonth(targetDate);
    const monthName = format(targetDate, 'MMM');
    
    const startStr = format(monthStart, "yyyy-MM-dd");
    const endStr = format(monthEnd, "yyyy-MM-dd");
    
    // Buscar receitas do mês
    const { data: monthIncomes } = await supabase
      .from("incomes")
      .select("amount")
      .gte("date", startStr)
      .lte("date", endStr);
      
    // Buscar despesas do mês
    const { data: monthExpenses } = await supabase
      .from("expenses")
      .select("amount")
      .gte("date", startStr)
      .lte("date", endStr);
      
    // Calcular totais
    const totalIncome = monthIncomes?.reduce(
      (sum, record) => sum + parseFloat(record.amount.toString()), 
      0
    ) || 0;
    
    const totalExpense = monthExpenses?.reduce(
      (sum, record) => sum + parseFloat(record.amount.toString()), 
      0
    ) || 0;
    
    monthlyData.push({
      name: monthName,
      receitas: totalIncome,
      despesas: totalExpense
    });
    
    cashFlowData.push({
      name: monthName,
      fluxo: totalIncome - totalExpense
    });
  }
  
  // Buscar categorias de despesas
  const { data: expensesByCategory } = await supabase
    .from("expenses")
    .select("category, amount");
    
  // Calcular total por categoria
  const categories: Record<string, number> = {};
  
  expensesByCategory?.forEach(expense => {
    const category = expense.category;
    const amount = parseFloat(expense.amount.toString());
    
    if (!categories[category]) {
      categories[category] = 0;
    }
    categories[category] += amount;
  });
  
  Object.entries(categories).forEach(([name, valor]) => {
    categoryData.push({ name, valor });
  });
  
  return { monthlyData, categoryData, cashFlowData };
};

// Função para obter todas as categorias de despesas
export const getExpenseCategories = async (): Promise<ExpenseCategory[]> => {
  // Buscar todas as categorias usadas em despesas
  const { data, error } = await supabase
    .from("expenses")
    .select("category");

  if (error) throw error;
  
  if (!data || data.length === 0) {
    return [];
  }

  // Calcular quantas vezes cada categoria é usada
  const categoryCounts: Record<string, number> = {};
  data.forEach(item => {
    if (!categoryCounts[item.category]) {
      categoryCounts[item.category] = 0;
    }
    categoryCounts[item.category]++;
  });

  // Converter para array e ordenar por frequência de uso (mais usadas primeiro)
  return Object.entries(categoryCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
};

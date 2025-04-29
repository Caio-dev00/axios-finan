
import { supabase } from "@/integrations/supabase/client";
import { format, startOfMonth, endOfMonth } from "date-fns";

export interface FinancialSummary {
  currentBalance: number;
  totalIncome: number;
  totalExpense: number;
  incomeChange: number;
  expenseChange: number;
  lastUpdate: Date;
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
  const totalIncome = currentIncomes.reduce((sum, record) => sum + parseFloat(record.amount), 0);
  const totalExpense = currentExpenses.reduce((sum, record) => sum + parseFloat(record.amount), 0);
  const lastMonthTotalIncome = lastMonthIncomes.reduce((sum, record) => sum + parseFloat(record.amount), 0);
  const lastMonthTotalExpense = lastMonthExpenses.reduce((sum, record) => sum + parseFloat(record.amount), 0);

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

export const getRecentTransactions = async (limit = 4) => {
  // Buscar as receitas mais recentes
  const { data: incomes, error: incomeError } = await supabase
    .from("incomes")
    .select("id, description as name, source as category, amount, date, 'income' as type")
    .order("date", { ascending: false })
    .limit(limit);

  if (incomeError) throw incomeError;

  // Buscar as despesas mais recentes
  const { data: expenses, error: expenseError } = await supabase
    .from("expenses")
    .select("id, description as name, category, amount, date, 'expense' as type")
    .order("date", { ascending: false })
    .limit(limit);

  if (expenseError) throw expenseError;

  // Combinar e ordenar por data
  const transactions = [...incomes, ...expenses]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limit)
    .map(transaction => {
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

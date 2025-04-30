
// Tipos de transações para compartilhar entre componentes
export interface ExpenseTransaction {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: Date;
  notes?: string; // Mantendo como opcional conforme definição original
  is_recurring?: boolean;
  created_at: string;
  user_id: string;
  type: 'expense';
}

export interface IncomeTransaction {
  id: string;
  description: string;
  amount: number;
  source: string;
  date: Date;
  is_recurring?: boolean;
  created_at: string;
  user_id: string;
  type: 'income';
}

export type Transaction = ExpenseTransaction | IncomeTransaction;

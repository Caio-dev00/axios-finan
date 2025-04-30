
import React from "react";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { formatCurrency } from "@/services/currencyService";

// Definindo interfaces para os tipos de transações
interface ExpenseTransaction {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: Date;
  notes: string;
  is_recurring: boolean;
  created_at: string;
  user_id: string;
  type: 'expense';
}

interface IncomeTransaction {
  id: string;
  description: string;
  amount: number;
  source: string;
  date: Date;
  is_recurring: boolean;
  created_at: string;
  user_id: string;
  type: 'income';
}

type Transaction = ExpenseTransaction | IncomeTransaction;

// Componente para exibir detalhes de uma transação
const TransactionDetails = ({ transaction, type }: { transaction: Transaction, type: 'income' | 'expense' }) => {
  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>Detalhes da Transação</DialogTitle>
        <DialogDescription>
          Informações completas sobre esta transação
        </DialogDescription>
      </DialogHeader>
      <div className="space-y-4 pt-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Tipo</span>
          <Badge variant={type === 'income' ? "outline" : "destructive"}>
            {type === 'income' ? 'Receita' : 'Despesa'}
          </Badge>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Valor</span>
          <span className={`font-semibold ${type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
            {formatCurrency(transaction.amount)}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Descrição</span>
          <span>{transaction.description}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Categoria</span>
          <span>
            {type === 'income' 
              ? (transaction as IncomeTransaction).source 
              : (transaction as ExpenseTransaction).category}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Data</span>
          <span>
            {format(new Date(transaction.date), "dd 'de' MMMM 'de' yyyy", {
              locale: ptBR,
            })}
          </span>
        </div>
        {type === 'expense' && (transaction as ExpenseTransaction).notes && (
          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium">Observações</span>
            <span className="text-sm text-gray-600">{(transaction as ExpenseTransaction).notes}</span>
          </div>
        )}
      </div>
    </DialogContent>
  );
};

export default TransactionDetails;

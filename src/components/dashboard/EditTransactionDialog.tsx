
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";

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

interface EditTransactionDialogProps {
  transaction: Transaction;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedTransaction: Transaction) => void;
}

const EditTransactionDialog = ({ 
  transaction,
  isOpen,
  onClose,
  onSave 
}: EditTransactionDialogProps) => {
  const [editedTransaction, setEditedTransaction] = useState<Transaction>({...transaction});
  
  // Resetar o estado quando o transaction prop mudar
  useEffect(() => {
    if (transaction) {
      setEditedTransaction({...transaction});
    }
  }, [transaction]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === 'amount') {
      setEditedTransaction({
        ...editedTransaction,
        [name]: parseFloat(value) || 0
      });
    } else {
      setEditedTransaction({
        ...editedTransaction,
        [name]: value
      });
    }
  };
  
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedTransaction({
      ...editedTransaction,
      date: new Date(e.target.value)
    });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(editedTransaction);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) onClose();
    }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Editar {transaction.type === 'income' ? 'Receita' : 'Despesa'}</DialogTitle>
          <DialogDescription>
            Atualize os detalhes da sua {transaction.type === 'income' ? 'receita' : 'despesa'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="grid w-full items-center gap-2">
            <label htmlFor="description" className="text-sm font-medium">Descrição</label>
            <Input
              id="description"
              name="description"
              value={editedTransaction.description}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="grid w-full items-center gap-2">
            <label htmlFor="amount" className="text-sm font-medium">Valor</label>
            <Input
              id="amount"
              name="amount"
              type="number"
              step="0.01"
              value={editedTransaction.amount}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="grid w-full items-center gap-2">
            <label htmlFor="category" className="text-sm font-medium">
              {transaction.type === 'income' ? 'Fonte' : 'Categoria'}
            </label>
            <Input
              id={transaction.type === 'income' ? 'source' : 'category'}
              name={transaction.type === 'income' ? 'source' : 'category'}
              value={transaction.type === 'income' 
                ? (editedTransaction as IncomeTransaction).source 
                : (editedTransaction as ExpenseTransaction).category}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="grid w-full items-center gap-2">
            <label htmlFor="date" className="text-sm font-medium">Data</label>
            <Input
              id="date"
              name="date"
              type="date"
              value={format(new Date(editedTransaction.date), "yyyy-MM-dd")}
              onChange={handleDateChange}
              required
            />
          </div>
          
          {transaction.type === 'expense' && (
            <div className="grid w-full items-center gap-2">
              <label htmlFor="notes" className="text-sm font-medium">Observações</label>
              <Input
                id="notes"
                name="notes"
                value={(editedTransaction as ExpenseTransaction).notes || ''}
                onChange={handleChange}
              />
            </div>
          )}
          
          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
            <Button type="submit">Salvar alterações</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditTransactionDialog;

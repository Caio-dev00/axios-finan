
import React from "react";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Eye, Edit, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { formatCurrency } from "@/services/currencyService";
import TransactionDetails from "./TransactionDetails";

// Definindo interfaces para os tipos de transações
interface ExpenseTransaction {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: Date;
  notes?: string;
  is_recurring?: boolean;
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
  is_recurring?: boolean;
  created_at: string;
  user_id: string;
  type: 'income';
}

type Transaction = ExpenseTransaction | IncomeTransaction;

interface TransactionsTableProps {
  transactions: Transaction[];
  onEdit: (transaction: Transaction) => void;
  onDelete: (transaction: Transaction) => void;
}

const TransactionsTable: React.FC<TransactionsTableProps> = ({ 
  transactions, 
  onEdit, 
  onDelete 
}) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Descrição</TableHead>
          <TableHead className="hidden sm:table-cell">Categoria</TableHead>
          <TableHead className="hidden md:table-cell">Data</TableHead>
          <TableHead className="text-right">Valor</TableHead>
          <TableHead className="w-[80px]"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {transactions.map((transaction) => (
          <TableRow key={transaction.id}>
            <TableCell>
              <div className="font-medium">{transaction.description}</div>
              <div className="hidden sm:block md:hidden text-sm text-muted-foreground">
                {transaction.type === 'expense' 
                  ? (transaction as ExpenseTransaction).category 
                  : (transaction as IncomeTransaction).source}
              </div>
            </TableCell>
            <TableCell className="hidden sm:table-cell">
              <Badge variant="outline">
                {transaction.type === 'expense' 
                  ? (transaction as ExpenseTransaction).category 
                  : (transaction as IncomeTransaction).source}
              </Badge>
            </TableCell>
            <TableCell className="hidden md:table-cell">
              {format(new Date(transaction.date), "dd/MM/yyyy")}
            </TableCell>
            <TableCell className="text-right">
              <span className={transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}>
                {transaction.type === 'income' ? '+' : '-'} {formatCurrency(transaction.amount)}
              </span>
            </TableCell>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">Opções</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <Dialog>
                    <DialogTrigger asChild>
                      <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                        <Eye className="mr-2 h-4 w-4" />
                        Detalhes
                      </DropdownMenuItem>
                    </DialogTrigger>
                    <TransactionDetails 
                      transaction={transaction} 
                      type={transaction.type} 
                    />
                  </Dialog>
                  <DropdownMenuItem onSelect={(e) => {
                    e.preventDefault();
                    onEdit(transaction);
                  }}>
                    <Edit className="mr-2 h-4 w-4" />
                    Editar
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="text-destructive"
                    onSelect={(e) => {
                      e.preventDefault();
                      onDelete(transaction);
                    }}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Excluir
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default TransactionsTable;

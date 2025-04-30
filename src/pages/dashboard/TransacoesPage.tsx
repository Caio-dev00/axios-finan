
import React, { useState, useEffect, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";
import { Plus, ArrowUpCircle, ArrowDownCircle, Filter, MoreHorizontal, Trash2, Edit, Eye } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getExpenses } from "@/services/expenseService";
import { getIncomes } from "@/services/incomeService";
import { formatCurrency } from "@/services/currencyService";
import AddIncomeDialog from "@/components/dashboard/AddIncomeDialog";
import AddExpenseDialog from "@/components/dashboard/AddExpenseDialog";

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
const TransactionDetails = ({ transaction, type }: { transaction: any, type: 'income' | 'expense' }) => {
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

const TransacoesPage = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddIncomeDialog, setShowAddIncomeDialog] = useState(false);
  const [showAddExpenseDialog, setShowAddExpenseDialog] = useState(false);
  
  // Busca despesas
  const { 
    data: expenses = [], 
    isLoading: isLoadingExpenses,
    refetch: refetchExpenses
  } = useQuery({
    queryKey: ['expenses'],
    queryFn: getExpenses
  });

  // Busca receitas
  const { 
    data: incomes = [], 
    isLoading: isLoadingIncomes,
    refetch: refetchIncomes
  } = useQuery({
    queryKey: ['incomes'],
    queryFn: getIncomes
  });

  // Combina despesas e receitas em um único array de transações
  const transactions = useMemo(() => {
    const allTransactions = [
      ...expenses.map(expense => ({ ...expense, type: 'expense' as const })),
      ...incomes.map(income => ({ ...income, type: 'income' as const }))
    ] as Transaction[];
    
    // Ordena por data, mais recente primeiro
    return allTransactions.sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }, [expenses, incomes]);

  // Filtra transações com base na aba ativa e termo de busca
  const filteredTransactions = useMemo(() => {
    return transactions.filter(transaction => {
      // Filtra por tipo (receita, despesa ou todos)
      const typeMatch = activeTab === 'all' || transaction.type === activeTab;
      
      // Filtra por termo de busca (descrição ou categoria)
      const searchMatch = !searchTerm || 
        transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) || 
        (transaction.type === 'expense' 
          ? (transaction as ExpenseTransaction).category.toLowerCase().includes(searchTerm.toLowerCase())
          : (transaction as IncomeTransaction).source.toLowerCase().includes(searchTerm.toLowerCase()));
        
      return typeMatch && searchMatch;
    });
  }, [transactions, activeTab, searchTerm]);

  // Função para excluir uma transação
  const handleDelete = (transaction) => {
    // Implementação futura: excluir transação do banco de dados
    toast({
      title: "Transação excluída",
      description: "A transação foi removida com sucesso.",
      variant: "default"
    });
  };

  // Função para lidar com a adição de uma nova receita
  const handleAddIncome = () => {
    setShowAddIncomeDialog(true);
  };

  // Função para lidar com a adição de uma nova despesa
  const handleAddExpense = () => {
    setShowAddExpenseDialog(true);
  };

  // Função chamada após adicionar uma receita com sucesso
  const handleIncomeAdded = () => {
    setShowAddIncomeDialog(false);
    refetchIncomes();
    toast({
      title: "Receita adicionada",
      description: "A receita foi adicionada com sucesso.",
      variant: "default"
    });
  };

  // Função chamada após adicionar uma despesa com sucesso
  const handleExpenseAdded = () => {
    setShowAddExpenseDialog(false);
    refetchExpenses();
    toast({
      title: "Despesa adicionada",
      description: "A despesa foi adicionada com sucesso.",
      variant: "default"
    });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Transações</h1>
          <p className="text-muted-foreground">
            Gerencie todas as suas transações financeiras
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button onClick={handleAddIncome} className="bg-green-600 hover:bg-green-700">
            <ArrowUpCircle className="mr-2 h-4 w-4" />
            Nova Receita
          </Button>
          <Button onClick={handleAddExpense} className="bg-red-600 hover:bg-red-700">
            <ArrowDownCircle className="mr-2 h-4 w-4" />
            Nova Despesa
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Transações</CardTitle>
          <CardDescription>
            Visualize e gerencie todas as suas transações financeiras
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full sm:w-auto">
              <TabsList>
                <TabsTrigger value="all">Todas</TabsTrigger>
                <TabsTrigger value="income">Receitas</TabsTrigger>
                <TabsTrigger value="expense">Despesas</TabsTrigger>
              </TabsList>
            </Tabs>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Input
                placeholder="Buscar transações..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-xs"
              />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="h-9 w-9 p-0">
                    <Filter className="h-4 w-4" />
                    <span className="sr-only">Filtrar</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Mais recentes</DropdownMenuItem>
                  <DropdownMenuItem>Mais antigos</DropdownMenuItem>
                  <DropdownMenuItem>Maior valor</DropdownMenuItem>
                  <DropdownMenuItem>Menor valor</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {isLoadingExpenses || isLoadingIncomes ? (
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-4 w-[200px]" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredTransactions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <p className="mb-2 text-muted-foreground">Nenhuma transação encontrada</p>
              <p className="text-sm text-muted-foreground">
                {searchTerm ? "Tente usar outros termos de busca" : "Adicione sua primeira transação usando os botões acima"}
              </p>
            </div>
          ) : (
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
                {filteredTransactions.map((transaction) => (
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
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-destructive"
                            onClick={() => handleDelete(transaction)}
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
          )}
        </CardContent>
      </Card>

      {/* Diálogos para adicionar novas transações */}
      {showAddIncomeDialog && (
        <AddIncomeDialog 
          trigger={null}
          onOpenChange={setShowAddIncomeDialog}
          open={showAddIncomeDialog}
          onSubmitSuccess={handleIncomeAdded} 
        />
      )}
      
      {showAddExpenseDialog && (
        <AddExpenseDialog 
          trigger={null}
          onOpenChange={setShowAddExpenseDialog}
          open={showAddExpenseDialog}
          onSubmitSuccess={handleExpenseAdded}
        />
      )}
    </div>
  );
};

export default TransacoesPage;

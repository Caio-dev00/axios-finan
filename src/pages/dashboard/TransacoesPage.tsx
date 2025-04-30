
import React, { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowUpCircle, ArrowDownCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getExpenses, deleteExpense, updateExpense } from "@/services/expenseService";
import { getIncomes, deleteIncome, updateIncome } from "@/services/incomeService";
import AddIncomeDialog from "@/components/dashboard/AddIncomeDialog";
import AddExpenseDialog from "@/components/dashboard/AddExpenseDialog";
import { useSubscription } from "@/contexts/SubscriptionContext";
import TransactionFilter from "@/components/dashboard/TransactionFilter";
import TransactionsTable from "@/components/dashboard/TransactionsTable";
import EditTransactionDialog from "@/components/dashboard/EditTransactionDialog";
import ExportOptions from "@/components/dashboard/ExportOptions";
import { Transaction, ExpenseTransaction, IncomeTransaction } from "@/types/transactions";

const TransacoesPage = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddIncomeDialog, setShowAddIncomeDialog] = useState(false);
  const [showAddExpenseDialog, setShowAddExpenseDialog] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const { isPro } = useSubscription();
  
  // Mutações para atualizar transações - Corrigidas para resolver o problema de congelamento
  const updateIncomeMutation = useMutation({
    mutationFn: (income: IncomeTransaction) => updateIncome(income),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['incomes']
      });
      queryClient.invalidateQueries({
        queryKey: ['recentTransactions']
      });
      toast({
        title: "Receita atualizada",
        description: "A receita foi atualizada com sucesso."
      });
      // Importante: Limpar o estado para fechar o diálogo
      setEditingTransaction(null);
    },
    onError: (error) => {
      toast({
        title: "Erro ao atualizar",
        description: "Não foi possível atualizar a receita.",
        variant: "destructive"
      });
      console.error('Erro ao atualizar receita:', error);
      // Importante: Limpar o estado mesmo em caso de erro
      setEditingTransaction(null);
    }
  });

  const updateExpenseMutation = useMutation({
    mutationFn: (expense: ExpenseTransaction) => updateExpense(expense),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['expenses']
      });
      queryClient.invalidateQueries({
        queryKey: ['recentTransactions']
      });
      toast({
        title: "Despesa atualizada",
        description: "A despesa foi atualizada com sucesso."
      });
      // Importante: Limpar o estado para fechar o diálogo
      setEditingTransaction(null);
    },
    onError: (error) => {
      toast({
        title: "Erro ao atualizar",
        description: "Não foi possível atualizar a despesa.",
        variant: "destructive"
      });
      console.error('Erro ao atualizar despesa:', error);
      // Importante: Limpar o estado mesmo em caso de erro
      setEditingTransaction(null);
    }
  });
  
  // Mutações para excluir transações
  const deleteIncomeMutation = useMutation({
    mutationFn: deleteIncome,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['incomes']
      });
      queryClient.invalidateQueries({
        queryKey: ['recentTransactions']
      });
      toast({
        title: "Receita excluída",
        description: "A receita foi excluída com sucesso."
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao excluir",
        description: "Não foi possível excluir a receita.",
        variant: "destructive"
      });
      console.error('Erro ao excluir receita:', error);
    }
  });

  const deleteExpenseMutation = useMutation({
    mutationFn: deleteExpense,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['expenses']
      });
      queryClient.invalidateQueries({
        queryKey: ['recentTransactions']
      });
      toast({
        title: "Despesa excluída",
        description: "A despesa foi excluída com sucesso."
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao excluir",
        description: "Não foi possível excluir a despesa.",
        variant: "destructive"
      });
      console.error('Erro ao excluir despesa:', error);
    }
  });
  
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
  const handleDelete = (transaction: Transaction) => {
    if (transaction.type === 'income') {
      deleteIncomeMutation.mutate(transaction.id);
    } else {
      deleteExpenseMutation.mutate(transaction.id);
    }
  };

  // Função para editar uma transação
  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
  };

  // Função para salvar uma transação editada - Corrigida para resolver o problema de congelamento
  const handleSaveEdit = (updatedTransaction: Transaction) => {
    try {
      if (updatedTransaction.type === 'income') {
        updateIncomeMutation.mutate(updatedTransaction as IncomeTransaction);
      } else {
        updateExpenseMutation.mutate(updatedTransaction as ExpenseTransaction);
      }
    } catch (error) {
      console.error('Erro ao salvar edição:', error);
      toast({
        title: "Erro ao salvar",
        description: "Ocorreu um erro ao salvar as alterações.",
        variant: "destructive"
      });
      // Importante: Limpar o estado em caso de erro para fechar o diálogo
      setEditingTransaction(null);
    }
  };

  // Função para fechar o diálogo de edição - Adicionada para resolver o problema de congelamento
  const handleCloseEdit = () => {
    setEditingTransaction(null);
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
      description: "A receita foi adicionada com sucesso."
    });
  };

  // Função chamada após adicionar uma despesa com sucesso
  const handleExpenseAdded = () => {
    setShowAddExpenseDialog(false);
    refetchExpenses();
    toast({
      title: "Despesa adicionada",
      description: "A despesa foi adicionada com sucesso."
    });
  };

  // Estado de carregamento
  const isLoading = isLoadingExpenses || isLoadingIncomes;

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
          <TransactionFilter 
            activeTab={activeTab}
            onTabChange={setActiveTab}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
          />

          {filteredTransactions.length > 0 && (
            <div className="mb-4">
              <ExportOptions transactions={filteredTransactions} />
            </div>
          )}

          {isLoading ? (
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
            <TransactionsTable 
              transactions={filteredTransactions}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
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

      {/* Diálogo para editar transação - Corrigido para resolver o problema de congelamento */}
      {editingTransaction && (
        <EditTransactionDialog
          transaction={editingTransaction}
          isOpen={!!editingTransaction}
          onClose={handleCloseEdit}
          onSave={handleSaveEdit}
        />
      )}
    </div>
  );
};

export default TransacoesPage;

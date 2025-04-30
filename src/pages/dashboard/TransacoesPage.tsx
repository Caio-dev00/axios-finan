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
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";
import { Plus, ArrowUpCircle, ArrowDownCircle, Filter, MoreHorizontal, Trash2, Edit, Eye, FileText, FileSpreadsheet, Download } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getExpenses, deleteExpense, updateExpense } from "@/services/expenseService";
import { getIncomes, deleteIncome, updateIncome } from "@/services/incomeService";
import { formatCurrency } from "@/services/currencyService";
import AddIncomeDialog from "@/components/dashboard/AddIncomeDialog";
import AddExpenseDialog from "@/components/dashboard/AddExpenseDialog";
import { useSubscription } from "@/contexts/SubscriptionContext";
import ProFeature from "@/components/ProFeature";

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

// Componente para editar uma transação
const EditTransactionDialog = ({ 
  transaction,
  isOpen,
  onClose,
  onSave 
}: { 
  transaction: Transaction,
  isOpen: boolean,
  onClose: () => void,
  onSave: (updatedTransaction: Transaction) => void 
}) => {
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

  // Exportar dados para CSV
  const exportToCSV = () => {
    if (filteredTransactions.length === 0) {
      toast({
        title: "Sem dados",
        description: "Não há transações para exportar.",
        variant: "destructive"
      });
      return;
    }

    // Cria cabeçalhos para o CSV
    const headers = ['Descrição', 'Categoria/Fonte', 'Data', 'Valor', 'Tipo'];
    
    // Formata os dados
    const csvData = filteredTransactions.map(transaction => {
      const categoryOrSource = transaction.type === 'expense' 
        ? (transaction as ExpenseTransaction).category 
        : (transaction as IncomeTransaction).source;
      
      return [
        transaction.description,
        categoryOrSource,
        format(new Date(transaction.date), 'dd/MM/yyyy'),
        transaction.amount.toFixed(2),
        transaction.type === 'income' ? 'Receita' : 'Despesa'
      ].join(',');
    });

    // Monta o conteúdo do CSV
    const csvContent = [
      headers.join(','),
      ...csvData
    ].join('\n');

    // Cria o blob e o link para download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `transacoes_${format(new Date(), 'dd-MM-yyyy')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Download iniciado",
      description: "Seu arquivo CSV está sendo baixado."
    });
  };

  // Exportar dados para Excel (XLSX)
  const exportToExcel = () => {
    if (filteredTransactions.length === 0) {
      toast({
        title: "Sem dados",
        description: "Não há transações para exportar.",
        variant: "destructive"
      });
      return;
    }

    // Como não podemos usar bibliotecas externas, vamos usar o formato CSV que o Excel abre
    exportToCSV();
    
    toast({
      title: "Download iniciado",
      description: "Seu arquivo Excel está sendo baixado. Abra-o com o Excel."
    });
  };

  // Exportar dados para PDF
  const exportToPDF = () => {
    if (filteredTransactions.length === 0) {
      toast({
        title: "Sem dados",
        description: "Não há transações para exportar.",
        variant: "destructive"
      });
      return;
    }

    // Criar uma nova janela para impressão em PDF
    const printWindow = window.open('', '_blank');
    
    if (!printWindow) {
      toast({
        title: "Erro",
        description: "Não foi possível abrir a janela de impressão. Verifique se o bloqueador de pop-ups está desativado.",
        variant: "destructive"
      });
      return;
    }

    // Criar o conteúdo HTML da página PDF
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Relatório de Transações</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { color: #333; text-align: center; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
            th { background-color: #f2f2f2; }
            .income { color: green; }
            .expense { color: red; }
            .footer { margin-top: 30px; text-align: center; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <h1>Relatório de Transações</h1>
          <p>Data de geração: ${format(new Date(), 'dd/MM/yyyy')}</p>
          <table>
            <thead>
              <tr>
                <th>Descrição</th>
                <th>Categoria/Fonte</th>
                <th>Data</th>
                <th>Valor</th>
                <th>Tipo</th>
              </tr>
            </thead>
            <tbody>
              ${filteredTransactions.map(transaction => {
                const categoryOrSource = transaction.type === 'expense'
                  ? (transaction as ExpenseTransaction).category
                  : (transaction as IncomeTransaction).source;
                
                return `
                  <tr>
                    <td>${transaction.description}</td>
                    <td>${categoryOrSource}</td>
                    <td>${format(new Date(transaction.date), 'dd/MM/yyyy')}</td>
                    <td class="${transaction.type === 'income' ? 'income' : 'expense'}">
                      ${transaction.type === 'income' ? '+' : '-'} R$ ${transaction.amount.toFixed(2)}
                    </td>
                    <td>${transaction.type === 'income' ? 'Receita' : 'Despesa'}</td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
          <div class="footer">
            <p>Gerado em ${format(new Date(), "dd 'de' MMMM 'de' yyyy, HH:mm:ss", { locale: ptBR })}</p>
          </div>
          <script>
            window.onload = function() {
              window.print();
            };
          </script>
        </body>
      </html>
    `;

    // Escrever o HTML na nova janela e imprimir
    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();
    
    toast({
      title: "PDF gerado",
      description: "Seu relatório em PDF está pronto para impressão."
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

          {filteredTransactions.length > 0 && (
            <div className="mb-4 flex flex-wrap gap-2">
              {/* PDF exportação disponível para todos */}
              <Button variant="outline" size="sm" onClick={exportToPDF}>
                <Download className="mr-2 h-4 w-4" />
                Exportar PDF
              </Button>
              
              {/* CSV exportação exclusiva para PRO */}
              <ProFeature fallback={
                <Button variant="outline" size="sm" className="opacity-70 cursor-not-allowed">
                  <FileText className="mr-2 h-4 w-4" />
                  Exportar CSV <span className="ml-2 text-xs bg-amber-200 text-amber-800 px-1.5 py-0.5 rounded">Pro</span>
                </Button>
              }>
                <Button variant="outline" size="sm" onClick={exportToCSV}>
                  <FileText className="mr-2 h-4 w-4" />
                  Exportar CSV
                </Button>
              </ProFeature>
              
              {/* Excel exportação exclusiva para PRO */}
              <ProFeature fallback={
                <Button variant="outline" size="sm" className="opacity-70 cursor-not-allowed">
                  <FileSpreadsheet className="mr-2 h-4 w-4" />
                  Exportar Excel <span className="ml-2 text-xs bg-amber-200 text-amber-800 px-1.5 py-0.5 rounded">Pro</span>
                </Button>
              }>
                <Button variant="outline" size="sm" onClick={exportToExcel}>
                  <FileSpreadsheet className="mr-2 h-4 w-4" />
                  Exportar Excel
                </Button>
              </ProFeature>
            </div>
          )}

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
                          <DropdownMenuItem onSelect={(e) => {
                            e.preventDefault();
                            handleEdit(transaction);
                          }}>
                            <Edit className="mr-2 h-4 w-4" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-destructive"
                            onSelect={(e) => {
                              e.preventDefault();
                              handleDelete(transaction);
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

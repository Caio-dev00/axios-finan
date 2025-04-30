
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Loader2, ArrowDownUp, Filter, List, PlusCircle } from "lucide-react";
import { getIncomes } from "@/services/incomeService";
import { getExpenses } from "@/services/expenseService";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useCurrency } from "@/contexts/CurrencyContext";
import { toast } from "@/hooks/use-toast";
import { formatCurrency, convertCurrency } from "@/services/currencyService";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import AddIncomeDialog from "@/components/dashboard/AddIncomeDialog";
import AddExpenseDialog from "@/components/dashboard/AddExpenseDialog";
import { useSubscription } from "@/contexts/SubscriptionContext";
import ProFeature from "@/components/ProFeature";

const TransacoesPage = () => {
  const [tipoFiltro, setTipoFiltro] = useState<'todos' | 'receitas' | 'despesas'>('todos');
  const [showAddIncome, setShowAddIncome] = useState(false);
  const [showAddExpense, setShowAddExpense] = useState(false);
  const { activeCurrency } = useCurrency();
  const { isPro } = useSubscription();
  
  const {
    data: incomes,
    isLoading: incomesLoading,
    isError: incomesError
  } = useQuery({
    queryKey: ['incomes'],
    queryFn: getIncomes,
  });

  const {
    data: expenses,
    isLoading: expensesLoading,
    isError: expensesError
  } = useQuery({
    queryKey: ['expenses'],
    queryFn: getExpenses,
  });

  const isLoading = incomesLoading || expensesLoading;
  const isError = incomesError || expensesError;

  // Combinar e ordenar transações
  const transactions = React.useMemo(() => {
    const allTransactions = [];
    
    if (incomes && (tipoFiltro === 'todos' || tipoFiltro === 'receitas')) {
      allTransactions.push(
        ...incomes.map(income => ({
          id: income.id,
          descricao: income.description,
          categoria: income.source,
          valor: convertCurrency(income.amount, 'BRL', activeCurrency),
          data: income.date,
          tipo: 'receita'
        }))
      );
    }

    if (expenses && (tipoFiltro === 'todos' || tipoFiltro === 'despesas')) {
      allTransactions.push(
        ...expenses.map(expense => ({
          id: expense.id,
          descricao: expense.description,
          categoria: expense.category,
          valor: convertCurrency(expense.amount, 'BRL', activeCurrency),
          data: expense.date,
          tipo: 'despesa'
        }))
      );
    }

    // Ordenar por data (mais recente primeiro)
    return allTransactions.sort((a, b) => {
      // Se a.data e b.data não são instâncias de Date, converter para Date
      const dateA = a.data instanceof Date ? a.data : new Date(a.data);
      const dateB = b.data instanceof Date ? b.data : new Date(b.data);
      return dateB.getTime() - dateA.getTime();
    });
  }, [incomes, expenses, tipoFiltro, activeCurrency]);

  // Função para exportar transações (funcionalidade Pro)
  const exportarTransacoes = () => {
    if (!isPro) {
      toast({
        title: "Funcionalidade disponível apenas no plano Pro",
        description: "Atualize seu plano para exportar suas transações.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Exportação iniciada",
      description: "Suas transações estão sendo exportadas."
    });
    
    // Implementação simulada de exportação
    setTimeout(() => {
      toast({
        title: "Exportação concluída",
        description: "Suas transações foram exportadas com sucesso."
      });
    }, 2000);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 flex items-center justify-center h-96">
        <Loader2 className="h-10 w-10 animate-spin text-finance-primary" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container mx-auto p-6">
        <Card className="border-red-300">
          <CardContent className="pt-6">
            <h2 className="text-xl font-semibold text-red-600 mb-2">Erro ao carregar transações</h2>
            <p className="text-gray-600">
              Não foi possível carregar suas transações. Por favor, tente novamente mais tarde.
            </p>
            <Button onClick={() => window.location.reload()} className="mt-4">
              Tentar novamente
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-foreground">Transações</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Visualize e gerencie todas as suas transações financeiras
          </p>
        </div>
        
        <div className="mt-4 md:mt-0 flex flex-wrap gap-2">
          <Button 
            onClick={() => setShowAddIncome(true)} 
            variant="default"
            className="gap-1"
          >
            <PlusCircle size={16} />
            <span>Receita</span>
          </Button>
          
          <Button 
            onClick={() => setShowAddExpense(true)} 
            variant="outline"
            className="gap-1"
          >
            <PlusCircle size={16} />
            <span>Despesa</span>
          </Button>
          
          <ProFeature>
            <Button 
              variant="outline" 
              className="gap-1"
              onClick={exportarTransacoes}
            >
              <List size={16} />
              <span>Exportar</span>
            </Button>
          </ProFeature>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle>Histórico de Transações</CardTitle>
            
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-1">
                    <Filter size={16} />
                    <span>Filtrar</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem 
                    onClick={() => setTipoFiltro('todos')}
                    className={tipoFiltro === 'todos' ? "bg-accent" : ""}
                  >
                    Todas transações
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => setTipoFiltro('receitas')}
                    className={tipoFiltro === 'receitas' ? "bg-accent" : ""}
                  >
                    Apenas receitas
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => setTipoFiltro('despesas')}
                    className={tipoFiltro === 'despesas' ? "bg-accent" : ""}
                  >
                    Apenas despesas
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => window.location.reload()}>
                <ArrowDownUp size={16} />
              </Button>
            </div>
          </div>
          <CardDescription>
            {tipoFiltro === 'todos' ? 'Todas as transações' : 
              tipoFiltro === 'receitas' ? 'Apenas receitas' : 'Apenas despesas'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {transactions.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Descrição</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead className="text-right">Valor</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((transaction) => (
                    <TableRow key={`${transaction.tipo}-${transaction.id}`}>
                      <TableCell className="font-medium">{transaction.descricao}</TableCell>
                      <TableCell>{transaction.categoria}</TableCell>
                      <TableCell>{format(new Date(transaction.data), 'dd/MM/yyyy', { locale: ptBR })}</TableCell>
                      <TableCell className={`text-right font-medium ${transaction.tipo === 'receita' ? 'text-green-600' : 'text-red-600'}`}>
                        {transaction.tipo === 'receita' ? '+' : '-'} {formatCurrency(transaction.valor, activeCurrency)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="py-24 text-center">
              <p className="text-lg text-gray-500">Nenhuma transação encontrada</p>
              <p className="text-sm text-gray-400 mt-1">
                Adicione receitas ou despesas para visualizar seu histórico de transações
              </p>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Diálogos para adicionar receitas e despesas */}
      <AddIncomeDialog open={showAddIncome} onOpenChange={setShowAddIncome} />
      <AddExpenseDialog open={showAddExpense} onOpenChange={setShowAddExpense} />
    </div>
  );
};

export default TransacoesPage;

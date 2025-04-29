import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Plus, Trash2 } from "lucide-react";
import AddIncomeDialog from "@/components/dashboard/AddIncomeDialog";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getIncomes, deleteIncome } from "@/services/incomeService";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";

const IncomePage = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const { data: incomes, isLoading } = useQuery({
    queryKey: ["incomes"],
    queryFn: getIncomes
  });

  const deleteIncomeMutation = useMutation({
    mutationFn: deleteIncome,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["incomes"] });
      queryClient.invalidateQueries({ queryKey: ["recentTransactions"] });
      toast({
        title: "Receita excluída",
        description: "A receita foi excluída com sucesso.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Não foi possível excluir a receita. Tente novamente.",
        variant: "destructive",
      });
      console.error("Erro ao excluir receita:", error);
    },
  });

  const handleDeleteIncome = (id: string) => {
    deleteIncomeMutation.mutate(id);
  };

  // Calcular estatísticas de receitas
  const totalThisMonth = React.useMemo(() => {
    if (!incomes) return 0;
    
    const now = new Date();
    const monthIncomes = incomes.filter(income => {
      const incomeDate = new Date(income.date);
      return (
        incomeDate.getMonth() === now.getMonth() && 
        incomeDate.getFullYear() === now.getFullYear()
      );
    });
    
    return monthIncomes.reduce((sum, income) => sum + income.amount, 0);
  }, [incomes]);

  // Calcular distribuição por fonte
  const sourceDistribution = React.useMemo(() => {
    if (!incomes || incomes.length === 0) return [];
    
    const sources: Record<string, number> = {};
    let total = 0;
    
    incomes.forEach(income => {
      const amount = income.amount;
      sources[income.source] = (sources[income.source] || 0) + amount;
      total += amount;
    });
    
    return Object.entries(sources).map(([source, amount]) => ({
      source,
      amount,
      percentage: Math.round((amount / total) * 100)
    })).sort((a, b) => b.amount - a.amount);
  }, [incomes]);

  const formatDate = (date: Date) => {
    return format(date, "dd 'de' MMMM, yyyy", { locale: ptBR });
  };

  // Calcular média mensal (últimos 6 meses)
  const monthlyAverage = React.useMemo(() => {
    if (!incomes || incomes.length === 0) return 0;
    
    const now = new Date();
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(now.getMonth() - 6);
    
    const recentIncomes = incomes.filter(income => new Date(income.date) >= sixMonthsAgo);
    const total = recentIncomes.reduce((sum, income) => sum + income.amount, 0);
    
    // Calcular número de meses únicos no período
    const uniqueMonths = new Set();
    recentIncomes.forEach(income => {
      const date = new Date(income.date);
      uniqueMonths.add(`${date.getMonth()}-${date.getFullYear()}`);
    });
    
    const monthCount = Math.max(uniqueMonths.size, 1);
    return total / monthCount;
  }, [incomes]);

  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gerenciar Receitas</h1>
        <AddIncomeDialog 
          trigger={
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Nova Receita
            </Button>
          }
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Receitas Recentes</CardTitle>
            <CardDescription>Visualize e gerencie suas receitas mais recentes</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center items-center py-8">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : incomes && incomes.length > 0 ? (
              <div className="space-y-4">
                {incomes.map(income => (
                  <div key={income.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-md">
                    <div>
                      <p className="font-medium">{income.description}</p>
                      <p className="text-sm text-gray-500">{formatDate(income.date)}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <p className="font-semibold text-green-600">+ R$ {income.amount.toFixed(2)}</p>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="sm" className="text-gray-500 hover:text-red-600">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Excluir receita</AlertDialogTitle>
                            <AlertDialogDescription>
                              Tem certeza que deseja excluir a receita "{income.description}"? Esta ação não pode ser desfeita.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction 
                              className="bg-red-600 text-white hover:bg-red-700"
                              onClick={() => handleDeleteIncome(income.id)}
                            >
                              Excluir
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">Nenhuma receita encontrada</p>
                <p className="text-sm text-gray-400 mt-1">
                  Adicione receitas para visualizar seus ganhos
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Resumo de Receitas</CardTitle>
            <CardDescription>Análise das suas fontes de renda</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center items-center py-8">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : incomes && incomes.length > 0 ? (
              <div className="space-y-4">
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between">
                    <span>Total este mês:</span>
                    <span className="font-bold text-green-600">
                      R$ {totalThisMonth.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Média mensal (últimos 6 meses):</span>
                    <span className="font-bold">
                      R$ {monthlyAverage.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Projeção anual:</span>
                    <span className="font-bold">
                      R$ {(monthlyAverage * 12).toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="text-sm font-medium mb-2">Distribuição por fonte</h3>
                  <div className="space-y-2">
                    {sourceDistribution.map(({source, percentage}) => (
                      <div key={source}>
                        <div className="flex justify-between items-center">
                          <span>{source}</span>
                          <span>{percentage}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div 
                            className="bg-green-600 h-2.5 rounded-full" 
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">Nenhum dado disponível</p>
                <p className="text-sm text-gray-400 mt-1">
                  Adicione receitas para visualizar estatísticas
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default IncomePage;

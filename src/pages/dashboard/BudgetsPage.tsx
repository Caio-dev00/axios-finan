import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Loader2, Trash2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import AddBudgetDialog from "@/components/dashboard/AddBudgetDialog";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getCurrentMonthBudgets, getExpensesForBudget, deleteBudget } from "@/services/budgetService";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
const BudgetsPage = () => {
  const {
    toast
  } = useToast();
  const queryClient = useQueryClient();
  const {
    data: budgets,
    isLoading: isLoadingBudgets
  } = useQuery({
    queryKey: ["currentMonthBudgets"],
    queryFn: getCurrentMonthBudgets
  });
  const {
    data: expensesByCategory,
    isLoading: isLoadingExpenses
  } = useQuery({
    queryKey: ["expensesByCategory"],
    queryFn: getExpensesForBudget
  });
  const deleteBudgetMutation = useMutation({
    mutationFn: deleteBudget,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["currentMonthBudgets"]
      });
      toast({
        title: "Orçamento excluído",
        description: "O orçamento foi excluído com sucesso."
      });
    },
    onError: error => {
      toast({
        title: "Erro",
        description: "Não foi possível excluir o orçamento. Tente novamente.",
        variant: "destructive"
      });
      console.error("Erro ao excluir orçamento:", error);
    }
  });
  const handleDeleteBudget = (id: string) => {
    deleteBudgetMutation.mutate(id);
  };
  const isLoading = isLoadingBudgets || isLoadingExpenses;
  const currentMonth = format(new Date(), 'MMMM', {
    locale: ptBR
  });
  const currentYear = new Date().getFullYear();

  // Calcular totais
  const totalBudgeted = budgets ? budgets.reduce((acc, budget) => acc + budget.amount, 0) : 0;
  const totalSpent = expensesByCategory ? Object.values(expensesByCategory).reduce((acc, val) => acc + val, 0) : 0;
  const remainingBalance = totalBudgeted - totalSpent;
  const usedPercentage = totalBudgeted > 0 ? Math.round(totalSpent / totalBudgeted * 100) : 0;
  const remainingPercentage = 100 - usedPercentage;
  return <div className="container mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Orçamentos</h1>
        <AddBudgetDialog trigger={<Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Novo Orçamento
            </Button>} />
      </div>

      {isLoading ? <div className="flex justify-center items-center py-20">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div> : <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div className="p-6 bg-white rounded-lg shadow-sm border">
              <h3 className="text-lg font-semibold mb-2 text-slate-800">Total Orçado</h3>
              <p className="text-3xl font-bold text-gray-800">
                R$ {totalBudgeted.toLocaleString('pt-BR', {
              minimumFractionDigits: 2
            })}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                para {currentMonth} de {currentYear}
              </p>
            </div>

            <div className="p-6 bg-white rounded-lg shadow-sm border">
              <h3 className="text-lg font-semibold mb-2 text-slate-800">Total Gasto</h3>
              <p className="text-3xl font-bold text-gray-800">
                R$ {totalSpent.toLocaleString('pt-BR', {
              minimumFractionDigits: 2
            })}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                {usedPercentage}% do orçamento total
              </p>
            </div>

            <div className="p-6 bg-white rounded-lg shadow-sm border">
              <h3 className="text-lg font-semibold mb-2 text-slate-800">Saldo Restante</h3>
              <p className="text-3xl font-bold text-green-600">
                R$ {remainingBalance.toLocaleString('pt-BR', {
              minimumFractionDigits: 2
            })}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                {remainingPercentage}% do orçamento restante
              </p>
            </div>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Orçamentos por Categoria</CardTitle>
              <CardDescription>Acompanhe o progresso dos seus orçamentos mensais</CardDescription>
            </CardHeader>
            <CardContent>
              {budgets && budgets.length > 0 ? <div className="space-y-6">
                  {budgets.map(budget => {
              const spent = expensesByCategory?.[budget.category] || 0;
              const budgetAmount = budget.amount;
              const remaining = budgetAmount - spent;
              const percentage = budgetAmount > 0 ? Math.round(spent / budgetAmount * 100) : 0;
              return <div key={budget.id} className="relative">
                        <div className="flex justify-between mb-2">
                          <div>
                            <h4 className="font-medium">{budget.category}</h4>
                            <p className="text-sm text-gray-500">
                              R$ {budgetAmount.toFixed(2)} orçado
                            </p>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <p className="font-medium">
                                R$ {spent.toFixed(2)} gastos
                              </p>
                              <p className="text-sm text-gray-500">
                                R$ {remaining.toFixed(2)} restantes
                              </p>
                            </div>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="sm" className="text-gray-500 hover:text-red-600">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Excluir orçamento</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Tem certeza que deseja excluir o orçamento de "{budget.category}"? Esta ação não pode ser desfeita.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                  <AlertDialogAction className="bg-red-600 text-white hover:bg-red-700" onClick={() => handleDeleteBudget(budget.id)}>
                                    Excluir
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </div>
                        <Progress value={percentage} className="h-2" />
                        <p className="text-xs text-right mt-1 text-gray-500">{percentage}% usado</p>
                      </div>;
            })}
                </div> : <div className="text-center py-8">
                  <p className="text-gray-500">Nenhum orçamento encontrado</p>
                  <p className="text-sm text-gray-400 mt-1">
                    Adicione orçamentos para começar a controlar seus gastos
                  </p>
                </div>}
            </CardContent>
          </Card>
        </>}
    </div>;
};
export default BudgetsPage;
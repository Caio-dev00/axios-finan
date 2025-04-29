import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AddExpenseDialog from "@/components/dashboard/AddExpenseDialog";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getExpenses, getExpensesByCategory, deleteExpense } from "@/services/expenseService";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
const ExpensesPage = () => {
  const {
    toast
  } = useToast();
  const queryClient = useQueryClient();
  const {
    data: expenses,
    isLoading
  } = useQuery({
    queryKey: ["expenses"],
    queryFn: getExpenses
  });
  const {
    data: expenseCategories
  } = useQuery({
    queryKey: ["expenseCategories"],
    queryFn: getExpensesByCategory
  });
  const deleteExpenseMutation = useMutation({
    mutationFn: deleteExpense,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["expenses"]
      });
      queryClient.invalidateQueries({
        queryKey: ["expenseCategories"]
      });
      queryClient.invalidateQueries({
        queryKey: ["recentTransactions"]
      });
      // Invalidate report data to update reports
      queryClient.invalidateQueries({
        queryKey: ["reportData"]
      });
      toast({
        title: "Despesa excluída",
        description: "A despesa foi excluída com sucesso."
      });
    },
    onError: error => {
      toast({
        title: "Erro",
        description: "Não foi possível excluir a despesa. Tente novamente.",
        variant: "destructive"
      });
      console.error("Erro ao excluir despesa:", error);
    }
  });
  const handleDeleteExpense = (id: string) => {
    deleteExpenseMutation.mutate(id);
  };
  const recurringExpenses = expenses?.filter(expense => expense.is_recurring);
  const oneTimeExpenses = expenses?.filter(expense => !expense.is_recurring);
  const formatDate = (date: Date) => {
    return format(date, "dd 'de' MMMM, yyyy", {
      locale: ptBR
    });
  };
  const renderExpenseItem = (expense: any) => <div key={expense.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-md">
      <div>
        <p className="font-medium text-slate-800">{expense.description}</p>
        <p className="text-sm text-gray-500">
          {expense.is_recurring ? `Mensal - Dia ${new Date(expense.date).getDate()}` : formatDate(expense.date)}
        </p>
      </div>
      <div className="flex items-center gap-4">
        <p className="font-semibold text-red-600">
          - R$ {expense.amount.toFixed(2)}
        </p>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" size="sm" className="text-gray-500 hover:text-red-600">
              <Trash2 className="h-4 w-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Excluir despesa</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja excluir a despesa "{expense.description}"? Esta ação não pode ser desfeita.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction className="bg-red-600 text-white hover:bg-red-700" onClick={() => handleDeleteExpense(expense.id)}>
                Excluir
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>;
  return <div className="container mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gerenciar Despesas</h1>
        <AddExpenseDialog trigger={<Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Nova Despesa
            </Button>} />
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="all">Todas</TabsTrigger>
          <TabsTrigger value="recurring">Recorrentes</TabsTrigger>
          <TabsTrigger value="oneTime">Únicas</TabsTrigger>
          <TabsTrigger value="categories">Categorias</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Despesas recentes</CardTitle>
              <CardDescription>Visualize e gerencie suas despesas mais recentes</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? <div className="flex justify-center items-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div> : expenses && expenses.length > 0 ? <div className="space-y-4">
                  {expenses.map(expense => renderExpenseItem(expense))}
                </div> : <div className="text-center py-8">
                  <p className="text-gray-500">Nenhuma despesa encontrada</p>
                  <p className="text-sm text-gray-400 mt-1">
                    Adicione despesas para visualizar seus gastos
                  </p>
                </div>}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="recurring" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Despesas Recorrentes</CardTitle>
              <CardDescription>Despesas mensais ou periódicas</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? <div className="flex justify-center items-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div> : recurringExpenses && recurringExpenses.length > 0 ? <div className="space-y-4">
                  {recurringExpenses.map(expense => renderExpenseItem(expense))}
                </div> : <div className="text-center py-8">
                  <p className="text-gray-500">Nenhuma despesa recorrente encontrada</p>
                </div>}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="oneTime">
          <Card>
            <CardHeader>
              <CardTitle>Despesas Únicas</CardTitle>
              <CardDescription>Pagamentos não recorrentes</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? <div className="flex justify-center items-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div> : oneTimeExpenses && oneTimeExpenses.length > 0 ? <div className="space-y-4">
                  {oneTimeExpenses.map(expense => renderExpenseItem(expense))}
                </div> : <div className="text-center py-8">
                  <p className="text-gray-500">Nenhuma despesa única encontrada</p>
                </div>}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="categories">
          <Card>
            <CardHeader>
              <CardTitle>Categorias de Despesas</CardTitle>
              <CardDescription>Visualize suas categorias de despesas</CardDescription>
            </CardHeader>
            <CardContent>
              {expenseCategories && expenseCategories.length > 0 ? <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {expenseCategories.map(category => <div key={category.name} className="p-4 bg-gray-50 rounded-md text-center">
                      <p className="font-medium">{category.name}</p>
                      <p className="text-sm text-gray-500">
                        {category.percentage}% dos gastos
                      </p>
                    </div>)}
                </div> : <div className="text-center py-8">
                  <p className="text-gray-500">Nenhuma categoria com despesas</p>
                </div>}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>;
};
export default ExpensesPage;
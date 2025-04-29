
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Trash2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getRecentTransactions } from "@/services/financeService";
import { deleteIncome } from "@/services/incomeService";
import { deleteExpense } from "@/services/expenseService";
import { useNavigate } from "react-router-dom";
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
import { useCurrency } from "@/contexts/CurrencyContext";
import { convertCurrency, formatCurrency } from "@/services/currencyService";

const RecentTransactions = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { activeCurrency } = useCurrency();
  
  const {
    data: transactions,
    isLoading
  } = useQuery({
    queryKey: ["recentTransactions", activeCurrency],
    queryFn: () => getRecentTransactions(4),
  });

  const deleteIncomeMutation = useMutation({
    mutationFn: deleteIncome,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["recentTransactions"]
      });
      queryClient.invalidateQueries({
        queryKey: ["incomes"]
      });
      toast({
        title: "Receita excluída",
        description: "A receita foi excluída com sucesso."
      });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Não foi possível excluir a receita. Tente novamente.",
        variant: "destructive"
      });
      console.error("Erro ao excluir receita:");
    },
  });

  const deleteExpenseMutation = useMutation({
    mutationFn: deleteExpense,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["recentTransactions"]
      });
      queryClient.invalidateQueries({
        queryKey: ["expenses"]
      });
      toast({
        title: "Despesa excluída",
        description: "A despesa foi excluída com sucesso."
      });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Não foi possível excluir a despesa. Tente novamente.",
        variant: "destructive"
      });
      console.error("Erro ao excluir despesa:");
    },
  });

  const handleDelete = (transaction: any) => {
    if (transaction.type === "income") {
      deleteIncomeMutation.mutate(transaction.id);
    } else {
      deleteExpenseMutation.mutate(transaction.id);
    }
  };

  // Convert transaction amounts based on active currency
  const convertedTransactions = React.useMemo(() => {
    if (!transactions) return [];
    
    return transactions.map(transaction => ({
      ...transaction,
      amount: convertCurrency(transaction.amount, 'BRL', activeCurrency)
    }));
  }, [transactions, activeCurrency]);

  return (
    <Card className="shadow-sm h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium">Transações Recentes</CardTitle>
        <Button 
          size="sm" 
          variant="outline" 
          onClick={() => navigate("/dashboard/expenses")}
        >
          Ver todas
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : convertedTransactions && convertedTransactions.length > 0 ? (
          <div className="space-y-4">
            {convertedTransactions.map((transaction) => (
              <div key={transaction.id} className="flex justify-between p-3 border-b">
                <div>
                  <p className="font-medium">{transaction.name}</p>
                  <p className="text-sm text-gray-500">{transaction.category}</p>
                </div>
                <div className="flex items-center gap-2">
                  <p className={`font-medium ${
                    transaction.type === "income" ? "text-green-600" : "text-red-600"
                  }`}>
                    {transaction.type === "income" ? "+" : "-"}
                    {formatCurrency(transaction.amount, activeCurrency)}
                  </p>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="sm" className="text-gray-500 hover:text-red-600 p-0 h-auto">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Excluir {transaction.type === "income" ? "receita" : "despesa"}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          Tem certeza que deseja excluir "{transaction.name}"? Esta ação não pode ser desfeita.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction 
                          className="bg-red-600 text-white hover:bg-red-700"
                          onClick={() => handleDelete(transaction)}
                        >
                          Excluir
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                  <p className="text-xs text-gray-500 ml-1">{transaction.date}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">Nenhuma transação encontrada</p>
            <p className="text-sm text-gray-400 mt-1">
              Adicione receitas ou despesas para visualizar suas transações recentes
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentTransactions;

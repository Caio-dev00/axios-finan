
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Trash2, Download, FileText, FileSpreadsheet } from "lucide-react";
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
import { useSubscription } from "@/contexts/SubscriptionContext";
import { useTheme } from "@/contexts/ThemeContext";
import ProFeature from "@/components/ProFeature";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const RecentTransactions = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { activeCurrency } = useCurrency();
  const { isPro } = useSubscription();
  const { isDarkMode } = useTheme();
  
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

  // Exportar dados para CSV
  const exportToCSV = () => {
    if (!convertedTransactions || convertedTransactions.length === 0) {
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
    const csvData = convertedTransactions.map(transaction => {
      // Fix: Use only category as we've standardized everything to use category
      return [
        transaction.name,
        transaction.category,
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
    link.setAttribute('download', `transacoes_recentes_${format(new Date(), 'dd-MM-yyyy')}.csv`);
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
    if (!convertedTransactions || convertedTransactions.length === 0) {
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
    if (!convertedTransactions || convertedTransactions.length === 0) {
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
          <title>Relatório de Transações Recentes</title>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              margin: 20px; 
              color: #333;
              background-color: #fff;
            }
            h1 { color: #0F9D58; text-align: center; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
            th { background-color: #f2f2f2; }
            .income { color: green; }
            .expense { color: red; }
            .footer { margin-top: 30px; text-align: center; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <h1>Relatório de Transações Recentes</h1>
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
              ${convertedTransactions.map(transaction => {
                // Fix: Use only category as we've standardized everything to use category
                return `
                  <tr>
                    <td>${transaction.name}</td>
                    <td>${transaction.category || ''}</td>
                    <td>${format(new Date(transaction.date), 'dd/MM/yyyy')}</td>
                    <td class="${transaction.type === 'income' ? 'income' : 'expense'}">
                      ${transaction.type === 'income' ? '+' : '-'} ${formatCurrency(transaction.amount, activeCurrency)}
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
    <Card className="shadow-sm h-full dark:border-gray-700">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium">Transações Recentes</CardTitle>
        
        <div className="flex items-center gap-2">
          {convertedTransactions && convertedTransactions.length > 0 && (
            <>
              {/* PDF disponível para todos */}
              <Button 
                size="sm" 
                variant="outline"
                className="flex items-center text-xs px-2 py-1 h-auto dark:border-gray-700 dark:hover:bg-gray-700"
                onClick={exportToPDF}
              >
                <Download className="h-3 w-3 mr-1" />
                PDF
              </Button>
              
              {/* CSV apenas para PRO */}
              <ProFeature fallback={
                <Button
                  size="sm"
                  variant="outline"
                  className="flex items-center text-xs px-2 py-1 h-auto opacity-70 dark:border-gray-700"
                >
                  <FileText className="h-3 w-3 mr-1" />
                  CSV
                  <span className="ml-1 text-[10px] bg-amber-200 text-amber-800 dark:bg-amber-900 dark:text-amber-200 px-1 rounded">Pro</span>
                </Button>
              }>
                <Button 
                  size="sm" 
                  variant="outline"
                  className="flex items-center text-xs px-2 py-1 h-auto dark:border-gray-700 dark:hover:bg-gray-700"
                  onClick={exportToCSV}
                >
                  <FileText className="h-3 w-3 mr-1" />
                  CSV
                </Button>
              </ProFeature>
              
              {/* Excel apenas para PRO */}
              <ProFeature fallback={
                <Button
                  size="sm"
                  variant="outline"
                  className="flex items-center text-xs px-2 py-1 h-auto opacity-70 dark:border-gray-700"
                >
                  <FileSpreadsheet className="h-3 w-3 mr-1" />
                  XLS
                  <span className="ml-1 text-[10px] bg-amber-200 text-amber-800 dark:bg-amber-900 dark:text-amber-200 px-1 rounded">Pro</span>
                </Button>
              }>
                <Button 
                  size="sm" 
                  variant="outline"
                  className="flex items-center text-xs px-2 py-1 h-auto dark:border-gray-700 dark:hover:bg-gray-700"
                  onClick={exportToExcel}
                >
                  <FileSpreadsheet className="h-3 w-3 mr-1" />
                  XLS
                </Button>
              </ProFeature>
            </>
          )}
          
          <Button 
            size="sm" 
            variant="outline" 
            onClick={() => navigate("/dashboard/transacoes")}
            className="dark:border-gray-700 dark:hover:bg-gray-700"
          >
            Ver todas
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <Loader2 className="h-6 w-6 animate-spin text-finance-primary" />
          </div>
        ) : convertedTransactions && convertedTransactions.length > 0 ? (
          <div className="space-y-4">
            {convertedTransactions.map((transaction) => (
              <div key={transaction.id} className="flex justify-between p-3 border-b dark:border-gray-700">
                <div>
                  <p className="font-medium dark:text-gray-200">{transaction.name}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{transaction.category}</p>
                </div>
                <div className="flex items-center gap-2">
                  <p className={`font-medium ${
                    transaction.type === "income" ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                  }`}>
                    {transaction.type === "income" ? "+" : "-"}
                    {formatCurrency(transaction.amount, activeCurrency)}
                  </p>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="sm" className="text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 p-0 h-auto">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="dark:bg-gray-800 dark:text-gray-100">
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Excluir {transaction.type === "income" ? "receita" : "despesa"}
                        </AlertDialogTitle>
                        <AlertDialogDescription className="dark:text-gray-300">
                          Tem certeza que deseja excluir "{transaction.name}"? Esta ação não pode ser desfeita.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600">Cancelar</AlertDialogCancel>
                        <AlertDialogAction 
                          className="bg-red-600 text-white hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800"
                          onClick={() => handleDelete(transaction)}
                        >
                          Excluir
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                  <p className="text-xs text-gray-500 dark:text-gray-400 ml-1">{transaction.date}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">Nenhuma transação encontrada</p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
              Adicione receitas ou despesas para visualizar suas transações recentes
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentTransactions;

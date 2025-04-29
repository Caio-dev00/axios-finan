
import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ArrowUpCircle, ArrowDownCircle, Wallet } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useQuery } from "@tanstack/react-query";
import { getFinancialSummary } from "@/services/financeService";
import { useCurrency } from "@/contexts/CurrencyContext";
import { convertCurrency, formatCurrency } from "@/services/currencyService";

const FinancialSummary = () => {
  const { activeCurrency, isLoading: currencyLoading } = useCurrency();
  
  const {
    data,
    isLoading: dataLoading
  } = useQuery({
    queryKey: ["financialSummary", activeCurrency],
    queryFn: getFinancialSummary
  });

  const isLoading = dataLoading || currencyLoading;
  
  if (isLoading) {
    return <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map(i => <Card key={i} className="bg-white shadow-sm animate-pulse">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <div className="h-4 w-24 bg-gray-200 rounded"></div>
              <div className="h-4 w-4 bg-gray-200 rounded-full"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 w-32 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 w-40 bg-gray-100 rounded"></div>
            </CardContent>
          </Card>)}
      </div>;
  }

  const currentMonth = format(new Date(), 'MMMM/yyyy', {
    locale: ptBR
  });
  const lastUpdated = data?.lastUpdate ? format(new Date(data.lastUpdate), "'hoje às' HH:mm") : "";

  // Convert values based on active currency
  const currentBalanceConverted = data ? convertCurrency(data.currentBalance, 'BRL', activeCurrency) : 0;
  const totalIncomeConverted = data ? convertCurrency(data.totalIncome, 'BRL', activeCurrency) : 0;
  const totalExpenseConverted = data ? convertCurrency(data.totalExpense, 'BRL', activeCurrency) : 0;

  return <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="bg-white shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <h3 className="text-sm font-medium text-slate-800">Saldo Atual</h3>
          <Wallet className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-finance-primary">
            {formatCurrency(currentBalanceConverted, activeCurrency)}
          </div>
          <p className="text-xs text-muted-foreground">
            Atualizado: {lastUpdated}
          </p>
        </CardContent>
      </Card>
      
      <Card className="bg-white shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <h3 className="text-sm font-medium text-slate-800">Receitas ({currentMonth})</h3>
          <ArrowUpCircle className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">
            {formatCurrency(totalIncomeConverted, activeCurrency)}
          </div>
          <p className="text-xs text-muted-foreground">
            {data?.incomeChange > 0 ? "+" : ""}{data?.incomeChange}% em relação ao mês anterior
          </p>
        </CardContent>
      </Card>
      
      <Card className="bg-white shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <h3 className="text-sm font-medium text-slate-800">Despesas ({currentMonth})</h3>
          <ArrowDownCircle className="h-4 w-4 text-red-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">
            {formatCurrency(totalExpenseConverted, activeCurrency)}
          </div>
          <p className="text-xs text-muted-foreground">
            {data?.expenseChange < 0 ? "" : "+"}{data?.expenseChange}% em relação ao mês anterior
          </p>
        </CardContent>
      </Card>
    </div>;
};

export default FinancialSummary;

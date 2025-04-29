
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getExpensesByCategory } from "@/services/expenseService";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { useCurrency } from "@/contexts/CurrencyContext";
import { convertCurrency, formatCurrency } from "@/services/currencyService";

const COLORS = [
  "#3B82F6", // blue-500
  "#10B981", // green-500
  "#F59E0B", // amber-500
  "#EF4444", // red-500
  "#8B5CF6", // violet-500
  "#EC4899", // pink-500
  "#06B6D4", // cyan-500
  "#F97316", // orange-500
  "#6366F1", // indigo-500
];

const ExpenseDistribution = () => {
  const { activeCurrency } = useCurrency();
  
  const { data: categories, isLoading } = useQuery({
    queryKey: ["expenseCategories", activeCurrency],
    queryFn: getExpensesByCategory,
  });

  // Convert category amounts to the active currency
  const convertedCategories = React.useMemo(() => {
    if (!categories) return [];
    
    return categories.map(category => ({
      ...category,
      amount: convertCurrency(category.amount, 'BRL', activeCurrency),
      // Percentage stays the same regardless of currency
    }));
  }, [categories, activeCurrency]);

  return (
    <Card className="shadow-sm h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">Distribuição de Gastos</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center h-48">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : convertedCategories && convertedCategories.length > 0 ? (
          <>
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={convertedCategories}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    innerRadius={40}
                    fill="#8884d8"
                    dataKey="amount"
                    nameKey="name"
                  >
                    {convertedCategories.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => formatCurrency(Number(value), activeCurrency)} 
                    labelFormatter={(name) => `Categoria: ${name}`}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-4 space-y-2 text-sm">
              {convertedCategories.map((category, index) => (
                <div key={category.name} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div 
                      className={`w-3 h-3 rounded-full mr-2`} 
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    ></div>
                    <span>{category.name}</span>
                  </div>
                  <span>{category.percentage}%</span>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-48 text-center">
            <p className="text-gray-500">Nenhum dado disponível</p>
            <p className="text-sm text-gray-400 mt-1">
              Adicione despesas para visualizar a distribuição
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ExpenseDistribution;

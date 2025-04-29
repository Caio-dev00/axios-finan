
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type ExpenseCategory = {
  name: string;
  percentage: number;
  color: string;
};

const ExpenseDistribution = () => {
  // Mock data - would be replaced with real data from the API
  const categories: ExpenseCategory[] = [
    { name: "Alimentação", percentage: 35, color: "bg-finance-primary" },
    { name: "Moradia", percentage: 25, color: "bg-finance-secondary" },
    { name: "Transporte", percentage: 15, color: "bg-finance-danger" },
    { name: "Outros", percentage: 25, color: "bg-finance-warning" }
  ];

  return (
    <Card className="shadow-sm h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">Distribuição de Gastos</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-center">
          <div className="w-full h-48 rounded-lg bg-gray-100 flex items-center justify-center">
            {/* Circle chart placeholder - would be replaced with a real chart */}
            <div className="relative w-32 h-32 rounded-full bg-gray-200">
              <div className="absolute inset-4 bg-white rounded-full flex items-center justify-center">
                <span className="text-sm font-medium">100%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 space-y-2 text-sm">
          {categories.map((category) => (
            <div key={category.name} className="flex items-center justify-between">
              <div className="flex items-center">
                <div className={`w-3 h-3 ${category.color} rounded-full mr-2`}></div>
                <span>{category.name}</span>
              </div>
              <span>{category.percentage}%</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ExpenseDistribution;

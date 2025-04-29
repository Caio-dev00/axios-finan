
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type Transaction = {
  id: string;
  name: string;
  category: string;
  amount: number;
  date: string;
  type: "income" | "expense";
};

const RecentTransactions = () => {
  // Mock data - would be replaced with real data from the API
  const transactions: Transaction[] = [
    {
      id: "1",
      name: "Supermercado Extra",
      category: "Alimentação",
      amount: 235.45,
      date: "Hoje, 10:30",
      type: "expense"
    },
    {
      id: "2",
      name: "Salário",
      category: "Receita",
      amount: 4500.00,
      date: "Ontem, 08:00",
      type: "income"
    },
    {
      id: "3",
      name: "Netflix",
      category: "Entretenimento",
      amount: 55.90,
      date: "25/04/2025",
      type: "expense"
    },
    {
      id: "4",
      name: "Uber",
      category: "Transporte",
      amount: 32.50,
      date: "24/04/2025",
      type: "expense"
    }
  ];

  return (
    <Card className="shadow-sm h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium">Transações Recentes</CardTitle>
        <Button size="sm" variant="outline">
          Ver todas
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {transactions.map((transaction) => (
            <div key={transaction.id} className="flex justify-between p-3 border-b">
              <div>
                <p className="font-medium">{transaction.name}</p>
                <p className="text-sm text-gray-500">{transaction.category}</p>
              </div>
              <div className="text-right">
                <p className={`font-medium ${
                  transaction.type === "income" ? "text-green-600" : "text-red-600"
                }`}>
                  {transaction.type === "income" ? "+" : "-"}
                  R$ {transaction.amount.toFixed(2)}
                </p>
                <p className="text-xs text-gray-500">{transaction.date}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentTransactions;

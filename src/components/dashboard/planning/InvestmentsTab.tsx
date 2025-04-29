
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import InvestmentDistributionItem from "./InvestmentDistributionItem";

const InvestmentsTab = () => {
  // Sample investment data - in a real app, this would come from an API or state
  const investments = [
    { id: 1, label: "Renda Fixa", percentage: 45, amount: 35302.64, color: "bg-blue-600" },
    { id: 2, label: "Ações", percentage: 30, amount: 23535.10, color: "bg-green-600" },
    { id: 3, label: "Fundos Imobiliários", percentage: 15, amount: 11767.55, color: "bg-yellow-600" },
    { id: 4, label: "Internacional", percentage: 10, amount: 7845.03, color: "bg-purple-600" }
  ];
  
  const totalInvestment = 78450.32;
  
  return (
    <div className="grid grid-cols-1 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Carteira de Investimentos</CardTitle>
          <CardDescription>Distribuição atual dos seus investimentos</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Valor total investido</h3>
              <p className="text-xl font-bold">R$ {totalInvestment.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium mb-4">Distribuição por classe de ativo</h3>
              <div className="space-y-4">
                {investments.map((investment) => (
                  <InvestmentDistributionItem
                    key={investment.id}
                    label={investment.label}
                    percentage={investment.percentage}
                    amount={investment.amount}
                    color={investment.color}
                  />
                ))}
              </div>
            </div>

            <div className="pt-4 border-t">
              <h3 className="text-sm font-medium mb-2">Rendimento da carteira</h3>
              <div className="flex justify-between">
                <span>Este mês:</span>
                <span className="font-medium text-green-600">+2,1% (R$ 1.647,46)</span>
              </div>
              <div className="flex justify-between">
                <span>Últimos 12 meses:</span>
                <span className="font-medium text-green-600">+14,8% (R$ 11.610,65)</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InvestmentsTab;

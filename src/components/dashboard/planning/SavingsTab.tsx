
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const SavingsTab = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Resumo de Poupança</CardTitle>
          <CardDescription>Visão geral das suas economias</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span>Saldo total poupança:</span>
              <span className="font-bold">R$ 24.200,00</span>
            </div>
            <div className="flex justify-between">
              <span>Economizado este mês:</span>
              <span className="font-bold text-green-600">+ R$ 1.200,00</span>
            </div>
            <div className="flex justify-between">
              <span>Rendimentos este mês:</span>
              <span className="font-bold text-green-600">+ R$ 86,42</span>
            </div>
            <div className="flex justify-between">
              <span>Taxa de economia mensal:</span>
              <span className="font-bold">12% da renda</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Dicas de Poupança</CardTitle>
          <CardDescription>Estratégias para melhorar suas economias</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 list-disc pl-5">
            <li>Economize automaticamente 10-20% da sua renda mensal</li>
            <li>Mantenha um fundo de emergência de 3-6 meses de despesas</li>
            <li>Considere investimentos de renda fixa para preservar capital</li>
            <li>Revise despesas recorrentes e elimine gastos desnecessários</li>
            <li>Use a regra 50/30/20: 50% para necessidades, 30% para desejos, 20% para poupança</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default SavingsTab;

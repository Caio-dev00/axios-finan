
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const FinancialTips = () => {
  const tips = [
    {
      title: "Regra 50/30/20",
      content: "Destine 50% da sua renda para necessidades, 30% para desejos e 20% para investimentos e economia."
    },
    {
      title: "Fundo de Emergência",
      content: "Mantenha um fundo de emergência equivalente a pelo menos 6 meses dos seus gastos mensais."
    },
    {
      title: "Automatize suas economias",
      content: "Configure transferências automáticas para sua conta de investimentos logo após receber seu salário."
    }
  ];

  return (
    <section className="py-16 bg-white" id="dicas">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold text-finance-dark mb-4">Dicas financeiras</h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Conselhos práticos para melhorar sua saúde financeira e alcançar seus objetivos.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {tips.map((tip, index) => (
            <Card key={index} className="bg-finance-light border-none">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-finance-dark">{tip.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">{tip.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <p className="text-gray-700 mb-4">
            Os assinantes do plano Pro recebem dicas personalizadas semanalmente com base em seu perfil financeiro.
          </p>
        </div>
      </div>
    </section>
  );
};

export default FinancialTips;

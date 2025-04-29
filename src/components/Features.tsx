
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Features = () => {
  const features = [
    {
      title: "Registro Rápido",
      description: "Registre suas despesas e receitas de forma rápida e intuitiva, categorizando automaticamente suas transações.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-finance-primary">
          <path d="M15 5v14"></path><path d="M9 6v12"></path><path d="M3 9h18"></path><path d="M3 15h18"></path>
        </svg>
      )
    },
    {
      title: "Acompanhamento de Saldo",
      description: "Visualize seu saldo diário, semanal e mensal em tempo real, com notificações inteligentes.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-finance-primary">
          <path d="M22 12L2 12"></path><path d="M5 15l-3-3 3-3"></path><path d="M19 9l3 3-3 3"></path>
        </svg>
      )
    },
    {
      title: "Gráficos Intuitivos",
      description: "Visualize seus hábitos financeiros através de gráficos interativos e personalizáveis.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-finance-primary">
          <path d="M3 3v18h18"></path><path d="M18 17V9"></path><path d="M13 17V5"></path><path d="M8 17v-3"></path>
        </svg>
      )
    },
    {
      title: "Relatórios em PDF",
      description: "Exportação de relatórios detalhados em PDF para análise posterior ou impressão.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-finance-primary">
          <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
        </svg>
      )
    },
    {
      title: "Planejamento Financeiro",
      description: "Crie metas financeiras e acompanhe seu progresso com planos personalizados.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-finance-primary">
          <circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline>
        </svg>
      )
    },
    {
      title: "Dicas de Economia",
      description: "Receba dicas personalizadas com base nos seus hábitos de gastos para economizar mais.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-finance-primary">
          <circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line>
        </svg>
      )
    }
  ];

  return (
    <section className="py-16 bg-finance-gray" id="recursos">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold text-finance-dark mb-4">Recursos Poderosos</h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Tudo o que você precisa para gerenciar suas finanças de forma inteligente e eficaz.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="bg-white border-none shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center gap-4">
                <div className="bg-finance-light p-2 rounded-lg">
                  {feature.icon}
                </div>
                <CardTitle className="text-xl font-semibold">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600">{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;

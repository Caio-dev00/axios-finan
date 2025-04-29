
import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const DashboardDemo = () => {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold text-finance-dark mb-4">Visualize suas finanças de forma clara</h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Dashboard intuitivo e personalizável que permite acompanhar suas finanças de um jeito simples e eficaz.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white shadow-md">
            <CardHeader className="pb-2">
              <h3 className="text-lg font-semibold text-gray-700">Saldo Atual</h3>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-finance-primary">R$ 4.250,00</p>
              <p className="text-sm text-gray-500">Atualizado: hoje às 14:30</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white shadow-md">
            <CardHeader className="pb-2">
              <h3 className="text-lg font-semibold text-gray-700">Receitas (Abr/2025)</h3>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-finance-primary">R$ 6.800,00</p>
              <p className="text-sm text-gray-500">+12% em relação ao mês anterior</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white shadow-md">
            <CardHeader className="pb-2">
              <h3 className="text-lg font-semibold text-gray-700">Despesas (Abr/2025)</h3>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-finance-danger">R$ 2.550,00</p>
              <p className="text-sm text-gray-500">-5% em relação ao mês anterior</p>
            </CardContent>
          </Card>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-6">
          <Card className="bg-white shadow-md lg:w-2/3">
            <CardHeader className="pb-2">
              <h3 className="text-lg font-semibold text-gray-700">Histórico de Transações</h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between p-3 border-b">
                  <div>
                    <p className="font-medium">Supermercado Extra</p>
                    <p className="text-sm text-gray-500">Alimentação</p>
                  </div>
                  <div className="text-right">
                    <p className="text-finance-danger font-medium">-R$ 235,45</p>
                    <p className="text-xs text-gray-500">Hoje, 10:30</p>
                  </div>
                </div>
                <div className="flex justify-between p-3 border-b">
                  <div>
                    <p className="font-medium">Salário</p>
                    <p className="text-sm text-gray-500">Receita</p>
                  </div>
                  <div className="text-right">
                    <p className="text-finance-primary font-medium">+R$ 4.500,00</p>
                    <p className="text-xs text-gray-500">Ontem, 08:00</p>
                  </div>
                </div>
                <div className="flex justify-between p-3 border-b">
                  <div>
                    <p className="font-medium">Netflix</p>
                    <p className="text-sm text-gray-500">Entretenimento</p>
                  </div>
                  <div className="text-right">
                    <p className="text-finance-danger font-medium">-R$ 55,90</p>
                    <p className="text-xs text-gray-500">25/04/2025</p>
                  </div>
                </div>
                <div className="flex justify-between p-3 border-b">
                  <div>
                    <p className="font-medium">Uber</p>
                    <p className="text-sm text-gray-500">Transporte</p>
                  </div>
                  <div className="text-right">
                    <p className="text-finance-danger font-medium">-R$ 32,50</p>
                    <p className="text-xs text-gray-500">24/04/2025</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white shadow-md lg:w-1/3">
            <CardHeader className="pb-2">
              <h3 className="text-lg font-semibold text-gray-700">Distribuição de Gastos</h3>
            </CardHeader>
            <CardContent className="flex justify-center">
              <div className="w-full h-64 rounded-lg bg-gray-100 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-gray-500">Gráfico de distribuição</p>
                  <div className="mt-3 space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-finance-primary rounded-full mr-2"></div>
                        <span>Alimentação</span>
                      </div>
                      <span>35%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-finance-secondary rounded-full mr-2"></div>
                        <span>Moradia</span>
                      </div>
                      <span>25%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-finance-danger rounded-full mr-2"></div>
                        <span>Transporte</span>
                      </div>
                      <span>15%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-finance-warning rounded-full mr-2"></div>
                        <span>Outros</span>
                      </div>
                      <span>25%</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default DashboardDemo;

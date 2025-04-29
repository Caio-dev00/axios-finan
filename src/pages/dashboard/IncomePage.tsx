
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";

const IncomePage = () => {
  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gerenciar Receitas</h1>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Nova Receita
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Receitas Recentes</CardTitle>
            <CardDescription>Visualize e gerencie suas receitas mais recentes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-md">
                <div>
                  <p className="font-medium">Salário</p>
                  <p className="text-sm text-gray-500">05 de maio, 2025</p>
                </div>
                <p className="font-semibold text-green-600">+ R$ 3.500,00</p>
              </div>
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-md">
                <div>
                  <p className="font-medium">Freelance</p>
                  <p className="text-sm text-gray-500">15 de abril, 2025</p>
                </div>
                <p className="font-semibold text-green-600">+ R$ 850,00</p>
              </div>
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-md">
                <div>
                  <p className="font-medium">Dividendos</p>
                  <p className="text-sm text-gray-500">01 de abril, 2025</p>
                </div>
                <p className="font-semibold text-green-600">+ R$ 127,35</p>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">Ver todas as receitas</Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Resumo de Receitas</CardTitle>
            <CardDescription>Análise das suas fontes de renda</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex flex-col gap-2">
                <div className="flex justify-between">
                  <span>Total este mês:</span>
                  <span className="font-bold text-green-600">R$ 4.477,35</span>
                </div>
                <div className="flex justify-between">
                  <span>Média mensal (último 6 meses):</span>
                  <span className="font-bold">R$ 4.210,55</span>
                </div>
                <div className="flex justify-between">
                  <span>Projeção anual:</span>
                  <span className="font-bold">R$ 50.526,60</span>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-sm font-medium mb-2">Distribuição por fonte</h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span>Salário</span>
                    <span>78%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-green-600 h-2.5 rounded-full" style={{ width: "78%" }}></div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span>Freelance</span>
                    <span>19%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-green-600 h-2.5 rounded-full" style={{ width: "19%" }}></div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span>Dividendos</span>
                    <span>3%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-green-600 h-2.5 rounded-full" style={{ width: "3%" }}></div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default IncomePage;

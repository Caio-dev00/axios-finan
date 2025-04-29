
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const BudgetsPage = () => {
  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Orçamentos</h1>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Novo Orçamento
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="p-6 bg-white rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold mb-2">Total Orçado</h3>
          <p className="text-3xl font-bold text-gray-800">R$ 4.350,00</p>
          <p className="text-sm text-gray-500 mt-1">para o mês atual</p>
        </div>

        <div className="p-6 bg-white rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold mb-2">Total Gasto</h3>
          <p className="text-3xl font-bold text-gray-800">R$ 2.760,45</p>
          <p className="text-sm text-gray-500 mt-1">63,5% do orçamento total</p>
        </div>

        <div className="p-6 bg-white rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold mb-2">Saldo Restante</h3>
          <p className="text-3xl font-bold text-green-600">R$ 1.589,55</p>
          <p className="text-sm text-gray-500 mt-1">36,5% do orçamento restante</p>
        </div>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Orçamentos por Categoria</CardTitle>
          <CardDescription>Acompanhe o progresso dos seus orçamentos mensais</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between mb-2">
                <div>
                  <h4 className="font-medium">Alimentação</h4>
                  <p className="text-sm text-gray-500">R$ 850,00 orçado</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">R$ 620,35 gastos</p>
                  <p className="text-sm text-gray-500">R$ 229,65 restantes</p>
                </div>
              </div>
              <Progress value={73} className="h-2" />
              <p className="text-xs text-right mt-1 text-gray-500">73% usado</p>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <div>
                  <h4 className="font-medium">Moradia</h4>
                  <p className="text-sm text-gray-500">R$ 1.500,00 orçado</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">R$ 1.200,00 gastos</p>
                  <p className="text-sm text-gray-500">R$ 300,00 restantes</p>
                </div>
              </div>
              <Progress value={80} className="h-2" />
              <p className="text-xs text-right mt-1 text-gray-500">80% usado</p>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <div>
                  <h4 className="font-medium">Transporte</h4>
                  <p className="text-sm text-gray-500">R$ 500,00 orçado</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">R$ 320,10 gastos</p>
                  <p className="text-sm text-gray-500">R$ 179,90 restantes</p>
                </div>
              </div>
              <Progress value={64} className="h-2" />
              <p className="text-xs text-right mt-1 text-gray-500">64% usado</p>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <div>
                  <h4 className="font-medium">Lazer</h4>
                  <p className="text-sm text-gray-500">R$ 400,00 orçado</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">R$ 250,00 gastos</p>
                  <p className="text-sm text-gray-500">R$ 150,00 restantes</p>
                </div>
              </div>
              <Progress value={63} className="h-2" />
              <p className="text-xs text-right mt-1 text-gray-500">63% usado</p>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <div>
                  <h4 className="font-medium">Saúde</h4>
                  <p className="text-sm text-gray-500">R$ 600,00 orçado</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">R$ 370,00 gastos</p>
                  <p className="text-sm text-gray-500">R$ 230,00 restantes</p>
                </div>
              </div>
              <Progress value={62} className="h-2" />
              <p className="text-xs text-right mt-1 text-gray-500">62% usado</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BudgetsPage;

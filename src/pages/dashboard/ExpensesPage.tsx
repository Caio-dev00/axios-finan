
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ExpensesPage = () => {
  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gerenciar Despesas</h1>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Nova Despesa
        </Button>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="all">Todas</TabsTrigger>
          <TabsTrigger value="recurring">Recorrentes</TabsTrigger>
          <TabsTrigger value="oneTime">Únicas</TabsTrigger>
          <TabsTrigger value="categories">Categorias</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Despesas recentes</CardTitle>
              <CardDescription>Visualize e gerencie suas despesas mais recentes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-md">
                  <div>
                    <p className="font-medium">Supermercado</p>
                    <p className="text-sm text-gray-500">12 de maio, 2025</p>
                  </div>
                  <p className="font-semibold text-red-600">- R$ 235,45</p>
                </div>
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-md">
                  <div>
                    <p className="font-medium">Aluguel</p>
                    <p className="text-sm text-gray-500">05 de maio, 2025</p>
                  </div>
                  <p className="font-semibold text-red-600">- R$ 1.200,00</p>
                </div>
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-md">
                  <div>
                    <p className="font-medium">Conta de Energia</p>
                    <p className="text-sm text-gray-500">03 de maio, 2025</p>
                  </div>
                  <p className="font-semibold text-red-600">- R$ 143,78</p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">Ver todas as despesas</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="recurring" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Despesas Recorrentes</CardTitle>
              <CardDescription>Despesas mensais ou periódicas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-md">
                  <div>
                    <p className="font-medium">Netflix</p>
                    <p className="text-sm text-gray-500">Mensal - Dia 15</p>
                  </div>
                  <p className="font-semibold text-red-600">- R$ 39,90</p>
                </div>
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-md">
                  <div>
                    <p className="font-medium">Academia</p>
                    <p className="text-sm text-gray-500">Mensal - Dia 10</p>
                  </div>
                  <p className="font-semibold text-red-600">- R$ 89,90</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="oneTime">
          <Card>
            <CardHeader>
              <CardTitle>Despesas Únicas</CardTitle>
              <CardDescription>Pagamentos não recorrentes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-md">
                  <div>
                    <p className="font-medium">Compra eletrônicos</p>
                    <p className="text-sm text-gray-500">22 de abril, 2025</p>
                  </div>
                  <p className="font-semibold text-red-600">- R$ 1.459,00</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="categories">
          <Card>
            <CardHeader>
              <CardTitle>Categorias de Despesas</CardTitle>
              <CardDescription>Gerencie suas categorias de despesas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 bg-gray-50 rounded-md text-center">
                  <p className="font-medium">Alimentação</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-md text-center">
                  <p className="font-medium">Moradia</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-md text-center">
                  <p className="font-medium">Transporte</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-md text-center">
                  <p className="font-medium">Saúde</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-md text-center">
                  <p className="font-medium">Educação</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-md text-center">
                  <p className="font-medium">Lazer</p>
                </div>
              </div>
              <div className="mt-4">
                <Button variant="outline" className="w-full">Adicionar nova categoria</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ExpensesPage;


import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus } from "lucide-react";

const PlanningPage = () => {
  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Planejamento Financeiro</h1>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Nova Meta
        </Button>
      </div>

      <Tabs defaultValue="goals" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="goals">Metas Financeiras</TabsTrigger>
          <TabsTrigger value="savings">Poupança</TabsTrigger>
          <TabsTrigger value="investments">Investimentos</TabsTrigger>
        </TabsList>
        
        <TabsContent value="goals">
          <div className="grid grid-cols-1 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Suas Metas Financeiras</CardTitle>
                <CardDescription>Acompanhe e gerencie suas metas financeiras</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <div>
                        <h3 className="text-lg font-medium">Férias em Cancún</h3>
                        <p className="text-sm text-gray-500">Meta para dezembro 2025</p>
                      </div>
                      <p className="font-semibold">R$ 8.000,00</p>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span>R$ 2.500,00 economizados</span>
                      <span>31%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: "31%" }}></div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <div>
                        <h3 className="text-lg font-medium">Entrada para apartamento</h3>
                        <p className="text-sm text-gray-500">Meta para junho 2026</p>
                      </div>
                      <p className="font-semibold">R$ 40.000,00</p>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span>R$ 18.500,00 economizados</span>
                      <span>46%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: "46%" }}></div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <div>
                        <h3 className="text-lg font-medium">Novo notebook</h3>
                        <p className="text-sm text-gray-500">Meta para agosto 2025</p>
                      </div>
                      <p className="font-semibold">R$ 5.500,00</p>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span>R$ 3.200,00 economizados</span>
                      <span>58%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: "58%" }}></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="savings">
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
        </TabsContent>
        
        <TabsContent value="investments">
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
                    <p className="text-xl font-bold">R$ 78.450,32</p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium mb-4">Distribuição por classe de ativo</h3>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span>Renda Fixa</span>
                          <span>45% (R$ 35.302,64)</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: "45%" }}></div>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between mb-1">
                          <span>Ações</span>
                          <span>30% (R$ 23.535,10)</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div className="bg-green-600 h-2.5 rounded-full" style={{ width: "30%" }}></div>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between mb-1">
                          <span>Fundos Imobiliários</span>
                          <span>15% (R$ 11.767,55)</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div className="bg-yellow-600 h-2.5 rounded-full" style={{ width: "15%" }}></div>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between mb-1">
                          <span>Internacional</span>
                          <span>10% (R$ 7.845,03)</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div className="bg-purple-600 h-2.5 rounded-full" style={{ width: "10%" }}></div>
                        </div>
                      </div>
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
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PlanningPage;

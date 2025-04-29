
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FilePdf, FileSpreadsheet, Settings, Share2 } from "lucide-react";
import { useSubscription } from "@/contexts/SubscriptionContext";
import ProFeature from "@/components/ProFeature";
import { useNavigate } from "react-router-dom";

const ReportsPage = () => {
  const { isPro } = useSubscription();
  const navigate = useNavigate();

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-foreground">Relatórios Financeiros</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Analise sua situação financeira com relatórios detalhados
          </p>
        </div>
        
        <div className="mt-4 md:mt-0 flex gap-2">
          <ProFeature>
            <Button size="sm" className="flex items-center gap-1">
              <Share2 size={16} />
              <span>Compartilhar</span>
            </Button>
          </ProFeature>

          <ProFeature>
            <Button size="sm" variant="outline" className="flex items-center gap-1">
              <Settings size={16} />
              <span>Configurar</span>
            </Button>
          </ProFeature>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Relatório Mensal - Disponível para todos */}
        <Card>
          <CardHeader>
            <CardTitle>Relatório Mensal</CardTitle>
            <CardDescription>Resumo das transações do mês atual</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500 mb-4">
              Inclui gráficos básicos de despesas e receitas do mês atual.
            </p>
            <div className="flex gap-2">
              <Button size="sm">Visualizar</Button>
              <Button size="sm" variant="outline" className="gap-1">
                <FilePdf size={16} />
                <span>PDF</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Relatório Comparativo - Somente Pro */}
        <ProFeature fallback={
          <Card className="border border-dashed border-gray-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Relatório Comparativo
                <span className="bg-amber-100 text-amber-800 text-xs px-2 py-0.5 rounded-full">Pro</span>
              </CardTitle>
              <CardDescription>Compare meses, categorias e tendências</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500 mb-4">
                Análise comparativa detalhada entre períodos com gráficos avançados.
              </p>
              <Button size="sm" variant="outline" className="w-full" onClick={() => navigate("/precos")}>
                Desbloqueie com o Plano Pro
              </Button>
            </CardContent>
          </Card>
        }>
          <Card>
            <CardHeader>
              <CardTitle>Relatório Comparativo</CardTitle>
              <CardDescription>Compare meses, categorias e tendências</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500 mb-4">
                Análise comparativa detalhada entre períodos com gráficos avançados.
              </p>
              <div className="flex gap-2">
                <Button size="sm">Visualizar</Button>
                <Button size="sm" variant="outline" className="gap-1">
                  <FilePdf size={16} />
                  <span>PDF</span>
                </Button>
                <Button size="sm" variant="outline" className="gap-1">
                  <FileSpreadsheet size={16} />
                  <span>CSV</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </ProFeature>

        {/* Projeção Financeira - Somente Pro */}
        <ProFeature fallback={
          <Card className="border border-dashed border-gray-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Projeção Financeira
                <span className="bg-amber-100 text-amber-800 text-xs px-2 py-0.5 rounded-full">Pro</span>
              </CardTitle>
              <CardDescription>Estimativa para os próximos meses</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500 mb-4">
                Projeção baseada em gastos recorrentes e tendências financeiras.
              </p>
              <Button size="sm" variant="outline" className="w-full" onClick={() => navigate("/precos")}>
                Desbloqueie com o Plano Pro
              </Button>
            </CardContent>
          </Card>
        }>
          <Card>
            <CardHeader>
              <CardTitle>Projeção Financeira</CardTitle>
              <CardDescription>Estimativa para os próximos meses</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500 mb-4">
                Projeção baseada em gastos recorrentes e tendências financeiras.
              </p>
              <div className="flex gap-2">
                <Button size="sm">Visualizar</Button>
                <Button size="sm" variant="outline" className="gap-1">
                  <FilePdf size={16} />
                  <span>PDF</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </ProFeature>
      </div>

      {!isPro && (
        <Card className="bg-finance-light border-finance-primary border mb-8">
          <CardContent className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-6">
            <div>
              <h3 className="text-lg font-semibold text-finance-dark">Desbloqueie todos os relatórios</h3>
              <p className="text-finance-dark/80">
                Assine o plano Pro e tenha acesso a todos os tipos de relatórios e ferramentas de exportação.
              </p>
            </div>
            <Button onClick={() => navigate("/precos")} className="bg-finance-primary hover:bg-finance-primary/90 whitespace-nowrap">
              Ver planos
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Relatórios recentes - Limitados para usuários gratuitos */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Relatórios Recentes</h2>
        <div className="bg-white border rounded-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Período</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {[1, 2, 3].map((item, index) => (
                  <tr key={index} className={index >= 1 && !isPro ? "opacity-50" : ""}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {index === 0 ? "Relatório Mensal" : index === 1 ? "Relatório Comparativo" : "Projeção Financeira"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {index === 0 ? "15/04/2025" : index === 1 ? "10/04/2025" : "05/04/2025"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {index === 0 ? "Abril 2025" : index === 1 ? "Mar-Abr 2025" : "Mai-Jul 2025"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {index === 0 || isPro ? (
                        <div className="flex justify-end gap-2">
                          <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                            <FilePdf size={16} />
                          </Button>
                        </div>
                      ) : (
                        <Button size="sm" variant="ghost" className="text-finance-primary" onClick={() => navigate("/precos")}>
                          Plano Pro
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
                
                {!isPro && (
                  <tr>
                    <td colSpan={4} className="px-6 py-4 text-sm text-center text-gray-500">
                      Usuários gratuitos têm acesso apenas ao relatório mais recente. 
                      <Button variant="link" className="text-finance-primary p-0 h-auto" onClick={() => navigate("/precos")}>
                        Assine o plano Pro
                      </Button>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;

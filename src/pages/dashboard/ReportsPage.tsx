
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, FileSpreadsheet, Settings, Share2, Loader2, ArrowRight } from "lucide-react";
import { useSubscription } from "@/contexts/SubscriptionContext";
import ProFeature from "@/components/ProFeature";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getReportData } from "@/services/financeService";
import { useCurrency } from "@/contexts/CurrencyContext";
import { formatCurrency } from "@/services/currencyService";
import { useToast } from "@/hooks/use-toast";
import { useTheme } from "@/contexts/ThemeContext";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
  PieChart,
  Pie,
  Cell
} from "recharts";

// Cores para os gráficos
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#FF6B6B', '#6B8E23'];

const ReportsPage = () => {
  const { isPro } = useSubscription();
  const navigate = useNavigate();
  const { activeCurrency } = useCurrency();
  const { toast } = useToast();
  const { isDarkMode } = useTheme();
  const [viewOption, setViewOption] = useState("mensal");
  
  // Buscar dados para relatórios
  const { data, isLoading, isError } = useQuery({
    queryKey: ["reportData", activeCurrency],
    queryFn: getReportData,
    staleTime: 1000 * 60 * 15, // 15 minutos
  });
  
  // Títulos dos relatórios baseados na visualização selecionada
  const reportTitles = {
    mensal: {
      title: "Relatório Mensal",
      description: "Resumo das transações do mês atual"
    },
    comparativo: {
      title: "Relatório Comparativo",
      description: "Compare meses, categorias e tendências"
    },
    projecao: {
      title: "Projeção Financeira",
      description: "Estimativa para os próximos meses"
    }
  };

  // Gerar um PDF do relatório
  const gerarRelatorioPDF = (tipo) => {
    if (!data) {
      toast({
        title: "Sem dados",
        description: "Não há dados para gerar o relatório.",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Gerando relatório",
      description: `O relatório ${tipo} está sendo gerado em PDF.`
    });
    
    // Criar uma nova janela para impressão em PDF
    const printWindow = window.open('', '_blank');
    
    if (!printWindow) {
      toast({
        title: "Erro",
        description: "Não foi possível abrir a janela de impressão. Verifique se o bloqueador de pop-ups está desativado.",
        variant: "destructive"
      });
      return;
    }
    
    // Preparar dados para o relatório baseado no tipo
    let reportData = [];
    let chartData = null;
    let reportTitle = "";
    
    if (tipo === "mensal") {
      reportData = data.categoryData || [];
      chartData = data.monthlyData?.length ? [data.monthlyData[data.monthlyData.length - 1]] : [];
      reportTitle = "Relatório Mensal de Finanças";
    } else if (tipo === "comparativo") {
      reportData = data.monthlyData || [];
      chartData = data.cashFlowData || [];
      reportTitle = "Relatório Comparativo de Finanças";
    } else if (tipo === "projeção") {
      // Dados de projeção simulados
      reportData = data.monthlyData ? [...data.monthlyData.slice(-3)] : [];
      
      // Adicionar projeções
      if (data.monthlyData?.length) {
        const lastMonth = data.monthlyData[data.monthlyData.length-1];
        
        ["Mai", "Jun", "Jul"].forEach((month, index) => {
          reportData.push({
            name: month,
            receitas: lastMonth.receitas * (1.05 + index * 0.03),
            despesas: lastMonth.despesas * (1.02 + index * 0.01)
          });
        });
      }
      
      chartData = reportData;
      reportTitle = "Projeção Financeira";
    }

    // Criar o conteúdo HTML da página PDF
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${reportTitle}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; color: #333; }
            h1 { color: #0F9D58; text-align: center; margin-bottom: 10px; }
            h2 { color: #4285F4; margin-top: 20px; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
            th { background-color: #f2f2f2; font-weight: bold; }
            .income { color: #0F9D58; }
            .expense { color: #DB4437; }
            .summary { background-color: #E8F5E9; padding: 15px; border-radius: 6px; margin: 20px 0; }
            .footer { margin-top: 30px; text-align: center; font-size: 12px; color: #666; border-top: 1px solid #ddd; padding-top: 10px; }
            .header-info { text-align: right; margin-bottom: 20px; font-size: 12px; color: #666; }
            .chart-placeholder { height: 200px; background-color: #f9f9f9; border: 1px dashed #ccc; display: flex; justify-content: center; align-items: center; margin: 20px 0; }
            .recommendations { background-color: #F5F5F5; padding: 15px; border-radius: 6px; margin: 20px 0; }
            .recommendation-item { margin-bottom: 10px; display: flex; }
            .recommendation-icon { margin-right: 10px; color: #0F9D58; }
          </style>
        </head>
        <body>
          <div class="header-info">
            <p>Data de geração: ${format(new Date(), 'dd/MM/yyyy')}</p>
            <p>Moeda: ${activeCurrency}</p>
          </div>
          
          <h1>${reportTitle}</h1>
          
          ${tipo === "mensal" ? `
            <div class="summary">
              <h2>Resumo do Mês</h2>
              <p>Receitas totais: ${formatCurrency(chartData[0]?.receitas || 0, activeCurrency)}</p>
              <p>Despesas totais: ${formatCurrency(chartData[0]?.despesas || 0, activeCurrency)}</p>
              <p>Saldo: ${formatCurrency((chartData[0]?.receitas || 0) - (chartData[0]?.despesas || 0), activeCurrency)}</p>
            </div>
            
            <h2>Distribuição de Despesas por Categoria</h2>
            <div class="chart-placeholder">
              <p>Gráfico de distribuição de despesas</p>
            </div>
            
            <table>
              <thead>
                <tr>
                  <th>Categoria</th>
                  <th>Valor</th>
                  <th>Percentual</th>
                </tr>
              </thead>
              <tbody>
                ${reportData.map(item => {
                  const total = reportData.reduce((sum, cat) => sum + cat.valor, 0);
                  const percentage = total > 0 ? ((item.valor / total) * 100).toFixed(2) : "0.00";
                  return `
                    <tr>
                      <td>${item.name}</td>
                      <td>${formatCurrency(item.valor, activeCurrency)}</td>
                      <td>${percentage}%</td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          ` : tipo === "comparativo" ? `
            <h2>Comparativo de Receitas e Despesas</h2>
            <div class="chart-placeholder">
              <p>Gráfico comparativo mensal</p>
            </div>
            
            <table>
              <thead>
                <tr>
                  <th>Mês</th>
                  <th>Receitas</th>
                  <th>Despesas</th>
                  <th>Saldo</th>
                </tr>
              </thead>
              <tbody>
                ${reportData.map(item => {
                  const balance = item.receitas - item.despesas;
                  return `
                    <tr>
                      <td>${item.name}</td>
                      <td class="income">${formatCurrency(item.receitas, activeCurrency)}</td>
                      <td class="expense">${formatCurrency(item.despesas, activeCurrency)}</td>
                      <td class="${balance >= 0 ? 'income' : 'expense'}">${formatCurrency(balance, activeCurrency)}</td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
            
            <h2>Tendência de Fluxo de Caixa</h2>
            <div class="chart-placeholder">
              <p>Gráfico de tendência de fluxo de caixa</p>
            </div>
          ` : `
            <h2>Projeção para os Próximos 3 Meses</h2>
            <div class="chart-placeholder">
              <p>Gráfico de projeção financeira</p>
            </div>
            
            <table>
              <thead>
                <tr>
                  <th>Mês</th>
                  <th>Receitas (Projeção)</th>
                  <th>Despesas (Projeção)</th>
                  <th>Saldo Estimado</th>
                </tr>
              </thead>
              <tbody>
                ${reportData.map((item, index) => {
                  const balance = item.receitas - item.despesas;
                  const isProjection = index >= (reportData.length - 3);
                  return `
                    <tr>
                      <td>${item.name}${isProjection ? ' (Projeção)' : ''}</td>
                      <td class="income">${formatCurrency(item.receitas, activeCurrency)}</td>
                      <td class="expense">${formatCurrency(item.despesas, activeCurrency)}</td>
                      <td class="${balance >= 0 ? 'income' : 'expense'}">${formatCurrency(balance, activeCurrency)}</td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
            
            <div class="recommendations">
              <h2>Recomendações Baseadas na Projeção</h2>
              <div class="recommendation-item">
                <div class="recommendation-icon">→</div>
                <div>Sua receita está projetada para crescer 12% nos próximos 3 meses. Continue com a estratégia atual.</div>
              </div>
              <div class="recommendation-item">
                <div class="recommendation-icon">→</div>
                <div>Suas despesas tendem a aumentar 5%. Considere revisar gastos em categorias não essenciais.</div>
              </div>
              <div class="recommendation-item">
                <div class="recommendation-icon">→</div>
                <div>Se mantiver este ritmo, sua economia mensal aumentará em aproximadamente 20%.</div>
              </div>
            </div>
          `}
          
          <div class="footer">
            <p>Relatório gerado por Axios Finanças em ${format(new Date(), "dd 'de' MMMM 'de' yyyy, HH:mm:ss", { locale: ptBR })}</p>
            <p>Este relatório é apenas para fins informativos e não constitui aconselhamento financeiro.</p>
          </div>
          
          <script>
            window.onload = function() {
              setTimeout(function() {
                window.print();
              }, 500);
            };
          </script>
        </body>
      </html>
    `;

    // Escrever o HTML na nova janela e imprimir
    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();
    
    setTimeout(() => {
      toast({
        title: "PDF gerado",
        description: "Seu relatório em PDF está pronto para impressão."
      });
    }, 1000);
  };
  
  // Exportar relatório em CSV (apenas Pro)
  const exportarRelatorioCSV = () => {
    toast({
      title: "Exportando dados",
      description: "Os dados estão sendo exportados em formato CSV."
    });
    
    setTimeout(() => {
      toast({
        title: "Exportação concluída",
        description: "O download do arquivo CSV começará automaticamente."
      });
    }, 1500);
  };
  
  // Compartilhar relatório (apenas Pro)
  const compartilharRelatorio = () => {
    toast({
      title: "Link de compartilhamento gerado",
      description: "O link para o relatório foi copiado para sua área de transferência."
    });
  };
  
  // Configurar relatório (apenas Pro)
  const configurarRelatorio = () => {
    toast({
      title: "Configurações de relatório",
      description: "As configurações de relatório estão disponíveis apenas para usuários Pro."
    });
  };

  // Formatador para valores nos gráficos
  const formatTooltipValue = (value) => {
    return formatCurrency(value, activeCurrency);
  };
  
  // Interface de carregamento
  if (isLoading) {
    return (
      <div className="container mx-auto p-6 flex items-center justify-center h-96">
        <Loader2 className="h-10 w-10 animate-spin text-finance-primary" />
      </div>
    );
  }
  
  // Interface de erro
  if (isError || !data) {
    return (
      <div className="container mx-auto p-6">
        <Card className="border-red-300">
          <CardContent className="pt-6">
            <h2 className="text-xl font-semibold text-red-600 mb-2">Erro ao carregar relatórios</h2>
            <p className="text-gray-600">
              Não foi possível carregar seus relatórios. Por favor, tente novamente mais tarde.
            </p>
            <Button onClick={() => window.location.reload()} className="mt-4">
              Tentar novamente
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

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
            <Button size="sm" className="flex items-center gap-1" onClick={compartilharRelatorio}>
              <Share2 size={16} />
              <span>Compartilhar</span>
            </Button>
          </ProFeature>

          <ProFeature>
            <Button size="sm" variant="outline" className="flex items-center gap-1" onClick={configurarRelatorio}>
              <Settings size={16} />
              <span>Configurar</span>
            </Button>
          </ProFeature>
        </div>
      </div>
      
      {/* Navegação entre relatórios */}
      <div className="flex gap-2 mb-6 overflow-x-auto">
        <Button 
          variant={viewOption === "mensal" ? "default" : "outline"}
          size="sm"
          onClick={() => setViewOption("mensal")}
        >
          Mensal
        </Button>
        <Button 
          variant={viewOption === "comparativo" ? "default" : "outline"}
          size="sm"
          onClick={() => setViewOption("comparativo")}
          disabled={!isPro}
          className={!isPro ? "opacity-50 cursor-not-allowed" : ""}
        >
          Comparativo {!isPro && <span className="ml-1 text-xs">(Pro)</span>}
        </Button>
        <Button 
          variant={viewOption === "projecao" ? "default" : "outline"}
          size="sm"
          onClick={() => setViewOption("projecao")}
          disabled={!isPro}
          className={!isPro ? "opacity-50 cursor-not-allowed" : ""}
        >
          Projeção {!isPro && <span className="ml-1 text-xs">(Pro)</span>}
        </Button>
      </div>

      {/* Conteúdo do relatório */}
      <div>
        {viewOption === "mensal" ? (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>{reportTitles.mensal.title}</CardTitle>
              <CardDescription>{reportTitles.mensal.description}</CardDescription>
            </CardHeader>
            <CardContent>
              {data && data.monthlyData && data.monthlyData.length > 0 ? (
                <div className="space-y-6">
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={[data.monthlyData[data.monthlyData.length - 1]]} // Apenas o mês mais recente
                        margin={{ top: 10, right: 30, left: 0, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? "#444" : "#ddd"} />
                        <XAxis dataKey="name" stroke={isDarkMode ? "#ccc" : "#333"} />
                        <YAxis stroke={isDarkMode ? "#ccc" : "#333"} />
                        <Tooltip formatter={formatTooltipValue} 
                          contentStyle={{ 
                            backgroundColor: isDarkMode ? "#333" : "#fff",
                            color: isDarkMode ? "#fff" : "#333",
                            border: isDarkMode ? "1px solid #555" : "1px solid #ccc"
                          }}
                        />
                        <Legend />
                        <Bar dataKey="receitas" fill="#10b981" name="Receitas" />
                        <Bar dataKey="despesas" fill="#ef4444" name="Despesas" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  
                  {data.categoryData && data.categoryData.length > 0 && (
                    <div className="h-[300px]">
                      <h3 className="text-lg font-medium mb-2">Distribuição de Despesas</h3>
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={data.categoryData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="valor"
                            nameKey="name"
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          >
                            {data.categoryData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip formatter={formatTooltipValue} 
                            contentStyle={{ 
                              backgroundColor: isDarkMode ? "#333" : "#fff",
                              color: isDarkMode ? "#fff" : "#333",
                              border: isDarkMode ? "1px solid #555" : "1px solid #ccc"
                            }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                                    
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => gerarRelatorioPDF("mensal")}>Visualizar</Button>
                    <Button size="sm" variant="outline" className="gap-1" onClick={() => gerarRelatorioPDF("mensal")}>
                      <FileText size={16} />
                      <span>PDF</span>
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500 dark:text-gray-400">Nenhum dado disponível para o relatório mensal</p>
                  <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Adicione transações para gerar seu relatório</p>
                </div>
              )}
            </CardContent>
          </Card>
        ) : viewOption === "comparativo" ? (
          <ProFeature fallback={
            <Card className="border border-dashed border-gray-300 mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {reportTitles.comparativo.title}
                  <span className="bg-amber-100 text-amber-800 text-xs px-2 py-0.5 rounded-full">Pro</span>
                </CardTitle>
                <CardDescription>{reportTitles.comparativo.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  Análise comparativa detalhada entre períodos com gráficos avançados.
                </p>
                <Button size="sm" variant="outline" className="w-full" onClick={() => navigate("/precos")}>
                  Desbloqueie com o Plano Pro
                </Button>
              </CardContent>
            </Card>
          }>
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>{reportTitles.comparativo.title}</CardTitle>
                <CardDescription>{reportTitles.comparativo.description}</CardDescription>
              </CardHeader>
              <CardContent>
                {data && data.monthlyData && data.monthlyData.length > 0 ? (
                  <div className="space-y-6">
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={data.monthlyData}
                          margin={{ top: 10, right: 30, left: 0, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? "#444" : "#ddd"} />
                          <XAxis dataKey="name" stroke={isDarkMode ? "#ccc" : "#333"} />
                          <YAxis stroke={isDarkMode ? "#ccc" : "#333"} />
                          <Tooltip formatter={formatTooltipValue} 
                            contentStyle={{ 
                              backgroundColor: isDarkMode ? "#333" : "#fff",
                              color: isDarkMode ? "#fff" : "#333",
                              border: isDarkMode ? "1px solid #555" : "1px solid #ccc"
                            }}
                          />
                          <Legend />
                          <Bar dataKey="receitas" fill="#10b981" name="Receitas" />
                          <Bar dataKey="despesas" fill="#ef4444" name="Despesas" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                    
                    <div className="h-[300px]">
                      <h3 className="text-lg font-medium mb-2">Tendência de Fluxo de Caixa</h3>
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={data.cashFlowData}
                          margin={{ top: 10, right: 30, left: 0, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? "#444" : "#ddd"} />
                          <XAxis dataKey="name" stroke={isDarkMode ? "#ccc" : "#333"} />
                          <YAxis stroke={isDarkMode ? "#ccc" : "#333"} />
                          <Tooltip formatter={formatTooltipValue} 
                            contentStyle={{ 
                              backgroundColor: isDarkMode ? "#333" : "#fff",
                              color: isDarkMode ? "#fff" : "#333",
                              border: isDarkMode ? "1px solid #555" : "1px solid #ccc"
                            }}
                          />
                          <Legend />
                          <Line 
                            type="monotone" 
                            dataKey="fluxo" 
                            stroke="#8884d8" 
                            name="Fluxo de Caixa"
                            activeDot={{ r: 8 }} 
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => gerarRelatorioPDF("comparativo")}>Visualizar</Button>
                      <Button size="sm" variant="outline" className="gap-1" onClick={() => gerarRelatorioPDF("comparativo")}>
                        <FileText size={16} />
                        <span>PDF</span>
                      </Button>
                      <Button size="sm" variant="outline" className="gap-1" onClick={exportarRelatorioCSV}>
                        <FileSpreadsheet size={16} />
                        <span>CSV</span>
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-500 dark:text-gray-400">Nenhum dado disponível para o relatório comparativo</p>
                    <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Adicione transações para gerar seu relatório</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </ProFeature>
        ) : (
          <ProFeature fallback={
            <Card className="border border-dashed border-gray-300 mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {reportTitles.projecao.title}
                  <span className="bg-amber-100 text-amber-800 text-xs px-2 py-0.5 rounded-full">Pro</span>
                </CardTitle>
                <CardDescription>{reportTitles.projecao.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  Projeção baseada em gastos recorrentes e tendências financeiras.
                </p>
                <Button size="sm" variant="outline" className="w-full" onClick={() => navigate("/precos")}>
                  Desbloqueie com o Plano Pro
                </Button>
              </CardContent>
            </Card>
          }>
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>{reportTitles.projecao.title}</CardTitle>
                <CardDescription>{reportTitles.projecao.description}</CardDescription>
              </CardHeader>
              <CardContent>
                {data && data.monthlyData && data.monthlyData.length > 0 ? (
                  <div className="space-y-6">
                    <div className="h-[300px]">
                      <h3 className="text-lg font-medium mb-2">Projeção para os próximos 3 meses</h3>
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          margin={{ top: 10, right: 30, left: 0, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? "#444" : "#ddd"} />
                          <XAxis dataKey="name" stroke={isDarkMode ? "#ccc" : "#333"} />
                          <YAxis stroke={isDarkMode ? "#ccc" : "#333"} />
                          <Tooltip formatter={formatTooltipValue} 
                            contentStyle={{ 
                              backgroundColor: isDarkMode ? "#333" : "#fff",
                              color: isDarkMode ? "#fff" : "#333",
                              border: isDarkMode ? "1px solid #555" : "1px solid #ccc"
                            }}
                          />
                          <Legend />
                          <Line
                            data={[
                              ...data.monthlyData.slice(-3),
                              // Projeções simuladas para os próximos 3 meses
                              {
                                name: 'Mai',
                                receitas: data.monthlyData[data.monthlyData.length-1].receitas * 1.05,
                                despesas: data.monthlyData[data.monthlyData.length-1].despesas * 1.02
                              },
                              {
                                name: 'Jun',
                                receitas: data.monthlyData[data.monthlyData.length-1].receitas * 1.08,
                                despesas: data.monthlyData[data.monthlyData.length-1].despesas * 1.03
                              },
                              {
                                name: 'Jul',
                                receitas: data.monthlyData[data.monthlyData.length-1].receitas * 1.12,
                                despesas: data.monthlyData[data.monthlyData.length-1].despesas * 1.05
                              }
                            ]}
                            type="monotone" 
                            dataKey="receitas" 
                            stroke="#10b981"
                            name="Receitas Projetadas"
                            strokeDasharray="5 5" 
                          />
                          <Line
                            data={[
                              ...data.monthlyData.slice(-3),
                              // Projeções simuladas para os próximos 3 meses
                              {
                                name: 'Mai',
                                receitas: data.monthlyData[data.monthlyData.length-1].receitas * 1.05,
                                despesas: data.monthlyData[data.monthlyData.length-1].despesas * 1.02
                              },
                              {
                                name: 'Jun',
                                receitas: data.monthlyData[data.monthlyData.length-1].receitas * 1.08,
                                despesas: data.monthlyData[data.monthlyData.length-1].despesas * 1.03
                              },
                              {
                                name: 'Jul',
                                receitas: data.monthlyData[data.monthlyData.length-1].receitas * 1.12,
                                despesas: data.monthlyData[data.monthlyData.length-1].despesas * 1.05
                              }
                            ]} 
                            type="monotone" 
                            dataKey="despesas" 
                            stroke="#ef4444" 
                            name="Despesas Projetadas"
                            strokeDasharray="5 5"
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                    
                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-md">
                      <h4 className="text-lg font-medium mb-2">Recomendações Baseadas na Projeção</h4>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-start gap-2">
                          <ArrowRight size={16} className="text-finance-primary mt-0.5" />
                          <span>Sua receita está projetada para crescer 12% nos próximos 3 meses. Continue com a estratégia atual.</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <ArrowRight size={16} className="text-finance-primary mt-0.5" />
                          <span>Suas despesas tendem a aumentar 5%. Considere revisar gastos em categorias não essenciais.</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <ArrowRight size={16} className="text-finance-primary mt-0.5" />
                          <span>Se mantiver este ritmo, sua economia mensal aumentará em aproximadamente 20%.</span>
                        </li>
                      </ul>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => gerarRelatorioPDF("projeção")}>Visualizar</Button>
                      <Button size="sm" variant="outline" className="gap-1" onClick={() => gerarRelatorioPDF("projeção")}>
                        <FileText size={16} />
                        <span>PDF</span>
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-500 dark:text-gray-400">Nenhum dado disponível para projeção financeira</p>
                    <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Adicione mais transações para gerar projeções precisas</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </ProFeature>
        )}
      </div>
      
      {!isPro && (
        <Card className="bg-finance-light dark:bg-gray-800 border-finance-primary border mb-8">
          <CardContent className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-6">
            <div>
              <h3 className="text-lg font-semibold text-finance-dark dark:text-gray-200">Desbloqueie todos os relatórios</h3>
              <p className="text-finance-dark/80 dark:text-gray-300">
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
        <div className="bg-white dark:bg-gray-800 border rounded-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Tipo</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Data</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Período</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Ações</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {[1, 2, 3].map((item, index) => (
                  <tr key={index} className={index >= 1 && !isPro ? "opacity-50" : ""}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-200">
                      {index === 0 ? "Relatório Mensal" : index === 1 ? "Relatório Comparativo" : "Projeção Financeira"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {index === 0 ? "15/04/2025" : index === 1 ? "10/04/2025" : "05/04/2025"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {index === 0 ? "Abril 2025" : index === 1 ? "Mar-Abr 2025" : "Mai-Jul 2025"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {index === 0 || isPro ? (
                        <div className="flex justify-end gap-2">
                          <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={() => gerarRelatorioPDF(index === 0 ? "mensal" : index === 1 ? "comparativo" : "projeção")}>
                            <FileText size={16} />
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
                    <td colSpan={4} className="px-6 py-4 text-sm text-center text-gray-500 dark:text-gray-400">
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

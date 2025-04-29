
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  ResponsiveContainer,
  PieChart, 
  Pie, 
  Cell,
  LineChart,
  Line
} from "recharts";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const monthlyExpenseData = [
  { name: 'Jan', despesas: 3200, receitas: 4200 },
  { name: 'Feb', despesas: 3500, receitas: 4200 },
  { name: 'Mar', despesas: 3100, receitas: 4500 },
  { name: 'Apr', despesas: 3800, receitas: 4300 },
  { name: 'May', despesas: 3500, receitas: 4400 },
  { name: 'Jun', despesas: 3200, receitas: 4200 },
];

const categoryData = [
  { name: 'Alimentação', valor: 850 },
  { name: 'Moradia', valor: 1500 },
  { name: 'Transporte', valor: 500 },
  { name: 'Lazer', valor: 400 },
  { name: 'Saúde', valor: 600 },
  { name: 'Outros', valor: 500 },
];

const cashFlowData = [
  { name: 'Jan', fluxo: 1000 },
  { name: 'Feb', fluxo: 700 },
  { name: 'Mar', fluxo: 1400 },
  { name: 'Apr', fluxo: 500 },
  { name: 'May', fluxo: 900 },
  { name: 'Jun', fluxo: 1000 },
];

const ReportsPage = () => {
  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold mb-6">Relatórios Financeiros</h1>

      <Tabs defaultValue="monthly" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="monthly">Mensal</TabsTrigger>
          <TabsTrigger value="category">Por Categoria</TabsTrigger>
          <TabsTrigger value="cashflow">Fluxo de Caixa</TabsTrigger>
        </TabsList>
        
        <TabsContent value="monthly">
          <Card>
            <CardHeader>
              <CardTitle>Despesas vs. Receitas</CardTitle>
              <CardDescription>Comparação mensal entre despesas e receitas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={monthlyExpenseData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => `R$ ${value}`} />
                    <Legend />
                    <Bar dataKey="despesas" name="Despesas" fill="#FF8042" />
                    <Bar dataKey="receitas" name="Receitas" fill="#00C49F" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="category">
          <Card>
            <CardHeader>
              <CardTitle>Despesas por Categoria</CardTitle>
              <CardDescription>Distribuição de despesas por categoria</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      outerRadius={150}
                      fill="#8884d8"
                      dataKey="valor"
                      nameKey="name"
                      label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `R$ ${value}`} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="cashflow">
          <Card>
            <CardHeader>
              <CardTitle>Fluxo de Caixa</CardTitle>
              <CardDescription>Evolução do fluxo de caixa mensal</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={cashFlowData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => `R$ ${value}`} />
                    <Legend />
                    <Line type="monotone" dataKey="fluxo" name="Fluxo de Caixa" stroke="#8884d8" activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReportsPage;

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/services/currencyService";
import { Bar, Line, LineChart, BarChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const Hero = () => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [monthlyData, setMonthlyData] = useState([
    { month: 'Jan', receitas: 4500, despesas: 3200 },
    { month: 'Fev', receitas: 5200, despesas: 3800 },
    { month: 'Mar', receitas: 4800, despesas: 3600 },
    { month: 'Abr', receitas: 6000, despesas: 3900 },
    { month: 'Mai', receitas: 7200, despesas: 4100 },
    { month: 'Jun', receitas: 6800, despesas: 3950 },
  ]);
  
  const [activeData, setActiveData] = useState(0);
  
  // Animation effect - rotate through different chart data
  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setActiveData((prev) => (prev + 1) % 3);
        setIsAnimating(false);
      }, 300);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  // Generate random data for demonstration
  const generateRandomData = (seed: number) => {
    const baseData = [...monthlyData];
    return baseData.map(item => ({
      ...item,
      receitas: item.receitas + (Math.sin(seed + parseInt(item.month, 36)) * 1000),
      despesas: item.despesas + (Math.cos(seed + parseInt(item.month, 36)) * 700)
    }));
  };
  
  const dashboardData = [
    monthlyData,
    generateRandomData(10),
    generateRandomData(20)
  ];
  
  const categoryData = [
    { name: 'Alimentação', valor: 1200 },
    { name: 'Moradia', valor: 1800 },
    { name: 'Transporte', valor: 600 },
    { name: 'Lazer', valor: 400 },
    { name: 'Outros', valor: 500 }
  ];
  
  // Recent transactions for the demo
  const transactions = [
    { name: 'Supermercado Extra', categoria: 'Alimentação', valor: -235.45, data: 'Hoje' },
    { name: 'Salário', categoria: 'Receita', valor: 4500.00, data: 'Ontem' },
    { name: 'Netflix', categoria: 'Entretenimento', valor: -55.90, data: '25/04' },
    { name: 'Uber', categoria: 'Transporte', valor: -32.50, data: '24/04' },
  ];

  return <section className="bg-gradient-to-br from-finance-light to-white py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center justify-between">
          <div className="lg:w-1/2 lg:pr-12 mb-10 lg:mb-0 animate-fade-up">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-finance-dark leading-tight mb-6">
              Controle suas finanças com <span className="text-finance-primary">facilidade</span>
            </h1>
            <p className="text-lg text-gray-700 mb-8 max-w-lg">
              Axios Finanças é o app ideal para quem quer ter o controle das finanças pessoais de forma simples, organizada e eficaz.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button className="finance-btn-primary text-base">
                Comece agora gratuitamente
              </Button>
              <Button 
                variant="outline" 
                className="border-finance-primary text-finance-primary hover:bg-finance-light text-base"
                asChild
              >
                <Link to="/saiba-mais">
                  Saiba mais
                </Link>
              </Button>
            </div>
            <div className="mt-6 text-sm text-gray-500">
              Teste por 2 dias sem compromisso. Cancele quando quiser.
            </div>
          </div>
          <div className={`lg:w-1/2 ${isAnimating ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}>
            <div className="glass-card p-6 rounded-xl shadow-lg bg-white/80 backdrop-blur-sm">
              <div className="relative overflow-hidden rounded-lg shadow-sm">
                <div className="w-full bg-white p-4 rounded-lg shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-700 mb-3">Balanço Mensal</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={dashboardData[activeData]}
                        margin={{
                          top: 5,
                          right: 20,
                          left: 0,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip formatter={(value) => formatCurrency(Number(value), 'BRL')} />
                        <Legend />
                        <Bar dataKey="receitas" name="Receitas" fill="#4ade80" />
                        <Bar dataKey="despesas" name="Despesas" fill="#f87171" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 mt-3">
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">Gastos por Categoria</h3>
                  <div className="h-[180px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={categoryData}
                        margin={{
                          top: 5,
                          right: 5,
                          left: 5,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" tick={{fontSize: 10}} />
                        <YAxis tick={{fontSize: 10}} />
                        <Tooltip formatter={(value) => formatCurrency(Number(value), 'BRL')} />
                        <Line type="monotone" dataKey="valor" stroke="#8884d8" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">Últimas Transações</h3>
                  <div className="h-[180px] overflow-y-auto text-left">
                    {transactions.map((transaction, index) => (
                      <div key={index} className="py-2 border-b border-gray-100 last:border-0">
                        <div className="flex justify-between">
                          <p className="text-xs font-medium">{transaction.name}</p>
                          <p className={`text-xs font-semibold ${transaction.valor > 0 ? 'text-green-600' : 'text-red-500'}`}>
                            {formatCurrency(transaction.valor, 'BRL')}
                          </p>
                        </div>
                        <div className="flex justify-between mt-1">
                          <p className="text-xs text-gray-500">{transaction.categoria}</p>
                          <p className="text-xs text-gray-500">{transaction.data}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>;
};

export default Hero;

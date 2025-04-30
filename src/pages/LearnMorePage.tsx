
import React from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { FileText, BookOpen, ChevronRight } from "lucide-react";

const LearnMorePage = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-finance-light to-white py-16 lg:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl sm:text-5xl font-bold text-finance-dark mb-6">
              Conheça o <span className="text-finance-primary">Axios Finanças</span>
            </h1>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              Desenvolvido para transformar sua relação com o dinheiro e ajudar você a conquistar seus objetivos financeiros.
            </p>
          </div>
        </section>

        {/* Overview Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto mb-16 text-center">
              <h2 className="text-3xl font-bold text-finance-dark mb-6">Por que escolher o Axios Finanças?</h2>
              <p className="text-lg text-gray-700">
                O Axios Finanças é uma plataforma completa para gerenciamento financeiro pessoal que combina facilidade de uso com recursos poderosos.
                Nossa missão é simplificar o controle financeiro e ajudar você a tomar decisões mais inteligentes sobre seu dinheiro.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                <div className="h-12 w-12 flex items-center justify-center bg-finance-light rounded-full mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-finance-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-finance-dark mb-2">Visão Financeira Completa</h3>
                <p className="text-gray-700">
                  Tenha uma visão geral do seu dinheiro em um único lugar. Acompanhe receitas, despesas e investimentos com gráficos intuitivos e relatórios personalizados.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                <div className="h-12 w-12 flex items-center justify-center bg-finance-light rounded-full mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-finance-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-finance-dark mb-2">Orçamentos Inteligentes</h3>
                <p className="text-gray-700">
                  Crie orçamentos personalizados para diferentes categorias e receba alertas quando estiver próximo de atingir seus limites de gastos.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                <div className="h-12 w-12 flex items-center justify-center bg-finance-light rounded-full mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-finance-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-finance-dark mb-2">Metas Financeiras</h3>
                <p className="text-gray-700">
                  Estabeleça metas financeiras claras e acompanhe seu progresso. Seja para comprar uma casa, viajar ou criar uma reserva de emergência.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-finance-gray">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-finance-dark mb-12 text-center">Recursos Exclusivos</h2>
            
            <div className="space-y-20">
              <div className="flex flex-col lg:flex-row items-center gap-8">
                <div className="lg:w-1/2">
                  <div className="bg-white p-6 rounded-lg shadow-lg">
                    <img 
                      src="/placeholder.svg" 
                      alt="Dashboard Intuitivo" 
                      className="w-full h-auto rounded" 
                    />
                  </div>
                </div>
                <div className="lg:w-1/2">
                  <h3 className="text-2xl font-bold text-finance-dark mb-4">Dashboard Intuitivo</h3>
                  <p className="text-gray-700 mb-6">
                    Nosso dashboard foi projetado para fornecer informações claras e acionáveis sobre suas finanças. 
                    Visualize sua situação financeira atual, tendências de gastos e oportunidades de economia com apenas alguns cliques.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <ChevronRight className="h-5 w-5 text-finance-primary mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">Visão geral personalizada das suas finanças</span>
                    </li>
                    <li className="flex items-start">
                      <ChevronRight className="h-5 w-5 text-finance-primary mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">Gráficos e indicadores financeiros em tempo real</span>
                    </li>
                    <li className="flex items-start">
                      <ChevronRight className="h-5 w-5 text-finance-primary mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">Alertas personalizados sobre gastos e receitas</span>
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="flex flex-col lg:flex-row-reverse items-center gap-8">
                <div className="lg:w-1/2">
                  <div className="bg-white p-6 rounded-lg shadow-lg">
                    <img 
                      src="/placeholder.svg" 
                      alt="Categorização Automática" 
                      className="w-full h-auto rounded" 
                    />
                  </div>
                </div>
                <div className="lg:w-1/2">
                  <h3 className="text-2xl font-bold text-finance-dark mb-4">Categorização Automática</h3>
                  <p className="text-gray-700 mb-6">
                    Economize tempo com nossa categorização automática de transações. 
                    Nosso sistema inteligente aprende com seus hábitos e categoriza automaticamente suas receitas e despesas.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <ChevronRight className="h-5 w-5 text-finance-primary mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">Categorizador inteligente baseado em IA</span>
                    </li>
                    <li className="flex items-start">
                      <ChevronRight className="h-5 w-5 text-finance-primary mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">Possibilidade de criar categorias personalizadas</span>
                    </li>
                    <li className="flex items-start">
                      <ChevronRight className="h-5 w-5 text-finance-primary mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">Regras de categorização automática definidas por você</span>
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="flex flex-col lg:flex-row items-center gap-8">
                <div className="lg:w-1/2">
                  <div className="bg-white p-6 rounded-lg shadow-lg">
                    <img 
                      src="/placeholder.svg" 
                      alt="Relatórios Detalhados" 
                      className="w-full h-auto rounded" 
                    />
                  </div>
                </div>
                <div className="lg:w-1/2">
                  <h3 className="text-2xl font-bold text-finance-dark mb-4">Relatórios Detalhados</h3>
                  <p className="text-gray-700 mb-6">
                    Gere relatórios detalhados para análise profunda das suas finanças. 
                    Identifique tendências, compare períodos e exporte seus dados em formatos variados.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <ChevronRight className="h-5 w-5 text-finance-primary mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">Relatórios mensais, trimestrais e anuais</span>
                    </li>
                    <li className="flex items-start">
                      <ChevronRight className="h-5 w-5 text-finance-primary mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">Comparativo entre períodos diferentes</span>
                    </li>
                    <li className="flex items-start">
                      <ChevronRight className="h-5 w-5 text-finance-primary mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">Exportação para PDF, CSV e Excel</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Plans Comparison */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-finance-dark mb-12 text-center">Compare os Planos</h2>
            
            <div className="max-w-5xl mx-auto">
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                  <thead>
                    <tr>
                      <th className="py-4 px-6 bg-gray-50 text-left text-sm font-medium text-gray-500 uppercase tracking-wider border-b">
                        Recurso
                      </th>
                      <th className="py-4 px-6 bg-gray-50 text-center text-sm font-medium text-gray-500 uppercase tracking-wider border-b">
                        Plano Gratuito
                      </th>
                      <th className="py-4 px-6 bg-finance-light text-center text-sm font-medium text-finance-primary uppercase tracking-wider border-b">
                        Plano Pro
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr>
                      <td className="py-4 px-6 text-sm font-medium text-gray-900">
                        Registro de transações
                      </td>
                      <td className="py-4 px-6 text-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mx-auto text-green-500" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </td>
                      <td className="py-4 px-6 text-center bg-finance-light/20">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mx-auto text-green-500" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-4 px-6 text-sm font-medium text-gray-900">
                        Dashboard básico
                      </td>
                      <td className="py-4 px-6 text-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mx-auto text-green-500" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </td>
                      <td className="py-4 px-6 text-center bg-finance-light/20">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mx-auto text-green-500" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-4 px-6 text-sm font-medium text-gray-900">
                        Transações ilimitadas
                      </td>
                      <td className="py-4 px-6 text-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mx-auto text-red-500" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </td>
                      <td className="py-4 px-6 text-center bg-finance-light/20">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mx-auto text-green-500" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-4 px-6 text-sm font-medium text-gray-900">
                        Dashboard personalizado
                      </td>
                      <td className="py-4 px-6 text-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mx-auto text-red-500" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </td>
                      <td className="py-4 px-6 text-center bg-finance-light/20">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mx-auto text-green-500" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-4 px-6 text-sm font-medium text-gray-900">
                        Categorização automática
                      </td>
                      <td className="py-4 px-6 text-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mx-auto text-red-500" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </td>
                      <td className="py-4 px-6 text-center bg-finance-light/20">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mx-auto text-green-500" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-4 px-6 text-sm font-medium text-gray-900">
                        Exportação para PDF e CSV
                      </td>
                      <td className="py-4 px-6 text-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mx-auto text-red-500" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </td>
                      <td className="py-4 px-6 text-center bg-finance-light/20">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mx-auto text-green-500" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-4 px-6 text-sm font-medium text-gray-900">
                        Dicas financeiras personalizadas
                      </td>
                      <td className="py-4 px-6 text-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mx-auto text-red-500" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </td>
                      <td className="py-4 px-6 text-center bg-finance-light/20">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mx-auto text-green-500" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-4 px-6 text-sm font-medium text-gray-900">
                        Suporte prioritário
                      </td>
                      <td className="py-4 px-6 text-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mx-auto text-red-500" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </td>
                      <td className="py-4 px-6 text-center bg-finance-light/20">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mx-auto text-green-500" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </td>
                    </tr>
                  </tbody>
                  <tfoot>
                    <tr>
                      <td className="py-4 px-6"></td>
                      <td className="py-4 px-6 text-center">
                        <Link to="/auth">
                          <Button variant="outline" className="border-finance-primary text-finance-primary">
                            Começar grátis
                          </Button>
                        </Link>
                      </td>
                      <td className="py-4 px-6 text-center bg-finance-light/20">
                        <Link to="/precos">
                          <Button className="bg-finance-primary hover:bg-finance-primary/90 text-white">
                            Ver planos
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>
        </section>
        
        {/* Resources Section */}
        <section className="py-16 bg-finance-gray">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-finance-dark mb-12 text-center">Recursos e Materiais</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex gap-4 bg-white p-6 rounded-lg shadow-md">
                <div className="flex-shrink-0">
                  <FileText className="h-12 w-12 text-finance-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-finance-dark mb-2">Guias Financeiros</h3>
                  <p className="text-gray-700 mb-4">
                    Acesse nossa biblioteca de guias financeiros com dicas práticas para melhorar sua relação com o dinheiro.
                  </p>
                  <Link to="/recursos" className="text-finance-primary hover:text-finance-primary/90 font-medium">
                    Ver guias financeiros
                  </Link>
                </div>
              </div>
              
              <div className="flex gap-4 bg-white p-6 rounded-lg shadow-md">
                <div className="flex-shrink-0">
                  <BookOpen className="h-12 w-12 text-finance-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-finance-dark mb-2">Planilhas e Modelos</h3>
                  <p className="text-gray-700 mb-4">
                    Baixe planilhas e modelos prontos para complementar sua experiência no Axios Finanças.
                  </p>
                  <Link to="/recursos" className="text-finance-primary hover:text-finance-primary/90 font-medium">
                    Acessar planilhas
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* FAQ Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-finance-dark mb-12 text-center">Perguntas Frequentes</h2>
            
            <div className="max-w-3xl mx-auto divide-y divide-gray-200">
              <div className="py-6">
                <h3 className="text-lg font-medium text-finance-dark">Como posso começar a usar o Axios Finanças?</h3>
                <p className="mt-2 text-gray-700">
                  Para começar, basta criar uma conta gratuita no nosso site. Após o cadastro, você terá acesso imediato ao dashboard e poderá começar a registrar suas transações financeiras.
                </p>
              </div>
              <div className="py-6">
                <h3 className="text-lg font-medium text-finance-dark">Posso conectar minha conta bancária ao Axios Finanças?</h3>
                <p className="mt-2 text-gray-700">
                  No momento, o Axios Finanças não oferece integração direta com bancos, priorizando sua segurança e privacidade. Todas as transações são registradas manualmente ou por importação de arquivos CSV.
                </p>
              </div>
              <div className="py-6">
                <h3 className="text-lg font-medium text-finance-dark">É seguro inserir meus dados financeiros no sistema?</h3>
                <p className="mt-2 text-gray-700">
                  Absolutamente. Utilizamos criptografia de ponta a ponta e não armazenamos informações sensíveis como senhas bancárias ou números de cartão de crédito completos. Sua privacidade e segurança são nossas prioridades.
                </p>
              </div>
              <div className="py-6">
                <h3 className="text-lg font-medium text-finance-dark">Posso cancelar minha assinatura a qualquer momento?</h3>
                <p className="mt-2 text-gray-700">
                  Sim, você pode cancelar sua assinatura do plano Pro a qualquer momento. O cancelamento será efetivado ao final do período faturado atual, e você não será cobrado novamente.
                </p>
              </div>
              <div className="py-6">
                <h3 className="text-lg font-medium text-finance-dark">O que acontece com meus dados se eu cancelar minha assinatura?</h3>
                <p className="mt-2 text-gray-700">
                  Seus dados financeiros permanecerão em nosso sistema por 30 dias após o cancelamento. Durante esse período, você pode optar por reativar sua conta ou solicitar a exclusão completa dos seus dados.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-16 bg-finance-primary">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-6">Comece a transformar suas finanças hoje</h2>
            <p className="text-xl text-white/90 max-w-2xl mx-auto mb-8">
              Junte-se a milhares de pessoas que já estão no controle de suas finanças com o Axios Finanças.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-white text-finance-primary hover:bg-gray-100" size="lg" asChild>
                <Link to="/auth">
                  Criar conta gratuita
                </Link>
              </Button>
              <Button variant="outline" className="border-white text-white hover:bg-white/10" size="lg" asChild>
                <Link to="/precos">
                  Ver planos e preços
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default LearnMorePage;

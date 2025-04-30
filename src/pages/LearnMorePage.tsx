import React from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { FileText, BookOpen, ChevronRight } from "lucide-react";
import DashboardDemo from "@/components/DashboardDemo";
import FinancialSummary from "@/components/dashboard/FinancialSummary";
import RecentTransactions from "@/components/dashboard/RecentTransactions";
import ExpenseDistribution from "@/components/dashboard/ExpenseDistribution";

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
              Uma plataforma completa para controlar suas finanças pessoais e alcançar seus objetivos financeiros.
            </p>
          </div>
        </section>

        {/* Overview Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto mb-16 text-center">
              <h2 className="text-3xl font-bold text-finance-dark mb-6">Por que escolher o Axios Finanças?</h2>
              <p className="text-lg text-gray-700">
                O Axios Finanças oferece tudo que você precisa para organizar sua vida financeira 
                em um só lugar. Com uma interface intuitiva, você consegue visualizar e gerenciar 
                receitas e despesas de forma simples.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                <div className="h-12 w-12 flex items-center justify-center bg-finance-light rounded-full mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-finance-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-finance-dark mb-2">Controle Completo</h3>
                <p className="text-gray-700">
                  Gerencie todas as suas transações em um único lugar. Veja seu balanço mensal, 
                  acompanhe receitas e despesas com gráficos claros.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                <div className="h-12 w-12 flex items-center justify-center bg-finance-light rounded-full mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-finance-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-finance-dark mb-2">Orçamentos</h3>
                <p className="text-gray-700">
                  Crie orçamentos para diferentes categorias e acompanhe seus gastos para manter suas finanças sob controle.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                <div className="h-12 w-12 flex items-center justify-center bg-finance-light rounded-full mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-finance-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-finance-dark mb-2">Planejamento Financeiro</h3>
                <p className="text-gray-700">
                  Defina metas financeiras claras e acompanhe seu progresso ao longo do tempo para alcançar seus objetivos.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section with Dynamic Components */}
        <section className="py-16 bg-finance-gray">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-finance-dark mb-12 text-center">Recursos Disponíveis</h2>
            
            <div className="space-y-20">
              {/* Dashboard Overview - Using real component */}
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h3 className="text-2xl font-bold text-finance-dark mb-6 text-center">Dashboard Completo</h3>
                <div className="max-w-5xl mx-auto">
                  <FinancialSummary />
                </div>
                <div className="mt-6">
                  <ul className="space-y-2 max-w-2xl mx-auto">
                    <li className="flex items-start">
                      <ChevronRight className="h-5 w-5 text-finance-primary mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">Resumo das suas finanças em um único lugar</span>
                    </li>
                    <li className="flex items-start">
                      <ChevronRight className="h-5 w-5 text-finance-primary mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">Gráficos de receitas e despesas</span>
                    </li>
                    <li className="flex items-start">
                      <ChevronRight className="h-5 w-5 text-finance-primary mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">Lista de transações recentes</span>
                    </li>
                  </ul>
                </div>
              </div>
              
              {/* Transactions - Using real component */}
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h3 className="text-2xl font-bold text-finance-dark mb-6 text-center">Gestão de Transações</h3>
                <div className="max-w-5xl mx-auto">
                  <RecentTransactions />
                </div>
                <div className="mt-6">
                  <ul className="space-y-2 max-w-2xl mx-auto">
                    <li className="flex items-start">
                      <ChevronRight className="h-5 w-5 text-finance-primary mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">Registro de receitas e despesas</span>
                    </li>
                    <li className="flex items-start">
                      <ChevronRight className="h-5 w-5 text-finance-primary mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">Categorização de transações</span>
                    </li>
                    <li className="flex items-start">
                      <ChevronRight className="h-5 w-5 text-finance-primary mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">Filtros e pesquisas avançadas</span>
                    </li>
                  </ul>
                </div>
              </div>
              
              {/* Planning and Expense Distribution - Using real component */}
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h3 className="text-2xl font-bold text-finance-dark mb-6 text-center">Metas e Planejamento</h3>
                <div className="max-w-5xl mx-auto">
                  <ExpenseDistribution />
                </div>
                <div className="mt-6">
                  <ul className="space-y-2 max-w-2xl mx-auto">
                    <li className="flex items-start">
                      <ChevronRight className="h-5 w-5 text-finance-primary mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">Definição de metas financeiras</span>
                    </li>
                    <li className="flex items-start">
                      <ChevronRight className="h-5 w-5 text-finance-primary mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">Acompanhamento de poupança</span>
                    </li>
                    <li className="flex items-start">
                      <ChevronRight className="h-5 w-5 text-finance-primary mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">Planejamento de investimentos</span>
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
                        Metas financeiras
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
                        Planejamento de orçamentos
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
                        Relatórios detalhados
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
                        Dicas financeiras
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
        
        {/* FAQ Section */}
        <section className="py-16 bg-finance-gray">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-finance-dark mb-12 text-center">Perguntas Frequentes</h2>
            
            <div className="max-w-3xl mx-auto divide-y divide-gray-200">
              <div className="py-6">
                <h3 className="text-lg font-medium text-finance-dark">Como começar a usar o Axios Finanças?</h3>
                <p className="mt-2 text-gray-700">
                  Para começar, basta criar uma conta gratuita em nosso site. Após o cadastro, você terá acesso imediato ao dashboard e poderá começar a registrar suas transações.
                </p>
              </div>
              <div className="py-6">
                <h3 className="text-lg font-medium text-finance-dark">Como registrar minhas receitas e despesas?</h3>
                <p className="mt-2 text-gray-700">
                  No dashboard, você encontra botões para adicionar novas receitas e despesas. Basta preencher os campos necessários como valor, data e categoria.
                </p>
              </div>
              <div className="py-6">
                <h3 className="text-lg font-medium text-finance-dark">Posso criar orçamentos para categorias específicas?</h3>
                <p className="mt-2 text-gray-700">
                  Sim, na seção de orçamentos você pode criar limites de gastos para diferentes categorias e acompanhar quanto já foi utilizado do valor planejado.
                </p>
              </div>
              <div className="py-6">
                <h3 className="text-lg font-medium text-finance-dark">Como criar uma meta financeira?</h3>
                <p className="mt-2 text-gray-700">
                  Na seção de planejamento, você encontra a opção para criar metas financeiras. Defina o valor desejado, prazo e acompanhe seu progresso ao longo do tempo.
                </p>
              </div>
              <div className="py-6">
                <h3 className="text-lg font-medium text-finance-dark">Posso cancelar minha assinatura a qualquer momento?</h3>
                <p className="mt-2 text-gray-700">
                  Sim, você pode cancelar sua assinatura do plano Pro a qualquer momento na seção de configurações. O cancelamento será efetivado ao final do período faturado.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-16 bg-finance-primary">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-6">Comece a controlar suas finanças hoje</h2>
            <p className="text-xl text-white/90 max-w-2xl mx-auto mb-8">
              Organize sua vida financeira de forma simples e eficiente com o Axios Finanças.
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

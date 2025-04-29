
import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CallToAction from "@/components/CallToAction";
import { 
  BarChart2, 
  FileText, 
  Settings, 
  Link, 
  Upload, 
  Download, 
  HelpCircle, 
  BookOpen 
} from "lucide-react";

const Resources = () => {
  const resources = [
    {
      title: "Planilhas e Modelos",
      description: "Baixe planilhas prontas para gerenciar seus investimentos, orçamentos mensais e planejar metas financeiras.",
      icon: <FileText className="h-12 w-12 text-finance-primary" />,
      linkText: "Baixar modelos",
      linkTo: "#modelos"
    },
    {
      title: "Guias Financeiros",
      description: "Aprenda conceitos financeiros essenciais para melhorar sua relação com o dinheiro e aumentar seu patrimônio.",
      icon: <BookOpen className="h-12 w-12 text-finance-primary" />,
      linkText: "Acessar biblioteca",
      linkTo: "#guias"
    },
    {
      title: "API para Desenvolvedores",
      description: "Integre os dados financeiros do Axios Finanças em seus próprios aplicativos e ferramentas.",
      icon: <Link className="h-12 w-12 text-finance-primary" />,
      linkText: "Documentação da API",
      linkTo: "#api"
    },
    {
      title: "Suporte Técnico",
      description: "Encontre respostas para suas dúvidas e aprenda a utilizar todos os recursos do Axios Finanças.",
      icon: <HelpCircle className="h-12 w-12 text-finance-primary" />,
      linkText: "Central de ajuda",
      linkTo: "#suporte"
    },
    {
      title: "Importação de Dados",
      description: "Importe dados de outros aplicativos financeiros ou do seu banco para centralizar suas informações.",
      icon: <Upload className="h-12 w-12 text-finance-primary" />,
      linkText: "Como importar",
      linkTo: "#importar"
    },
    {
      title: "Exportação de Relatórios",
      description: "Exporte seus dados e relatórios em diversos formatos para análise externa ou armazenamento.",
      icon: <Download className="h-12 w-12 text-finance-primary" />,
      linkText: "Opções de exportação",
      linkTo: "#exportar"
    }
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-finance-gray py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl font-bold text-finance-dark mb-6">Recursos do Axios Finanças</h1>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Descubra todas as ferramentas e recursos disponíveis para ajudar você a alcançar seus objetivos financeiros.
            </p>
          </div>
        </section>

        {/* Resources Grid */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {resources.map((resource, index) => (
                <div 
                  key={index}
                  className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-100"
                >
                  <div className="flex justify-center mb-4">
                    {resource.icon}
                  </div>
                  <h3 className="text-xl font-bold text-center text-finance-dark mb-4">{resource.title}</h3>
                  <p className="text-gray-600 text-center mb-6">{resource.description}</p>
                  <div className="flex justify-center">
                    <a 
                      href={resource.linkTo} 
                      className="text-finance-primary hover:text-finance-primary/90 font-medium flex items-center"
                    >
                      {resource.linkText}
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        className="h-4 w-4 ml-1" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <CallToAction />
      </main>
      <Footer />
    </div>
  );
};

export default Resources;

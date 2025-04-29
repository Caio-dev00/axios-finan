
import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CallToAction from "@/components/CallToAction";
import { CheckCircle } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { upgradeToProPlan } from "@/services/subscriptionService";
import { useToast } from "@/hooks/use-toast";

const PricingPage = () => {
  const { user } = useAuth();
  const { plan, refreshSubscription } = useSubscription();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const isAlreadyPro = user && plan === "pro";

  const handleProPlanUpgrade = async () => {
    if (!user) {
      navigate("/auth", { state: { returnTo: "/precos" } });
      return;
    }

    try {
      // Simular o processo de pagamento bem sucedido
      await upgradeToProPlan(user.id);
      await refreshSubscription();
      
      toast({
        title: "Assinatura Pro ativada!",
        description: "Aproveite todos os recursos premium disponíveis.",
      });
      
      navigate("/dashboard");
    } catch (error) {
      console.error("Erro ao realizar upgrade:", error);
      toast({
        title: "Erro ao processar assinatura",
        description: "Não foi possível ativar sua assinatura. Tente novamente mais tarde.",
        variant: "destructive",
      });
    }
  };
  
  const plans = [
    {
      name: "Plano Gratuito",
      price: "R$ 0",
      period: "Teste por 2 dias",
      description: "Perfeito para conhecer as funcionalidades básicas e experimentar nossa plataforma.",
      features: [
        "Registro de até 20 transações",
        "Dashboard básico",
        "Categorização manual",
        "Sem exportação de relatórios",
        "Suporte por email",
      ],
      cta: user ? "Acessar Dashboard" : "Começar teste grátis",
      action: () => navigate(user ? "/dashboard" : "/auth"),
      highlight: false
    },
    {
      name: "Plano Pro",
      price: "R$ 29,90",
      period: "por mês",
      description: "Nosso plano completo com todas as ferramentas para gerenciar suas finanças.",
      features: [
        "Registro ilimitado de transações",
        "Dashboard personalizado",
        "Categorização automática",
        "Gráficos e relatórios detalhados",
        "Exportação de relatórios em PDF",
        "Dicas personalizadas de economia",
        "Suporte prioritário"
      ],
      cta: isAlreadyPro ? "Plano Ativo" : "Assinar plano Pro",
      action: handleProPlanUpgrade,
      highlight: true,
      disabled: isAlreadyPro
    }
  ];

  const faqs = [
    {
      question: "Posso cancelar minha assinatura a qualquer momento?",
      answer: "Sim, você pode cancelar sua assinatura quando quiser, sem multas ou taxas adicionais. O acesso permanece ativo até o fim do período já pago."
    },
    {
      question: "Como funciona o teste gratuito?",
      answer: "Nosso teste gratuito dá acesso a todas as funcionalidades do Plano Pro por 2 dias. Após esse período, você pode optar por assinar o plano Pro ou continuar com a versão gratuita limitada."
    },
    {
      question: "Quais formas de pagamento são aceitas?",
      answer: "Aceitamos cartões de crédito das principais bandeiras (Visa, Mastercard, American Express), boleto bancário e PIX."
    },
    {
      question: "Meus dados financeiros estão seguros?",
      answer: "Absolutamente. Utilizamos criptografia de nível bancário para proteger seus dados, e jamais compartilhamos suas informações com terceiros sem sua autorização explícita."
    }
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-finance-gray py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl font-bold text-finance-dark mb-6">Planos e Preços</h1>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Escolha o plano ideal para suas necessidades financeiras.
              Cancele a qualquer momento, sem compromisso de permanência.
            </p>
          </div>
        </section>

        {/* Pricing Plans */}
        <section className="py-16" id="planos">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {plans.map((plan, index) => (
                <Card 
                  key={index}
                  className={`${
                    plan.highlight 
                      ? "border-2 border-finance-primary shadow-lg" 
                      : "border border-gray-200"
                  } relative h-full flex flex-col`}
                >
                  {plan.highlight && (
                    <div className="absolute top-0 right-0 bg-finance-primary text-white px-4 py-1 text-sm font-medium rounded-bl-lg">
                      Recomendado
                    </div>
                  )}
                  <CardHeader>
                    <h3 className="text-xl font-bold text-finance-dark">{plan.name}</h3>
                    <div className="mt-4">
                      <span className="text-4xl font-bold">{plan.price}</span>
                      {plan.period !== "Teste por 2 dias" && (
                        <span className="text-gray-500 ml-2">{plan.period}</span>
                      )}
                    </div>
                    <p className="text-gray-600 mt-2">{plan.description}</p>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <ul className="space-y-3">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-finance-primary mr-2 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      className={`w-full ${
                        plan.highlight 
                          ? "bg-finance-primary hover:bg-finance-primary/90 text-white" 
                          : "bg-white border border-finance-primary text-finance-primary hover:bg-finance-primary/10"
                      }`}
                      onClick={plan.action}
                      disabled={plan.disabled}
                    >
                      {plan.cta}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Compare Plans */}
        <section className="py-16 bg-finance-gray">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center text-finance-dark mb-12">Compare os planos</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white rounded-lg shadow">
                <thead>
                  <tr>
                    <th className="py-4 px-6 text-left text-gray-600 font-medium">Funcionalidades</th>
                    <th className="py-4 px-6 text-center text-gray-600 font-medium">Gratuito</th>
                    <th className="py-4 px-6 text-center text-finance-primary font-bold">Pro</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="py-3 px-6 text-gray-800">Registro de transações</td>
                    <td className="py-3 px-6 text-center">Até 20</td>
                    <td className="py-3 px-6 text-center font-medium text-finance-primary">Ilimitado</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-6 text-gray-800">Dashboard personalizado</td>
                    <td className="py-3 px-6 text-center">Básico</td>
                    <td className="py-3 px-6 text-center font-medium text-finance-primary">Completo</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-6 text-gray-800">Categorização</td>
                    <td className="py-3 px-6 text-center">Manual</td>
                    <td className="py-3 px-6 text-center font-medium text-finance-primary">Automática</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-6 text-gray-800">Relatórios</td>
                    <td className="py-3 px-6 text-center">Não</td>
                    <td className="py-3 px-6 text-center font-medium text-finance-primary">Sim</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-6 text-gray-800">Exportação de dados</td>
                    <td className="py-3 px-6 text-center">Não</td>
                    <td className="py-3 px-6 text-center font-medium text-finance-primary">PDF, CSV</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-6 text-gray-800">Dicas personalizadas</td>
                    <td className="py-3 px-6 text-center">Básicas</td>
                    <td className="py-3 px-6 text-center font-medium text-finance-primary">Avançadas</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-6 text-gray-800">Suporte</td>
                    <td className="py-3 px-6 text-center">Email</td>
                    <td className="py-3 px-6 text-center font-medium text-finance-primary">Prioritário</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center text-finance-dark mb-12">Perguntas Frequentes</h2>
            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <div key={index} className="bg-white shadow p-6 rounded-lg">
                  <h3 className="text-xl font-medium text-finance-dark mb-3">{faq.question}</h3>
                  <p className="text-gray-600">{faq.answer}</p>
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

export default PricingPage;

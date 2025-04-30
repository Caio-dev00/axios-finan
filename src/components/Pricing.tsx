
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Check } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { upgradeToProPlan } from "@/services/subscriptionService";
import { useToast } from "@/hooks/use-toast";

const Pricing = () => {
  const { user } = useAuth();
  const { plan, refreshSubscription } = useSubscription();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const features = [
    "Registro ilimitado de transações",
    "Dashboard personalizado",
    "Gráficos e relatórios detalhados",
    "Exportação de relatórios em PDF",
    "Categorização automática",
    "Dicas personalizadas de economia",
    "Suporte prioritário"
  ];

  const handleProPlanUpgrade = async () => {
    if (!user) {
      navigate("/auth", { state: { returnTo: "/precos" } });
      return;
    }

    // Redirecionamento para o link de pagamento externo
    window.location.href = "https://pay.cakto.com.br/3bnjhuj_366904";
  };

  const isAlreadyPro = user && plan === "pro";

  return (
    <section className="py-16 bg-finance-gray" id="planos">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold text-finance-dark mb-4">Planos acessíveis para todos</h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Comece gratuitamente e escolha o plano que melhor atende às suas necessidades financeiras.
          </p>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-8 justify-center">
          <Card className="bg-white border-2 border-gray-100 shadow-md w-full lg:w-80 relative">
            <div className="absolute top-0 right-0 bg-gray-200 text-gray-700 px-4 py-1 rounded-bl-lg text-sm font-medium">
              Free
            </div>
            <CardHeader>
              <h3 className="text-xl font-bold text-finance-dark">Plano Gratuito</h3>
              <p className="text-4xl font-bold mt-4">R$ 0</p>
              <p className="text-gray-500 text-sm mt-1">Trial por 2 dias</p>
            </CardHeader>
            <CardContent className="border-t border-gray-100 pt-6">
              <ul className="space-y-3">
                {features.slice(0, 3).map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <Check size={20} className="text-finance-primary mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
                {features.slice(3).map((feature, index) => (
                  <li key={index} className="flex items-start opacity-50">
                    <Check size={20} className="text-gray-400 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-500 line-through">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full border-finance-primary text-finance-primary" asChild>
                <Link to={user ? "/dashboard" : "/auth"}>
                  {user ? "Acessar Dashboard" : "Começar teste grátis"}
                </Link>
              </Button>
            </CardFooter>
          </Card>
          
          <Card className="bg-white border-2 border-finance-primary shadow-xl w-full lg:w-80 relative transform lg:scale-105">
            <div className="absolute top-0 right-0 bg-finance-primary text-white px-4 py-1 rounded-bl-lg text-sm font-medium">
              Recomendado
            </div>
            <CardHeader>
              <h3 className="text-xl font-bold text-finance-dark">Plano Pro</h3>
              <p className="text-4xl font-bold mt-4">R$ 24,90 <span className="text-base font-normal text-gray-600">/mês</span></p>
              <p className="text-gray-500 text-sm mt-1">Cancele quando quiser</p>
            </CardHeader>
            <CardContent className="border-t border-gray-100 pt-6">
              <ul className="space-y-3">
                {features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <Check size={20} className="text-finance-primary mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full bg-finance-primary hover:bg-finance-primary/90 text-white"
                onClick={handleProPlanUpgrade}
                disabled={isAlreadyPro}
              >
                {isAlreadyPro ? "Plano Ativo" : "Assinar plano Pro"}
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        <div className="mt-8 text-center">
          <Button variant="link" className="text-finance-primary" asChild>
            <Link to="/precos">Ver comparação detalhada dos planos</Link>
          </Button>
        </div>
        
        <div className="text-center mt-4 text-sm text-gray-500">
          Pagamento processado de forma segura.
        </div>
      </div>
    </section>
  );
};

export default Pricing;

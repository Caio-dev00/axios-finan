
import React, { useEffect, useState } from "react";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Crown, Calendar, AlertCircle, CheckCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { pt } from "date-fns/locale";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface SubscriptionDetails {
  id: string;
  plan_type: string;
  is_active: boolean;
  start_date: string;
  end_date: string | null;
  updated_at: string;
}

const SubscriptionDetailsPage = () => {
  const { plan, isLoading } = useSubscription();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [subscriptionDetails, setSubscriptionDetails] = useState<SubscriptionDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSubscriptionDetails = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('user_subscriptions')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();
        
        if (error) throw error;
        setSubscriptionDetails(data);
      } catch (err: any) {
        console.error('Erro ao buscar detalhes da assinatura:', err);
        setError('Não foi possível carregar os detalhes da sua assinatura.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchSubscriptionDetails();
  }, [user]);

  const handleUpgradePlan = () => {
    navigate("/precos");
  };

  if (isLoading || loading) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Detalhes da Assinatura</h1>
        <div className="animate-pulse space-y-4">
          <div className="h-48 bg-gray-200 rounded"></div>
          <div className="h-20 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  const isPro = plan === "pro";

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Detalhes da Assinatura</h1>
      
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erro</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <div className="grid md:grid-cols-2 gap-6">
        <Card className={`${isPro ? "border-finance-primary" : "border-gray-200"}`}>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Seu Plano Atual</CardTitle>
              {isPro ? (
                <Badge className="bg-finance-primary">
                  <Crown size={12} className="mr-1" /> Pro
                </Badge>
              ) : (
                <Badge variant="outline">Free</Badge>
              )}
            </div>
            <CardDescription>
              {isPro 
                ? "Você está utilizando todos os recursos premium do Axios Finanças." 
                : "Você está utilizando a versão gratuita do Axios Finanças."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Plano</h3>
              <p className="font-semibold text-lg">{isPro ? "Pro" : "Free"}</p>
            </div>
            
            {subscriptionDetails && (
              <>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Data de início</h3>
                  <p className="font-medium">
                    {new Date(subscriptionDetails.start_date).toLocaleDateString('pt-BR')}
                    <span className="text-sm text-gray-500 ml-2">
                      ({formatDistanceToNow(new Date(subscriptionDetails.start_date), { addSuffix: true, locale: pt })})
                    </span>
                  </p>
                </div>
                
                {isPro && subscriptionDetails.end_date && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Próxima renovação</h3>
                    <p className="font-medium">
                      {new Date(subscriptionDetails.end_date).toLocaleDateString('pt-BR')}
                      <span className="text-sm text-gray-500 ml-2">
                        ({formatDistanceToNow(new Date(subscriptionDetails.end_date), { addSuffix: true, locale: pt })})
                      </span>
                    </p>
                  </div>
                )}
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Status</h3>
                  <div className="flex items-center">
                    {subscriptionDetails.is_active ? (
                      <>
                        <CheckCircle size={16} className="text-green-500 mr-2" />
                        <span className="text-green-700 font-medium">Ativo</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle size={16} className="text-red-500 mr-2" />
                        <span className="text-red-700 font-medium">Inativo</span>
                      </>
                    )}
                  </div>
                </div>
              </>
            )}
            
            {isPro && (
              <div className="pt-4 border-t border-gray-100">
                <h3 className="text-sm font-medium mb-2">O que está incluído:</h3>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <CheckCircle size={16} className="text-green-500 mr-2 mt-0.5" />
                    <span>Transações ilimitadas</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle size={16} className="text-green-500 mr-2 mt-0.5" />
                    <span>Exportação de relatórios</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle size={16} className="text-green-500 mr-2 mt-0.5" />
                    <span>Categorização automática</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle size={16} className="text-green-500 mr-2 mt-0.5" />
                    <span>Suporte prioritário</span>
                  </li>
                </ul>
              </div>
            )}
          </CardContent>
          <CardFooter>
            {!isPro && (
              <Button 
                className="w-full bg-finance-primary hover:bg-finance-primary/90"
                onClick={handleUpgradePlan}
              >
                <CreditCard size={16} className="mr-2" /> Fazer Upgrade para Pro
              </Button>
            )}
            {isPro && (
              <div className="w-full text-center text-sm text-gray-500">
                Assinatura Pro ativa: R$ 24,90/mês
              </div>
            )}
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Benefícios do Plano Pro</CardTitle>
            <CardDescription>
              Desbloqueie todo o potencial do Axios Finanças com nosso plano premium
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-start">
                <div className="bg-finance-primary/10 p-2 rounded-full mr-3">
                  <CreditCard size={20} className="text-finance-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Transações Ilimitadas</h3>
                  <p className="text-sm text-gray-500">Registre todas as suas transações sem limites</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-finance-primary/10 p-2 rounded-full mr-3">
                  <Calendar size={20} className="text-finance-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Planejamento Financeiro Avançado</h3>
                  <p className="text-sm text-gray-500">Ferramentas completas para planejar seu futuro financeiro</p>
                </div>
              </div>
              
              <div className="pt-4 mt-4 border-t border-gray-100">
                <h3 className="font-medium mb-3">Compare os planos</h3>
                
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div className="font-medium">Recurso</div>
                  <div className="font-medium text-center">Free</div>
                  <div className="font-medium text-center">Pro</div>
                  
                  <div>Transações</div>
                  <div className="text-center">Limitadas</div>
                  <div className="text-center text-finance-primary font-medium">Ilimitadas</div>
                  
                  <div>Categorias</div>
                  <div className="text-center">Básicas</div>
                  <div className="text-center text-finance-primary font-medium">Personalizáveis</div>
                  
                  <div>Relatórios</div>
                  <div className="text-center">Básicos</div>
                  <div className="text-center text-finance-primary font-medium">Avançados</div>
                  
                  <div>Suporte</div>
                  <div className="text-center">Email</div>
                  <div className="text-center text-finance-primary font-medium">Prioritário</div>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            {!isPro && (
              <Button 
                className="w-full bg-finance-primary hover:bg-finance-primary/90"
                onClick={handleUpgradePlan}
              >
                Assinar plano Pro - R$ 24,90/mês
              </Button>
            )}
            {isPro && (
              <div className="w-full text-center text-green-600 font-medium">
                ✓ Você já tem acesso a todos esses benefícios
              </div>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default SubscriptionDetailsPage;


import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { checkSubscriptionStatus, upgradeToProPlan } from "@/services/subscriptionService";

type SubscriptionPlan = "free" | "pro";

type SubscriptionContextType = {
  plan: SubscriptionPlan;
  isLoading: boolean;
  isPro: boolean;
  refreshSubscription: () => Promise<void>;
  upgradeToPro: (userId: string) => Promise<void>;
};

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export const SubscriptionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [plan, setPlan] = useState<SubscriptionPlan>("free");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { toast } = useToast();
  
  const isPro = plan === "pro";

  const fetchSubscription = async () => {
    if (!user) {
      setPlan("free");
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const subscription = await checkSubscriptionStatus(user.id);
      
      if (subscription && subscription.is_active && subscription.plan_type === 'pro') {
        setPlan("pro");
      } else {
        setPlan("free");
      }
    } catch (error: any) {
      console.error("Error fetching subscription:", error.message);
      setPlan("free");
    } finally {
      setIsLoading(false);
    }
  };

  const refreshSubscription = async () => {
    await fetchSubscription();
  };

  // Função para atualizar o plano do usuário para Pro
  const upgradeToPro = async (userId: string) => {
    try {
      await upgradeToProPlan(userId);
      setPlan("pro");
      toast({
        title: "Plano atualizado",
        description: "Seu plano foi atualizado para Pro com sucesso!"
      });
      await refreshSubscription();
    } catch (error) {
      console.error("Erro ao atualizar para o plano Pro:", error);
      toast({
        title: "Erro ao atualizar",
        description: "Não foi possível atualizar seu plano. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  // Buscar a assinatura sempre que o usuário mudar
  useEffect(() => {
    fetchSubscription();
  }, [user]);

  return (
    <SubscriptionContext.Provider value={{ 
      plan, 
      isLoading, 
      isPro, 
      refreshSubscription,
      upgradeToPro 
    }}>
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error("useSubscription deve ser usado dentro de um SubscriptionProvider");
  }
  return context;
};

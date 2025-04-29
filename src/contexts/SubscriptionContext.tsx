
import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

type SubscriptionPlan = "free" | "pro";

type SubscriptionContextType = {
  plan: SubscriptionPlan;
  isLoading: boolean;
  isPro: boolean;
  refreshSubscription: () => Promise<void>;
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
      const { data, error } = await supabase
        .from("user_subscriptions")
        .select("plan_type, is_active")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) {
        throw error;
      }

      if (data && data.is_active) {
        setPlan(data.plan_type as SubscriptionPlan);
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

  // Buscar a assinatura sempre que o usuário mudar
  useEffect(() => {
    fetchSubscription();
  }, [user]);

  return (
    <SubscriptionContext.Provider value={{ plan, isLoading, isPro, refreshSubscription }}>
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

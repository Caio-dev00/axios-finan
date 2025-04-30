import { supabase } from "@/integrations/supabase/client";

// Atualizar a assinatura para o Plano Pro
export const upgradeToProPlan = async (userId: string) => {
  try {
    const response = await fetch(`${window.origin}/api/update-subscription`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: userId,
        plan_type: "pro",
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Erro ao atualizar assinatura");
    }

    return await response.json();
  } catch (error) {
    console.error("Erro ao atualizar assinatura:", error);
    throw error;
  }
};

// Verificar se o usuário tem uma assinatura ativa
export const checkSubscription = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from("user_subscriptions")
      .select("*")
      .eq("user_id", userId)
      .eq("is_active", true)
      .maybeSingle();

    if (error) throw error;

    return {
      isPro: data?.plan_type === "pro" && data?.is_active,
      subscription: data || null,
    };
  } catch (error) {
    console.error("Erro ao verificar assinatura:", error);
    return { isPro: false, subscription: null };
  }
};

// Cancelar uma assinatura
export const cancelSubscription = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from("user_subscriptions")
      .update({
        is_active: false,
        end_date: new Date().toISOString(),
      })
      .eq("user_id", userId);

    if (error) throw error;

    return { success: true };
  } catch (error) {
    console.error("Erro ao cancelar assinatura:", error);
    throw error;
  }
};

// Atualizar diretamente o status de assinatura do usuário (para uso administrativo)
export const setUserSubscriptionStatus = async (userId: string, planType: "free" | "pro") => {
  try {
    // Verificar se já existe uma assinatura para o usuário
    const { data: existingSubscription, error: fetchError } = await supabase
      .from("user_subscriptions")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();
    
    if (fetchError) throw fetchError;
    
    if (existingSubscription) {
      // Atualizar a assinatura existente
      const { error: updateError } = await supabase
        .from("user_subscriptions")
        .update({
          plan_type: planType,
          is_active: true,
          end_date: planType === "pro" ? null : existingSubscription.end_date,
        })
        .eq("user_id", userId);
      
      if (updateError) throw updateError;
    } else {
      // Criar uma nova assinatura
      const { error: insertError } = await supabase
        .from("user_subscriptions")
        .insert({
          user_id: userId,
          plan_type: planType,
          is_active: true,
        });
      
      if (insertError) throw insertError;
    }
    
    return { success: true };
  } catch (error) {
    console.error("Erro ao definir status da assinatura:", error);
    throw error;
  }
};

// Processar a conclusão de pagamento e atualizar a assinatura
export const processPaymentCompletion = async (userId: string) => {
  try {
    // Atualize o status da assinatura para pro
    await setUserSubscriptionStatus(userId, "pro");
    
    // Crie uma notificação para o usuário
    const { error } = await supabase
      .from("notifications")
      .insert({
        user_id: userId,
        title: "Bem-vindo ao Plano Pro!",
        message: "Sua assinatura foi ativada com sucesso. Aproveite todos os recursos!",
        type: "subscription",
      });
    
    if (error) throw error;
    
    return { success: true };
  } catch (error) {
    console.error("Erro ao processar conclusão de pagamento:", error);
    throw error;
  }
};

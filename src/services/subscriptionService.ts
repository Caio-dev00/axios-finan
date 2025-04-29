
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

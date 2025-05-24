
import { supabase } from "@/integrations/supabase/client";

export const upgradeToProPlan = async (userId: string) => {
  try {
    console.log("🚀 Iniciando upgrade para plano Pro:", userId);
    
    const { data, error } = await supabase.functions.invoke('update-subscription', {
      body: { user_id: userId, plan_type: 'pro' }
    });
    
    if (error) {
      console.error("❌ Erro na edge function:", error);
      throw error;
    }
    
    console.log("✅ Upgrade realizado com sucesso:", data);
    return data;
  } catch (error) {
    console.error('❌ Erro ao atualizar assinatura:', error);
    throw error;
  }
};

export const processPaymentCompletion = async (userId: string, paymentId?: string) => {
  try {
    console.log("💳 Processando conclusão do pagamento:", { userId, paymentId });
    
    const { data, error } = await supabase.functions.invoke('update-subscription', {
      body: { 
        user_id: userId,
        plan_type: 'pro',
        payment_id: paymentId
      }
    });
    
    if (error) {
      console.error("❌ Erro ao processar pagamento:", error);
      throw error;
    }
    
    console.log("✅ Pagamento processado com sucesso:", data);
    return data;
  } catch (error) {
    console.error('❌ Erro ao processar pagamento:', error);
    throw error;
  }
};

export const checkSubscriptionStatus = async (userId: string) => {
  try {
    console.log("🔍 Verificando status da assinatura:", userId);
    
    const { data, error } = await supabase
      .from('user_subscriptions')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();
      
    if (error) {
      console.error("❌ Erro ao verificar status:", error);
      throw error;
    }
    
    console.log("📊 Status da assinatura:", data);
    return data;
  } catch (error) {
    console.error('❌ Erro ao verificar status da assinatura:', error);
    throw error;
  }
};

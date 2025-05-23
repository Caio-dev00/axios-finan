
import { supabase } from "@/integrations/supabase/client";

export const upgradeToProPlan = async (userId: string) => {
  try {
    const { data, error } = await supabase.functions.invoke('update-subscription', {
      body: { user_id: userId }
    });
    
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error('Erro ao atualizar assinatura:', error);
    throw error;
  }
};

export const processPaymentCompletion = async (userId: string) => {
  try {
    const { data, error } = await supabase.functions.invoke('update-subscription', {
      body: { 
        user_id: userId,
        plan_type: 'pro'
      }
    });
    
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error('Erro ao processar pagamento:', error);
    throw error;
  }
};

export const processKiwifyPayment = async (userId: string, paymentData: any) => {
  try {
    const { data, error } = await supabase.functions.invoke('kiwify-webhook', {
      body: { 
        user_id: userId,
        status: 'paid',
        customer: { email: paymentData.email },
        custom_fields: { user_id: userId },
        ...paymentData
      }
    });
    
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error('Erro ao processar pagamento Kiwify:', error);
    throw error;
  }
};

export const checkSubscriptionStatus = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('user_subscriptions')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();
      
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error('Erro ao verificar status da assinatura:', error);
    throw error;
  }
};

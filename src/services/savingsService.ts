
import { supabase } from "@/integrations/supabase/client";

export interface Savings {
  id?: string;
  user_id?: string;
  balance: number;
  monthly_saved: number;
  monthly_returns: number;
  savings_rate: number;
  created_at?: string;
  updated_at?: string;
}

export const getSavingsData = async (): Promise<Savings> => {
  const { data: userData } = await supabase.auth.getUser();
  const userId = userData.user?.id;
  
  const { data, error } = await supabase
    .from("savings")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    // Se não encontrar dados, retorna um objeto vazio para inicializar
    if (error.code === "PGSQL_NO_ROWS_RETURNED") {
      return {
        balance: 0,
        monthly_saved: 0,
        monthly_returns: 0,
        savings_rate: 0
      };
    }
    throw error;
  }
  
  return data || {
    balance: 0,
    monthly_saved: 0,
    monthly_returns: 0,
    savings_rate: 0
  };
};

export const updateSavingsData = async (savings: Savings) => {
  const { data: userData } = await supabase.auth.getUser();
  const userId = userData.user?.id;
  
  // Verificar se já existe um registro para o usuário
  const { data: existingData } = await supabase
    .from("savings")
    .select("*")
    .eq("user_id", userId);
  
  let result;
  
  if (existingData && existingData.length > 0) {
    // Atualizar registro existente
    const { data, error } = await supabase
      .from("savings")
      .update({
        balance: savings.balance,
        monthly_saved: savings.monthly_saved,
        monthly_returns: savings.monthly_returns,
        savings_rate: savings.savings_rate,
        updated_at: new Date().toISOString()
      })
      .eq("user_id", userId)
      .select();
      
    if (error) throw error;
    result = data;
  } else {
    // Criar novo registro
    const { data, error } = await supabase
      .from("savings")
      .insert({
        user_id: userId,
        balance: savings.balance,
        monthly_saved: savings.monthly_saved,
        monthly_returns: savings.monthly_returns,
        savings_rate: savings.savings_rate
      })
      .select();
      
    if (error) throw error;
    result = data;
  }
  
  return result[0];
};


import { supabase } from "@/integrations/supabase/client";

export interface Investment {
  id?: string;
  user_id?: string;
  category: string;
  amount: number;
  percentage: number;
  color: string;
  created_at?: string;
  updated_at?: string;
}

export interface InvestmentPerformance {
  id?: string;
  user_id?: string;
  total_invested: number;
  monthly_return_percentage: number;
  monthly_return_amount: number;
  yearly_return_percentage: number;
  yearly_return_amount: number;
  created_at?: string;
  updated_at?: string;
}

export const getInvestments = async () => {
  const { data: userData } = await supabase.auth.getUser();
  const userId = userData.user?.id;
  
  const { data, error } = await supabase
    .from("investments")
    .select("*")
    .eq("user_id", userId)
    .order("percentage", { ascending: false });

  if (error) throw error;
  
  return data || [];
};

export const addInvestment = async (investment: Omit<Investment, "user_id" | "id" | "created_at" | "updated_at">) => {
  const { data: userData } = await supabase.auth.getUser();
  const userId = userData.user?.id;
  
  const { data, error } = await supabase
    .from("investments")
    .insert({
      user_id: userId,
      category: investment.category,
      amount: investment.amount,
      percentage: investment.percentage,
      color: investment.color
    })
    .select();
    
  if (error) throw error;
  return data[0];
};

export const updateInvestment = async (id: string, investment: Partial<Investment>) => {
  const { data, error } = await supabase
    .from("investments")
    .update({
      category: investment.category,
      amount: investment.amount,
      percentage: investment.percentage,
      color: investment.color,
      updated_at: new Date().toISOString()
    })
    .eq("id", id)
    .select();
    
  if (error) throw error;
  return data[0];
};

export const deleteInvestment = async (id: string) => {
  const { error } = await supabase
    .from("investments")
    .delete()
    .eq("id", id);
    
  if (error) throw error;
  return true;
};

export const getInvestmentTotalAndReturns = async () => {
  const { data: userData } = await supabase.auth.getUser();
  const userId = userData.user?.id;
  
  const { data, error } = await supabase
    .from("investment_performance")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    // If it's not a no-rows-returned error, then throw it
    if (error.code !== "PGSQL_NO_ROWS_RETURNED") {
      throw error;
    }
    
    // If no data, return defaults
    return {
      total_invested: 0,
      monthly_return_percentage: 0,
      monthly_return_amount: 0,
      yearly_return_percentage: 0,
      yearly_return_amount: 0
    };
  }
  
  return data || {
    total_invested: 0,
    monthly_return_percentage: 0,
    monthly_return_amount: 0,
    yearly_return_percentage: 0,
    yearly_return_amount: 0
  };
};

export const updateInvestmentPerformance = async (performance: {
  total_invested: number;
  monthly_return_percentage: number;
  monthly_return_amount: number;
  yearly_return_percentage: number;
  yearly_return_amount: number;
}) => {
  const { data: userData } = await supabase.auth.getUser();
  const userId = userData.user?.id;
  
  const { data: existingData } = await supabase
    .from("investment_performance")
    .select("*")
    .eq("user_id", userId);
  
  let result;
  
  if (existingData && existingData.length > 0) {
    // Update existing record
    const { data, error } = await supabase
      .from("investment_performance")
      .update({
        ...performance,
        updated_at: new Date().toISOString()
      })
      .eq("user_id", userId)
      .select();
      
    if (error) throw error;
    result = data;
  } else {
    // Create new record
    const { data, error } = await supabase
      .from("investment_performance")
      .insert({
        user_id: userId,
        ...performance
      })
      .select();
      
    if (error) throw error;
    result = data;
  }
  
  return result[0];
};

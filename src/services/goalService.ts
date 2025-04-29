import { supabase } from "@/integrations/supabase/client";

export interface Goal {
  id?: string;
  title: string;
  target_amount: number;
  current_amount: number;
  target_date: Date;
  description?: string;
}

export const addGoal = async (goal: Goal) => {
  const { data, error } = await supabase.from("goals").insert({
    user_id: (await supabase.auth.getUser()).data.user?.id,
    title: goal.title,
    target_amount: goal.target_amount,
    current_amount: goal.current_amount,
    target_date: goal.target_date.toISOString().split("T")[0],
    description: goal.description || null,
  }).select();

  if (error) throw error;
  return data?.[0];
};

export const deleteGoal = async (id: string) => {
  const { error } = await supabase
    .from("goals")
    .delete()
    .eq("id", id);

  if (error) throw error;
  return true;
};

export const getGoals = async () => {
  const { data, error } = await supabase
    .from("goals")
    .select("*")
    .order("target_date", { ascending: true });

  if (error) throw error;
  
  return data.map(goal => {
    const percentage = Math.round((parseFloat(goal.current_amount as any) / parseFloat(goal.target_amount as any)) * 100);
    const targetDate = new Date(goal.target_date);
    
    // Formatar o deadline para algo como "dezembro 2025"
    const month = targetDate.toLocaleString('pt-BR', { month: 'long' });
    const year = targetDate.getFullYear();
    
    return {
      ...goal,
      target_date: targetDate,
      current_amount: parseFloat(goal.current_amount as any),
      target_amount: parseFloat(goal.target_amount as any),
      percentage,
      deadline: `${month} ${year}`,
    };
  });
};

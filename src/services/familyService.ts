
import { supabase } from "@/integrations/supabase/client";

// Types
export interface FamilyPlan {
  id: string;
  owner_id: string;
  name: string;
  created_at: string;
  updated_at: string;
  max_members: number;
}

export interface FamilyMember {
  id: string;
  family_plan_id: string;
  user_id: string;
  role: "owner" | "member";
  created_at: string;
  user?: {
    email: string;
    nome: string;
  };
}

export interface UserSubscription {
  id: string;
  user_id: string;
  plan_type: "free" | "pro" | "family";
  start_date: string;
  end_date: string | null;
  is_active: boolean;
}

// Get current user's family plan
export const getFamilyPlan = async (): Promise<FamilyPlan | null> => {
  const { data: familyPlans, error } = await supabase
    .from("family_plans")
    .select("*")
    .limit(1);

  if (error) {
    console.error("Error fetching family plan:", error);
    throw error;
  }

  return familyPlans && familyPlans.length > 0 ? familyPlans[0] : null;
};

// Get current user subscription
export const getUserSubscription = async (): Promise<UserSubscription | null> => {
  const user = (await supabase.auth.getUser()).data.user;
  
  if (!user) return null;
  
  const { data, error } = await supabase
    .from("user_subscriptions")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (error) {
    console.error("Error fetching user subscription:", error);
    return null;
  }

  return data;
};

// Get members of a family plan
export const getFamilyMembers = async (familyPlanId: string): Promise<FamilyMember[]> => {
  const { data, error } = await supabase
    .from("family_members")
    .select(`
      *,
      user:user_id (
        email,
        nome:raw_user_meta_data->nome
      )
    `)
    .eq("family_plan_id", familyPlanId);

  if (error) {
    console.error("Error fetching family members:", error);
    throw error;
  }

  return data || [];
};

// Create an invitation link (simplified for now)
export const createInvitationLink = (familyPlanId: string): string => {
  // In a real app, this would create a secure, time-limited token
  // For now, we'll just encode some basic info
  const token = btoa(`invite:${familyPlanId}:${Date.now()}`);
  return `${window.location.origin}/invite/${token}`;
};

// Invite family member by email
export const inviteFamilyMember = async (email: string, familyPlanId: string): Promise<boolean> => {
  try {
    // In a real app, you would:
    // 1. Check if user exists
    // 2. If yes, add them to the family_members table
    // 3. If no, send an invitation email
    
    // For this demo, we'll assume the user exists
    // In a production app, you would handle this more robustly
    
    // Simplified: we just log that an invitation would be sent
    console.log(`Invitation would be sent to ${email} for family plan ${familyPlanId}`);
    return true;
  } catch (error) {
    console.error("Error inviting family member:", error);
    return false;
  }
};

// Remove a member from family plan
export const removeFamilyMember = async (memberId: string): Promise<boolean> => {
  const { error } = await supabase
    .from("family_members")
    .delete()
    .eq("id", memberId);

  if (error) {
    console.error("Error removing family member:", error);
    return false;
  }

  return true;
};

// Update family plan name
export const updateFamilyPlan = async (
  planId: string,
  updates: Partial<FamilyPlan>
): Promise<FamilyPlan | null> => {
  const { data, error } = await supabase
    .from("family_plans")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", planId)
    .select()
    .single();

  if (error) {
    console.error("Error updating family plan:", error);
    throw error;
  }

  return data;
};

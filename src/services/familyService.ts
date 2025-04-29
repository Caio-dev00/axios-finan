import { supabase } from "../integrations/supabase/client";

export type FamilyPlan = {
  id: string;
  owner_id: string;
  name: string;
  created_at: string;
  updated_at: string;
  max_members: number;
};

export type FamilyMember = {
  id: string;
  family_plan_id: string;
  user_id: string;
  role: "owner" | "member";
  created_at: string;
  user?: {
    email: string;
    user_metadata?: {
      nome?: string;
    };
  };
};

export type UserSubscription = {
  id: string;
  user_id: string;
  plan_type: "free" | "pro" | "family";
  start_date: string;
  end_date?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

// Função para obter a assinatura do usuário atual
export async function getUserSubscription(): Promise<UserSubscription | null> {
  try {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) {
      throw new Error("Usuário não autenticado");
    }

    const { data, error } = await supabase
      .from("user_subscriptions")
      .select("*")
      .eq("user_id", user.user.id)
      .single();

    if (error) {
      console.error("Erro ao buscar assinatura:", error);
      return null;
    }

    // Ensure the plan_type is one of the allowed values
    const subscription: UserSubscription = {
      ...data,
      plan_type: data.plan_type as "free" | "pro" | "family"
    };

    return subscription;
  } catch (error) {
    console.error("Erro ao buscar assinatura do usuário:", error);
    return null;
  }
}

// Função para obter o plano familiar do usuário atual
export async function getFamilyPlan(): Promise<FamilyPlan | null> {
  try {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) {
      throw new Error("Usuário não autenticado");
    }

    // Primeiro verifica se o usuário é um proprietário de plano familiar
    let { data, error } = await supabase
      .from("family_plans")
      .select("*")
      .eq("owner_id", user.user.id)
      .single();

    if (error && error.code !== "PGRST116") {
      // Se não for proprietário, verifica se é membro de algum plano familiar
      const { data: memberData, error: memberError } = await supabase
        .from("family_members")
        .select("family_plan_id")
        .eq("user_id", user.user.id)
        .single();

      if (memberError) {
        console.error("Erro ao buscar associação de membro:", memberError);
        return null;
      }

      const { data: planData, error: planError } = await supabase
        .from("family_plans")
        .select("*")
        .eq("id", memberData.family_plan_id)
        .single();

      if (planError) {
        console.error("Erro ao buscar plano familiar como membro:", planError);
        return null;
      }

      data = planData;
    } else if (error) {
      console.error("Erro ao buscar plano familiar como proprietário:", error);
      return null;
    }

    return data as FamilyPlan;
  } catch (error) {
    console.error("Erro ao buscar plano familiar:", error);
    return null;
  }
}

// Função para obter os membros de um plano familiar
export async function getFamilyMembers(familyPlanId: string): Promise<FamilyMember[]> {
  try {
    const { data, error } = await supabase
      .from("family_members")
      .select(`
        *,
        user:user_id(
          email,
          user_metadata
        )
      `)
      .eq("family_plan_id", familyPlanId);

    if (error) {
      console.error("Erro ao buscar membros da família:", error);
      return [];
    }

    // Transform the data and ensure proper typing
    return data.map(member => {
      // Handle potential null/undefined values
      const userData = member.user as any || {};
      
      return {
        ...member,
        role: member.role as "owner" | "member",
        user: {
          email: userData.email || "",
          user_metadata: userData.user_metadata || {}
        }
      };
    });
  } catch (error) {
    console.error("Erro ao buscar membros da família:", error);
    return [];
  }
}

// Função para convidar um novo membro para o plano familiar
export async function inviteFamilyMember(email: string, familyPlanId: string): Promise<{ success: boolean; message: string }> {
  try {
    const { data: inviteData, error: inviteError } = await supabase.functions.invoke("invite-family-member", {
      body: { email, familyPlanId },
    });

    if (inviteError) {
      return { success: false, message: `Erro ao enviar convite: ${inviteError.message}` };
    }

    return { success: true, message: "Convite enviado com sucesso!" };
  } catch (error) {
    console.error("Erro ao convidar membro:", error);
    return { success: false, message: "Erro ao enviar convite. Tente novamente." };
  }
}

// Função para aceitar um convite para um plano familiar
export async function acceptFamilyInvite(token: string): Promise<{ success: boolean; message: string }> {
  try {
    const { data, error } = await supabase.functions.invoke("accept-family-invite", {
      body: { token },
    });

    if (error) {
      return { success: false, message: `Erro ao aceitar convite: ${error.message}` };
    }

    return { success: true, message: "Convite aceito com sucesso!" };
  } catch (error) {
    console.error("Erro ao aceitar convite:", error);
    return { success: false, message: "Erro ao aceitar convite. Tente novamente." };
  }
}

// Função para remover um membro do plano familiar
export async function removeFamilyMember(memberId: string): Promise<{ success: boolean; message: string }> {
  try {
    const { error } = await supabase
      .from("family_members")
      .delete()
      .eq("id", memberId);

    if (error) {
      return { success: false, message: `Erro ao remover membro: ${error.message}` };
    }

    return { success: true, message: "Membro removido com sucesso!" };
  } catch (error) {
    console.error("Erro ao remover membro:", error);
    return { success: false, message: "Erro ao remover membro. Tente novamente." };
  }
}

// Nova função para atualizar o plano familiar
export async function updateFamilyPlan(
  planId: string,
  updates: Partial<FamilyPlan>
): Promise<{ success: boolean; message: string }> {
  try {
    const { error } = await supabase
      .from("family_plans")
      .update(updates)
      .eq("id", planId);

    if (error) {
      return { success: false, message: `Erro ao atualizar plano: ${error.message}` };
    }

    return { success: true, message: "Plano familiar atualizado com sucesso!" };
  } catch (error) {
    console.error("Erro ao atualizar plano familiar:", error);
    return { success: false, message: "Erro ao atualizar plano. Tente novamente." };
  }
}

// Nova função para criar um link de convite
export function createInvitationLink(familyPlanId: string): string {
  // Generate a token that includes the family plan ID
  // In a real app, you might want to encrypt this or use a more secure method
  const token = btoa(`invite:${familyPlanId}:${Date.now()}`);
  
  // Create the full invitation URL
  const baseUrl = window.location.origin;
  return `${baseUrl}/invite/${token}`;
}


import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    // Criar cliente do Supabase usando as variáveis de ambiente
    const supabaseUrl = Deno.env.get("SUPABASE_URL") as string;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") as string;
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    
    // Obter o token da solicitação
    const { token } = await req.json();
    
    if (!token) {
      throw new Error("Token de convite não fornecido");
    }
    
    // Decodificar e validar o token
    let familyPlanId: string;
    
    try {
      const decoded = atob(token);
      const parts = decoded.split(":");
      
      if (parts.length < 2 || parts[0] !== "invite") {
        throw new Error("Token de convite inválido");
      }
      
      familyPlanId = parts[1];
    } catch (e) {
      throw new Error("Token de convite inválido ou expirado");
    }
    
    // Verificar se o usuário está autenticado
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Usuário não autenticado", 
          redirectToAuth: true 
        }),
        {
          status: 401,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }
    
    const userId = session.user.id;
    
    // Verificar se o plano familiar existe
    const { data: familyPlan, error: familyPlanError } = await supabase
      .from("family_plans")
      .select("id, max_members")
      .eq("id", familyPlanId)
      .single();
      
    if (familyPlanError || !familyPlan) {
      throw new Error("Plano familiar não encontrado ou foi excluído");
    }
    
    // Verificar se o usuário já é membro do plano
    const { data: existingMember, error: memberCheckError } = await supabase
      .from("family_members")
      .select("id")
      .eq("family_plan_id", familyPlanId)
      .eq("user_id", userId)
      .maybeSingle();
      
    if (existingMember) {
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: "Você já é membro deste plano familiar" 
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }
    
    // Verificar se o plano atingiu o limite de membros
    const { count, error: countError } = await supabase
      .from("family_members")
      .select("*", { count: "exact", head: true })
      .eq("family_plan_id", familyPlanId);
      
    if (countError) {
      throw new Error("Erro ao verificar membros existentes");
    }
    
    if (count && count >= familyPlan.max_members) {
      throw new Error("Este plano familiar já atingiu o limite máximo de membros");
    }
    
    // Adicionar o usuário como membro do plano familiar
    const { error: insertError } = await supabase
      .from("family_members")
      .insert({
        family_plan_id: familyPlanId,
        user_id: userId,
        role: "member"
      });
      
    if (insertError) {
      throw new Error(`Erro ao adicionar membro: ${insertError.message}`);
    }
    
    // Atualizar a assinatura do usuário para o plano familiar, se necessário
    const { data: subscription } = await supabase
      .from("user_subscriptions")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();
      
    if (!subscription || subscription.plan_type !== "family") {
      // Criar ou atualizar a assinatura para o plano familiar
      const subscriptionData = {
        user_id: userId,
        plan_type: "family",
        start_date: new Date().toISOString(),
        is_active: true
      };
      
      if (subscription) {
        await supabase
          .from("user_subscriptions")
          .update(subscriptionData)
          .eq("user_id", userId);
      } else {
        await supabase
          .from("user_subscriptions")
          .insert(subscriptionData);
      }
    }
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Você foi adicionado ao plano familiar com sucesso!" 
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
    
  } catch (error) {
    console.error("Erro na função accept-family-invite:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
});

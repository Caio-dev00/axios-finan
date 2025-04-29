
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.0";

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
    // Create Supabase client with service role key (to bypass RLS)
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") || "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || ""
    );

    // Get the JWT from the request
    const authHeader = req.headers.get("Authorization");
    
    // Get the request body
    const { token } = await req.json();
    
    if (!token) {
      throw new Error("Token de convite não fornecido");
    }
    
    // Decode the token
    let familyPlanId;
    try {
      const decoded = atob(token);
      const [prefix, id] = decoded.split(":");
      
      if (prefix !== "invite" || !id) {
        throw new Error("Token inválido");
      }
      
      familyPlanId = id;
    } catch (error) {
      throw new Error("Token de convite inválido");
    }

    // Get current user from JWT
    let user;
    if (authHeader) {
      const jwt = authHeader.replace("Bearer ", "");
      const { data: { user: userData }, error: userError } = await supabase.auth.getUser(jwt);
      
      if (userError || !userData) {
        console.error("Erro ao obter usuário:", userError);
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: "Usuário não autenticado", 
            redirectToAuth: true 
          }),
          { 
            status: 401, 
            headers: { "Content-Type": "application/json", ...corsHeaders } 
          }
        );
      }
      
      user = userData;
    } else {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Usuário não autenticado", 
          redirectToAuth: true 
        }),
        { 
          status: 401, 
          headers: { "Content-Type": "application/json", ...corsHeaders } 
        }
      );
    }

    // Check if the family plan exists
    const { data: familyPlan, error: familyPlanError } = await supabase
      .from("family_plans")
      .select("*")
      .eq("id", familyPlanId)
      .single();
      
    if (familyPlanError || !familyPlan) {
      console.error("Erro ao buscar plano familiar:", familyPlanError);
      throw new Error("Plano familiar não encontrado");
    }

    // Check if user is already a member of this family plan
    const { data: existingMember, error: memberError } = await supabase
      .from("family_members")
      .select("*")
      .eq("family_plan_id", familyPlanId)
      .eq("user_id", user.id)
      .maybeSingle();
      
    if (existingMember) {
      return new Response(
        JSON.stringify({ success: true, message: "Você já é membro deste plano familiar" }),
        { 
          status: 200, 
          headers: { "Content-Type": "application/json", ...corsHeaders } 
        }
      );
    }

    // Check if the family plan has reached its maximum number of members
    const { data: memberCount, error: countError } = await supabase
      .from("family_members")
      .select("*", { count: 'exact', head: true })
      .eq("family_plan_id", familyPlanId);
      
    if (countError) {
      console.error("Erro ao contar membros:", countError);
      throw new Error("Erro ao verificar capacidade do plano familiar");
    }
      
    const count = memberCount?.length || 0;
    
    if (count >= familyPlan.max_members) {
      throw new Error("Este plano familiar já atingiu o limite máximo de membros");
    }

    // Add the user as a member of the family plan
    const { error: insertError } = await supabase
      .from("family_members")
      .insert({
        family_plan_id: familyPlanId,
        user_id: user.id,
        role: "member"
      });
      
    if (insertError) {
      console.error("Erro ao adicionar membro:", insertError);
      throw new Error("Erro ao adicionar você como membro do plano familiar");
    }

    return new Response(
      JSON.stringify({ success: true, message: "Convite aceito com sucesso!" }),
      { 
        status: 200, 
        headers: { "Content-Type": "application/json", ...corsHeaders } 
      }
    );
  } catch (error: any) {
    console.error("Erro na função accept-family-invite:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { 
        status: 500, 
        headers: { "Content-Type": "application/json", ...corsHeaders } 
      }
    );
  }
});

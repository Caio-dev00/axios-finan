
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Parse webhook payload
    const payload = await req.json();
    
    console.log("Webhook Kiwify recebido:", payload);

    // Verificar se é um evento de compra aprovada
    if (payload.status === "paid" || payload.status === "approved") {
      const userEmail = payload.customer?.email;
      const userId = payload.custom_fields?.user_id || payload.metadata?.user_id;
      
      if (!userId && !userEmail) {
        console.error("Webhook sem identificação do usuário");
        return new Response(
          JSON.stringify({ error: "User identification required" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      let finalUserId = userId;

      // Se não temos user_id, mas temos email, buscar pelo perfil
      if (!userId && userEmail) {
        const { data: profile, error: profileError } = await supabaseClient
          .from("profiles")
          .select("id")
          .eq("email", userEmail)
          .maybeSingle();

        if (profileError) {
          console.error("Erro ao buscar perfil por email:", profileError);
        } else if (profile) {
          finalUserId = profile.id;
        }
      }

      if (!finalUserId) {
        console.error("Não foi possível identificar o usuário para ativar o plano Pro");
        return new Response(
          JSON.stringify({ error: "User not found" }),
          { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      console.log("Ativando plano Pro para usuário:", finalUserId);

      // Verificar se já existe uma assinatura
      const { data: existingSubscription, error: fetchError } = await supabaseClient
        .from("user_subscriptions")
        .select("*")
        .eq("user_id", finalUserId)
        .maybeSingle();
        
      if (fetchError) {
        console.error("Erro ao buscar assinatura:", fetchError);
        throw fetchError;
      }

      let subscriptionResult;

      if (existingSubscription) {
        // Atualizar assinatura existente
        const { data, error } = await supabaseClient
          .from("user_subscriptions")
          .update({
            plan_type: "pro",
            is_active: true,
            end_date: null,
            updated_at: new Date().toISOString(),
          })
          .eq("user_id", finalUserId);
          
        if (error) {
          console.error("Erro ao atualizar assinatura:", error);
          throw error;
        }
        
        subscriptionResult = data;
      } else {
        // Criar nova assinatura
        const { data, error } = await supabaseClient
          .from("user_subscriptions")
          .insert({
            user_id: finalUserId,
            plan_type: "pro",
            is_active: true,
            payment_id: payload.id || payload.transaction_id,
          });
          
        if (error) {
          console.error("Erro ao criar assinatura:", error);
          throw error;
        }
        
        subscriptionResult = data;

        // Criar notificação de boas-vindas para nova assinatura
        const { error: notificationError } = await supabaseClient
          .from("notifications")
          .insert({
            user_id: finalUserId,
            title: "Bem-vindo ao Plano Pro!",
            message: "Sua assinatura foi ativada com sucesso. Aproveite todos os recursos premium!",
            type: "subscription",
            is_read: false
          });
          
        if (notificationError) {
          console.error("Erro ao criar notificação:", notificationError);
        }
      }

      console.log("Plano Pro ativado com sucesso para usuário:", finalUserId);
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: "Plano Pro ativado com sucesso",
          user_id: finalUserId 
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Para outros tipos de webhook, apenas confirmar recebimento
    return new Response(
      JSON.stringify({ message: "Webhook recebido" }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Erro ao processar webhook Kiwify:", error.message);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

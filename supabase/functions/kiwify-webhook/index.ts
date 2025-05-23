
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
    
    console.log("Webhook Kiwify recebido:", JSON.stringify(payload, null, 2));

    // Verificar se é um evento de compra aprovada
    if (payload.order_status === "paid" || payload.webhook_event_type === "order_approved") {
      const userEmail = payload.Customer?.email;
      console.log("Email do cliente:", userEmail);
      
      if (!userEmail) {
        console.error("Webhook sem email do cliente");
        return new Response(
          JSON.stringify({ error: "Customer email required" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Buscar usuário pelo email na tabela profiles
      const { data: profile, error: profileError } = await supabaseClient
        .from("profiles")
        .select("id, email")
        .eq("email", userEmail)
        .maybeSingle();

      if (profileError) {
        console.error("Erro ao buscar perfil por email:", profileError);
      }

      let userId = profile?.id;
      console.log("Usuário encontrado:", userId);

      if (!userId) {
        console.log("Usuário não encontrado. Criando registro de assinatura pendente para:", userEmail);
        
        // Se o usuário não existe, vamos criar um registro temporário que será associado quando ele se cadastrar
        const { data: pendingSubscription, error: pendingError } = await supabaseClient
          .from("pending_subscriptions")
          .insert({
            email: userEmail,
            plan_type: "pro",
            order_id: payload.order_id || payload.id,
            created_at: new Date().toISOString()
          });

        if (pendingError) {
          console.error("Erro ao criar assinatura pendente:", pendingError);
        } else {
          console.log("Assinatura pendente criada para:", userEmail);
        }

        return new Response(
          JSON.stringify({ 
            success: true, 
            message: "Pagamento registrado. Assinatura será ativada quando o usuário se cadastrar.",
            email: userEmail
          }),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      console.log("Ativando plano Pro para usuário:", userId);

      // Verificar se já existe uma assinatura
      const { data: existingSubscription, error: fetchError } = await supabaseClient
        .from("user_subscriptions")
        .select("*")
        .eq("user_id", userId)
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
          .eq("user_id", userId);
          
        if (error) {
          console.error("Erro ao atualizar assinatura:", error);
          throw error;
        }
        
        subscriptionResult = data;
        console.log("Assinatura atualizada para Pro");
      } else {
        // Criar nova assinatura
        const { data, error } = await supabaseClient
          .from("user_subscriptions")
          .insert({
            user_id: userId,
            plan_type: "pro",
            is_active: true,
            payment_id: payload.order_id || payload.id,
          });
          
        if (error) {
          console.error("Erro ao criar assinatura:", error);
          throw error;
        }
        
        subscriptionResult = data;
        console.log("Nova assinatura Pro criada");

        // Criar notificação de boas-vindas para nova assinatura
        const { error: notificationError } = await supabaseClient
          .from("notifications")
          .insert({
            user_id: userId,
            title: "Bem-vindo ao Plano Pro!",
            message: "Sua assinatura foi ativada com sucesso. Aproveite todos os recursos premium!",
            type: "subscription",
            is_read: false
          });
          
        if (notificationError) {
          console.error("Erro ao criar notificação:", notificationError);
        }
      }

      console.log("Plano Pro ativado com sucesso para usuário:", userId);
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: "Plano Pro ativado com sucesso",
          user_id: userId,
          email: userEmail
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Para outros tipos de webhook, apenas confirmar recebimento
    console.log("Webhook recebido mas não é de pagamento aprovado:", payload.webhook_event_type);
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

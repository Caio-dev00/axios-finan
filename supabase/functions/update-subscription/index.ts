
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

    // Parse the request body
    const { payment_id, user_id, plan_type = "pro" } = await req.json();

    if (!user_id) {
      return new Response(
        JSON.stringify({ error: "User ID é obrigatório" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Verificar se o usuário já tem uma assinatura ativa
    const { data: existingSubscription } = await supabaseClient
      .from("user_subscriptions")
      .select("*")
      .eq("user_id", user_id)
      .maybeSingle();

    let result;

    if (existingSubscription) {
      // Atualizar a assinatura existente
      result = await supabaseClient
        .from("user_subscriptions")
        .update({
          plan_type,
          is_active: true,
          end_date: null, // Assinatura ativa não tem data de término
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", user_id);
    } else {
      // Criar uma nova assinatura
      result = await supabaseClient
        .from("user_subscriptions")
        .insert({
          user_id,
          plan_type,
          is_active: true,
          payment_id: payment_id || null,
        });
    }

    // Criar uma notificação para o usuário
    await supabaseClient
      .from("notifications")
      .insert({
        user_id,
        title: "Bem-vindo ao Plano Pro!",
        message: "Sua assinatura foi ativada com sucesso. Aproveite todos os recursos!",
        type: "subscription",
      });

    return new Response(
      JSON.stringify({ success: true, message: "Assinatura atualizada com sucesso" }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

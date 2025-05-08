import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const { email } = await req.json();

    if (!email) {
      return new Response(
        JSON.stringify({ error: "Email é obrigatório" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Primeiro, buscar o usuário pelo email
    const { data: user, error: userError } = await supabaseClient
      .from("users")
      .select("id")
      .eq("email", email)
      .single();

    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: "Usuário não encontrado" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Excluir dados relacionados
    const userId = user.id;

    // Excluir notificações
    await supabaseClient
      .from("notifications")
      .delete()
      .eq("user_id", userId);

    // Excluir assinaturas
    await supabaseClient
      .from("user_subscriptions")
      .delete()
      .eq("user_id", userId);

    // Excluir transações
    await supabaseClient
      .from("transactions")
      .delete()
      .eq("user_id", userId);

    // Excluir categorias
    await supabaseClient
      .from("categories")
      .delete()
      .eq("user_id", userId);

    // Excluir metas
    await supabaseClient
      .from("goals")
      .delete()
      .eq("user_id", userId);

    // Excluir usuário
    const { error: deleteError } = await supabaseClient
      .from("users")
      .delete()
      .eq("id", userId);

    if (deleteError) {
      throw deleteError;
    }

    return new Response(
      JSON.stringify({ success: true, message: "Usuário excluído com sucesso" }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Erro ao excluir usuário:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
}); 
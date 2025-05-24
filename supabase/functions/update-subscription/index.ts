
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
    const { payment_id, user_id, plan_type = "pro", email } = await req.json();

    console.log("=== INÍCIO DO PROCESSAMENTO ===");
    console.log("Processando atualização de assinatura:", {
      user_id,
      email,
      plan_type,
      payment_id
    });

    // Verificar se é um ID de teste (sempre aprovado)
    const isTestTransaction = payment_id && payment_id.startsWith("TEST_TRANSACTION_");
    if (isTestTransaction) {
      console.log("🧪 ID de transação de teste detectado - aprovando automaticamente:", payment_id);
    }

    let finalUserId = user_id;
    let userProfile = null;

    // Primeiro, tentar buscar o usuário na tabela auth.users pelo email
    if (email && !finalUserId) {
      console.log("🔍 Buscando usuário na tabela auth.users pelo email:", email);
      
      const { data: authUsers, error: authError } = await supabaseClient.auth.admin.listUsers();
      
      if (authError) {
        console.error("❌ Erro ao buscar usuários na auth:", authError);
      } else {
        const foundUser = authUsers.users.find(u => u.email === email);
        if (foundUser) {
          finalUserId = foundUser.id;
          console.log("✅ Usuário encontrado na auth.users:", { id: finalUserId, email: foundUser.email });
        } else {
          console.log("⚠️ Usuário não encontrado na auth.users para email:", email);
        }
      }
    }

    // Se ainda não temos user_id, tentar buscar na tabela profiles
    if (email && !finalUserId) {
      console.log("🔍 Buscando usuário na tabela profiles pelo email:", email);
      
      const { data: profile, error: profileError } = await supabaseClient
        .from("profiles")
        .select("id, email")
        .eq("email", email)
        .maybeSingle();

      if (profileError) {
        console.error("❌ Erro ao buscar perfil por email:", profileError);
      } else if (profile) {
        finalUserId = profile.id;
        userProfile = profile;
        console.log("✅ Usuário encontrado na tabela profiles:", userProfile);
      } else {
        console.log("⚠️ Usuário não encontrado na tabela profiles para email:", email);
      }
    }

    // Se temos user_id mas não temos o perfil, buscar o perfil
    if (finalUserId && !userProfile) {
      console.log("🔍 Buscando perfil pelo user_id:", finalUserId);
      const { data: profile, error: userError } = await supabaseClient
        .from("profiles")
        .select("id, email")
        .eq("id", finalUserId)
        .maybeSingle();
        
      if (userError) {
        console.error("❌ Erro ao verificar usuário:", userError);
      } else {
        userProfile = profile;
        console.log("✅ Perfil encontrado:", userProfile);
      }
    }

    // Se ainda não temos user_id, não podemos continuar
    if (!finalUserId) {
      console.error("❌ Não foi possível identificar o usuário");
      return new Response(
        JSON.stringify({ 
          error: "Não foi possível identificar o usuário. Verifique se o email está correto ou se o usuário está cadastrado.",
          debug: { email, user_id, received_data: { payment_id, user_id, plan_type, email } }
        }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Se o usuário não existe na tabela profiles, criar o perfil
    if (!userProfile) {
      console.log("➕ Criando perfil para o usuário...");
      const { data: newProfile, error: createError } = await supabaseClient
        .from("profiles")
        .insert({
          id: finalUserId,
          email: email || null
        })
        .select("id, email")
        .single();
        
      if (createError) {
        console.error("❌ Erro ao criar perfil:", createError);
        return new Response(
          JSON.stringify({ error: "Erro ao criar perfil do usuário: " + createError.message }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      userProfile = newProfile;
      console.log("✅ Perfil criado com sucesso:", userProfile);
    }
    
    // Verificar se o usuário já tem uma assinatura
    console.log("🔍 Verificando assinatura existente...");
    const { data: existingSubscription, error: fetchError } = await supabaseClient
      .from("user_subscriptions")
      .select("*")
      .eq("user_id", finalUserId)
      .maybeSingle();
      
    if (fetchError) {
      console.error("❌ Erro ao buscar assinatura:", fetchError);
      return new Response(
        JSON.stringify({ error: "Erro ao buscar assinatura existente: " + fetchError.message }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    let result;
    let isNewSubscription = false;

    if (existingSubscription) {
      // Atualizar a assinatura existente
      console.log("🔄 Atualizando assinatura existente...");
      const { data, error } = await supabaseClient
        .from("user_subscriptions")
        .update({
          plan_type,
          is_active: true,
          end_date: null,
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", finalUserId)
        .select();
        
      if (error) {
        console.error("❌ Erro ao atualizar assinatura:", error);
        return new Response(
          JSON.stringify({ error: "Erro ao atualizar assinatura: " + error.message }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      result = data;
      console.log("✅ Assinatura atualizada com sucesso");
    } else {
      // Criar uma nova assinatura
      console.log("➕ Criando nova assinatura...");
      const { data, error } = await supabaseClient
        .from("user_subscriptions")
        .insert({
          user_id: finalUserId,
          plan_type,
          is_active: true,
        })
        .select();
        
      if (error) {
        console.error("❌ Erro ao criar assinatura:", error);
        return new Response(
          JSON.stringify({ error: "Erro ao criar assinatura: " + error.message }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      result = data;
      isNewSubscription = true;
      console.log("✅ Nova assinatura criada com sucesso");
    }

    // Criar notificação de boas-vindas para nova assinatura
    if (isNewSubscription) {
      console.log("🔔 Criando notificação de boas-vindas...");
      const { error: notificationError } = await supabaseClient
        .from("notifications")
        .insert({
          user_id: finalUserId,
          title: "Bem-vindo ao Plano Pro!",
          message: isTestTransaction 
            ? "Sua assinatura de teste foi ativada com sucesso. Aproveite todos os recursos premium!" 
            : "Sua assinatura foi ativada com sucesso. Aproveite todos os recursos premium!",
          type: "subscription",
          is_read: false
        });
        
      if (notificationError) {
        console.error("⚠️ Erro ao criar notificação:", notificationError);
        // Não falha a operação por causa da notificação
      } else {
        console.log("✅ Notificação de boas-vindas criada");
      }
    }

    console.log("🎉 PROCESSO FINALIZADO COM SUCESSO para usuário:", finalUserId);
    console.log("=== FIM DO PROCESSAMENTO ===");
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: isTestTransaction 
          ? "Assinatura de teste ativada com sucesso" 
          : "Assinatura atualizada com sucesso",
        subscription: result,
        isNewSubscription,
        user_info: userProfile,
        test_mode: isTestTransaction
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("💥 ERRO INESPERADO:", error);
    
    return new Response(
      JSON.stringify({ error: "Erro interno do servidor: " + error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

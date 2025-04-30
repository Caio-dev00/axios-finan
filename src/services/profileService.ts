
import { supabase } from "@/integrations/supabase/client";

export const getProfile = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) throw new Error("Usuário não autenticado");
  
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();
  
  if (error) throw error;
  
  return data;
};

export const updateProfile = async (profile: any) => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) throw new Error("Usuário não autenticado");
  
  // Se temos um nome para atualizar, atualizamos também no auth.user
  if (profile.name) {
    await supabase.auth.updateUser({
      data: { nome: profile.name }
    });
  }
  
  // Construímos o objeto a ser atualizado
  const updateData: any = {};
  
  // Campo a campo para garantir que só atualizamos o que foi fornecido
  if (profile.name) updateData.nome = profile.name;
  if (profile.phone !== undefined) updateData.phone = profile.phone;
  if (profile.occupation !== undefined) updateData.occupation = profile.occupation;
  if (profile.avatar_url) updateData.avatar_url = profile.avatar_url;
  if (profile.theme_preference) updateData.theme_preference = profile.theme_preference;
  if (profile.currency_preference) updateData.currency_preference = profile.currency_preference;
  if (profile.date_format_preference) updateData.date_format_preference = profile.date_format_preference;
  if (profile.month_start_day) updateData.month_start_day = profile.month_start_day;
  
  // Adicionamos o timestamp de atualização
  updateData.updated_at = new Date().toISOString();
  
  const { error } = await supabase
    .from("profiles")
    .update(updateData)
    .eq("id", user.id);
  
  if (error) throw error;
  
  return { success: true };
};

export const updateProfileImage = async (file: File) => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) throw new Error("Usuário não autenticado");
  
  const filePath = `avatars/${user.id}_${Date.now()}`;
  
  // Upload da imagem
  const { data, error: uploadError } = await supabase.storage
    .from("user_avatars")
    .upload(filePath, file);
  
  if (uploadError) throw uploadError;
  
  // Obter URL pública
  const { data: { publicUrl } } = supabase.storage
    .from("user_avatars")
    .getPublicUrl(filePath);
  
  // Atualizar perfil com nova URL
  await updateProfile({ avatar_url: publicUrl });
  
  return publicUrl;
};

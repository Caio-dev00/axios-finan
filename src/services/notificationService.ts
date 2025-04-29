
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from 'uuid';
import { Session } from "@supabase/supabase-js";

export type NotificationType = 'info' | 'warning' | 'success';

interface CreateNotificationParams {
  title: string;
  message: string;
  type: NotificationType;
  userId?: string;
}

/**
 * Create a new notification for a user
 */
export const createNotification = async ({
  title,
  message,
  type,
  userId
}: CreateNotificationParams): Promise<boolean> => {
  try {
    let userIdToUse = userId;
    
    // If no userId was provided, try to get it from the current session
    if (!userIdToUse) {
      const { data: { session } } = await supabase.auth.getSession();
      userIdToUse = session?.user?.id;
    }
    
    // If we still don't have a userId, we can't create a notification
    if (!userIdToUse) {
      console.error("Não foi possível criar notificação: nenhum usuário logado");
      return false;
    }
    
    const { error } = await supabase.from('notifications').insert({
      id: uuidv4(),
      user_id: userIdToUse,
      title,
      message,
      type,
      is_read: false
    });

    if (error) {
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error("Erro ao criar notificação:", error);
    return false;
  }
};

/**
 * Mark a notification as read
 */
export const markNotificationAsRead = async (notificationId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', notificationId);
      
    if (error) {
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error("Erro ao marcar notificação como lida:", error);
    return false;
  }
};

/**
 * Mark all notifications for the current user as read
 */
export const markAllNotificationsAsRead = async (): Promise<boolean> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    const userId = session?.user?.id;
    
    if (!userId) {
      return false;
    }
    
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', userId)
      .eq('is_read', false);
      
    if (error) {
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error("Erro ao marcar todas notificações como lidas:", error);
    return false;
  }
};

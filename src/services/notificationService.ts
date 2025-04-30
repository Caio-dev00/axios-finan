
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from 'uuid';

export type NotificationType = 'info' | 'warning' | 'success';

interface CreateNotificationParams {
  title: string;
  message: string;
  type: NotificationType;
  userId?: string;
}

export interface NotificationPreferences {
  bill_reminders: boolean;
  budget_alerts: boolean;
  weekly_reports: boolean;
  financial_tips: boolean;
  app_updates: boolean;
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

/**
 * Get notification preferences for the current user
 */
export const getUserNotificationPreferences = async (): Promise<NotificationPreferences | null> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    const userId = session?.user?.id;
    
    if (!userId) {
      return null;
    }
    
    const { data, error } = await supabase
      .from("notification_preferences")
      .select("*")
      .eq("user_id", userId)
      .single();
      
    if (error) {
      throw error;
    }
    
    return {
      bill_reminders: data.bill_reminders,
      budget_alerts: data.budget_alerts,
      weekly_reports: data.weekly_reports,
      financial_tips: data.financial_tips,
      app_updates: data.app_updates
    };
  } catch (error) {
    console.error("Erro ao buscar preferências de notificação:", error);
    return null;
  }
};

/**
 * Update notification preferences for the current user
 */
export const updateUserNotificationPreferences = async (preferences: Partial<NotificationPreferences>): Promise<boolean> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    const userId = session?.user?.id;
    
    if (!userId) {
      return false;
    }
    
    // Make sure we only update the fields that were provided
    const updateData: any = {};
    if (preferences.bill_reminders !== undefined) updateData.bill_reminders = preferences.bill_reminders;
    if (preferences.budget_alerts !== undefined) updateData.budget_alerts = preferences.budget_alerts;
    if (preferences.weekly_reports !== undefined) updateData.weekly_reports = preferences.weekly_reports;
    if (preferences.financial_tips !== undefined) updateData.financial_tips = preferences.financial_tips;
    if (preferences.app_updates !== undefined) updateData.app_updates = preferences.app_updates;
    
    const { error } = await supabase
      .from("notification_preferences")
      .update(updateData)
      .eq("user_id", userId);
      
    if (error) {
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error("Erro ao atualizar preferências de notificação:", error);
    return false;
  }
};

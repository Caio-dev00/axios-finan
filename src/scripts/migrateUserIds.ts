
import { supabase } from "@/integrations/supabase/client";

async function migrateUserIds() {
  try {
    // Get all users - using any to avoid TypeScript issues with admin functions
    const { data: users, error: usersError } = await (supabase.auth as any).admin.listUsers();
    if (usersError) throw usersError;

    // For each user, update their records
    for (const user of users.users) {
      // Update incomes
      const { error: incomesError } = await supabase
        .from('incomes')
        .update({ user_id: user.id })
        .is('user_id', null)
        .eq('email', user.email);

      if (incomesError) {
        console.error(`Error updating incomes for user ${user.email}:`, incomesError);
      }

      // Update expenses
      const { error: expensesError } = await supabase
        .from('expenses')
        .update({ user_id: user.id })
        .is('user_id', null)
        .eq('email', user.email);

      if (expensesError) {
        console.error(`Error updating expenses for user ${user.email}:`, expensesError);
      }
    }

    console.log('Migration completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
  }
}

// Run the migration
migrateUserIds();

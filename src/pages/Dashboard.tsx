
import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { SidebarProvider } from "@/components/ui/sidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import FinancialSummary from "@/components/dashboard/FinancialSummary";
import RecentTransactions from "@/components/dashboard/RecentTransactions";
import ExpenseDistribution from "@/components/dashboard/ExpenseDistribution";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useTheme } from "@/contexts/ThemeContext";
import { ThemeProvider } from "@/contexts/ThemeContext";

// Criar um cliente QueryClient para o Dashboard
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5, // 5 minutos
    },
  },
});

const DashboardContent = () => {
  const { user } = useAuth();
  const { isDarkMode } = useTheme();
  const location = useLocation();
  const isMainDashboard = location.pathname === "/dashboard";
  
  // Extrair o nome do usuário de maneira segura
  const userName = user?.user_metadata?.nome || "Usuário";
  const firstName = userName.split(" ")[0];

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-background w-full">
      <DashboardSidebar />
      
      <div className="flex flex-col flex-1 min-h-screen">
        <DashboardHeader />
        <main className="flex-1 p-6">
          {isMainDashboard ? (
            <>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-foreground mb-6">
                Olá, {firstName}
              </h1>
              
              <FinancialSummary />
              
              <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <RecentTransactions />
                </div>
                <div className="lg:col-span-1">
                  <ExpenseDistribution />
                </div>
              </div>
            </>
          ) : (
            <Outlet />
          )}
        </main>
      </div>
    </div>
  );
};

const Dashboard = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <SidebarProvider>
          <DashboardContent />
        </SidebarProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default Dashboard;

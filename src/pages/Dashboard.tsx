
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import FinancialSummary from "@/components/dashboard/FinancialSummary";
import RecentTransactions from "@/components/dashboard/RecentTransactions";
import ExpenseDistribution from "@/components/dashboard/ExpenseDistribution";

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Olá, {user?.user_metadata?.nome || "Usuário"}
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
      </main>
    </div>
  );
};

export default Dashboard;

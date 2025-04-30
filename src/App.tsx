
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { SubscriptionProvider } from "@/contexts/SubscriptionContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { Toaster } from "@/components/ui/toaster";
import ProtectedRoute from "@/components/ProtectedRoute";

// Páginas
import Index from "@/pages/Index";
import Auth from "@/pages/Auth";
import Dashboard from "@/pages/Dashboard";
import TransacoesPage from "@/pages/dashboard/TransacoesPage";
import ExpensesPage from "@/pages/dashboard/ExpensesPage";
import IncomePage from "@/pages/dashboard/IncomePage";
import BudgetsPage from "@/pages/dashboard/BudgetsPage";
import PlanningPage from "@/pages/dashboard/PlanningPage";
import ReportsPage from "@/pages/dashboard/ReportsPage";
import DicasPage from "@/pages/dashboard/DicasPage";
import SettingsPage from "@/pages/dashboard/SettingsPage";
import NotFound from "@/pages/NotFound";
import Resources from "@/pages/Resources";
import PricingPage from "@/pages/Pricing";
import PaymentSuccess from "@/pages/PaymentSuccess";

import "./App.css";

const App: React.FC = () => {
  return (
    <AuthProvider>
      <SubscriptionProvider>
        <ThemeProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/precos" element={<PricingPage />} />
            <Route path="/recursos" element={<Resources />} />
            <Route path="/pagamento-sucesso" element={<ProtectedRoute><PaymentSuccess /></ProtectedRoute>} />
            
            <Route 
              path="/dashboard" 
              element={<ProtectedRoute><Dashboard /></ProtectedRoute>}
            >
              <Route index element={<Navigate to="/dashboard/transacoes" replace />} />
              <Route path="transacoes" element={<TransacoesPage />} />
              <Route path="despesas" element={<ExpensesPage />} />
              <Route path="receitas" element={<IncomePage />} />
              <Route path="orcamentos" element={<BudgetsPage />} />
              <Route path="planejamento" element={<PlanningPage />} />
              <Route path="relatorios" element={<ReportsPage />} />
              <Route path="dicas" element={<DicasPage />} />
              <Route path="configuracoes" element={<SettingsPage />} />
            </Route>
            
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
        </ThemeProvider>
      </SubscriptionProvider>
    </AuthProvider>
  );
};

export default App;


import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Settings, BarChart3, PieChart, CreditCard, LineChart, Receipt, Lightbulb } from "lucide-react";
import { useSidebar } from "@/components/ui/sidebar";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/contexts/SubscriptionContext";

const NavItem = ({ to, icon: Icon, label, isPro, isProFeature }) => {
  const { isMobile, setOpenMobile } = useSidebar();
  const location = useLocation();
  
  // Check if the current route matches exactly with the NavItem's route
  const isExactActive = location.pathname === to;
  
  // Para items que são Pro, mas o usuário não é Pro, mostrar o ProFeature ou não mostrar o item
  if (isProFeature && !isPro) {
    return null;
  }
  
  return (
    <NavLink
      to={to}
      onClick={isMobile ? () => setOpenMobile(false) : undefined}
      className={({ isActive }) => `
        flex items-center gap-4 px-4 py-3 rounded-md text-base transition-colors
        ${isExactActive 
          ? "bg-finance-primary text-white" 
          : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"}
      `}
    >
      <Icon size={20} />
      <span>{label}</span>
      {isProFeature && <span className="text-xs bg-amber-200 text-amber-800 px-1.5 py-0.5 rounded ml-auto">Pro</span>}
    </NavLink>
  );
};

const DashboardSidebar = () => {
  const { user } = useAuth();
  const { isPro } = useSubscription();
  
  // Simplificar o nome para exibição
  const displayName = user?.user_metadata?.nome
    ? user.user_metadata.nome.split(' ')[0]
    : "Usuário";
  
  return (
    <div className="hidden md:flex min-h-screen w-64 border-r border-gray-200 dark:border-gray-800 flex-col transition-all duration-300">
      <div className="p-4 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-finance-primary/20 text-finance-primary font-bold flex items-center justify-center">
            {displayName.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="font-medium text-gray-900 dark:text-gray-100">{displayName}</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">{isPro ? 'Plano Pro' : 'Plano Gratuito'}</p>
          </div>
        </div>
      </div>
      
      <div className="p-4 flex-1">
        <div className="space-y-1">
          <NavItem 
            to="/dashboard" 
            icon={BarChart3} 
            label="Visão Geral" 
            isPro={isPro}
            isProFeature={false}
          />
          <NavItem 
            to="/dashboard/transacoes" 
            icon={Receipt} 
            label="Transações" 
            isPro={isPro}
            isProFeature={false}
          />
          <NavItem 
            to="/dashboard/expenses" 
            icon={CreditCard} 
            label="Despesas" 
            isPro={isPro}
            isProFeature={false}
          />
          <NavItem 
            to="/dashboard/income" 
            icon={BarChart3} 
            label="Receitas" 
            isPro={isPro}
            isProFeature={false}
          />
          <NavItem 
            to="/dashboard/budgets" 
            icon={PieChart} 
            label="Orçamentos" 
            isPro={isPro}
            isProFeature={false}
          />
          <NavItem 
            to="/dashboard/reports" 
            icon={LineChart} 
            label="Relatórios" 
            isPro={isPro}
            isProFeature={false}
          />
          <NavItem 
            to="/dashboard/dicas" 
            icon={Lightbulb} 
            label="Dicas" 
            isPro={isPro}
            isProFeature={false}
          />
          <NavItem 
            to="/dashboard/planning" 
            icon={BarChart3} 
            label="Planejamento" 
            isPro={isPro}
            isProFeature={true}
          />
          <NavItem 
            to="/dashboard/settings" 
            icon={Settings} 
            label="Configurações" 
            isPro={isPro}
            isProFeature={false}
          />
        </div>
      </div>
      
      {!isPro && (
        <div className="p-4 border-t border-gray-200 dark:border-gray-800">
          <div className="bg-finance-light rounded-md p-3">
            <h4 className="font-medium text-sm text-finance-dark">Atualize para o Pro</h4>
            <p className="text-xs text-gray-600 my-1">
              Desbloqueie recursos avançados e mais visualizações.
            </p>
            <NavLink 
              to="/precos"
              className="block text-center text-xs bg-finance-primary text-white rounded py-1.5 mt-2 hover:bg-finance-primary/90"
            >
              Ver planos
            </NavLink>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardSidebar;

import React from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  Sidebar, 
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger 
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { 
  Home, 
  CreditCard, 
  PiggyBank, 
  Wallet, 
  BarChart, 
  BarChart3, 
  Settings, 
  Lightbulb,
  LogOut,
  TrendingUp,
  Crown
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { cn } from "@/lib/utils";
import SubscriptionStatus from "./SubscriptionStatus";

const DashboardSidebar = () => {
  const { signOut, user } = useAuth();
  const location = useLocation();
  const { plan } = useSubscription();
  const isPro = plan === "pro";
  
  const menuItems = [
    { name: "Visão Geral", path: "/dashboard", icon: Home },
    { name: "Transações", path: "/dashboard/transacoes", icon: Wallet },
    { name: "Despesas", path: "/dashboard/despesas", icon: CreditCard },
    { name: "Receitas", path: "/dashboard/receitas", icon: TrendingUp },
    { name: "Orçamentos", path: "/dashboard/orcamentos", icon: PiggyBank },
    { name: "Planejamento", path: "/dashboard/planejamento", icon: BarChart },
    { name: "Relatórios", path: "/dashboard/relatorios", icon: BarChart3 },
    { name: "Dicas", path: "/dashboard/dicas", icon: Lightbulb },
  ];
  
  const handleLogout = async () => {
    await signOut();
  };
  
  return (
    <Sidebar className="border-r border-gray-200 dark:border-gray-800">
      <SidebarHeader className="border-b border-gray-200 dark:border-gray-800 px-6 py-3">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <span className="font-bold text-xl text-finance-primary">Axios</span>
            <span className="font-semibold">Finanças</span>
          </Link>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="px-4 py-6">
        <div className="pb-4">
          <SubscriptionStatus />
        </div>
        
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.path}>
              <SidebarMenuButton asChild>
                <Link
                  to={item.path}
                  className={cn(
                    "flex items-center space-x-2 rounded-md px-3 py-2 text-sm font-medium",
                    location.pathname === item.path
                      ? "bg-finance-light text-finance-primary"
                      : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
          
          <div className="mt-4 border-t border-gray-100 dark:border-gray-800 pt-4">
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link
                  to="/dashboard/assinatura"
                  className={cn(
                    "flex items-center space-x-2 rounded-md px-3 py-2 text-sm font-medium",
                    location.pathname === "/dashboard/assinatura"
                      ? "bg-finance-light text-finance-primary"
                      : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                  )}
                >
                  <Crown className="h-5 w-5" />
                  <span>Minha Assinatura</span>
                  {isPro && (
                    <span className="ml-auto text-xs bg-finance-primary text-white px-1.5 py-0.5 rounded">Pro</span>
                  )}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link
                  to="/dashboard/configuracoes"
                  className={cn(
                    "flex items-center space-x-2 rounded-md px-3 py-2 text-sm font-medium",
                    location.pathname === "/dashboard/configuracoes"
                      ? "bg-finance-light text-finance-primary"
                      : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                  )}
                >
                  <Settings className="h-5 w-5" />
                  <span>Configurações</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </div>
        </SidebarMenu>
      </SidebarContent>
      
      <SidebarFooter className="border-t border-gray-200 dark:border-gray-800 px-6 py-4">
        <Button
          variant="outline"
          className="w-full justify-start text-gray-700 hover:text-red-600"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sair
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
};

export default DashboardSidebar;

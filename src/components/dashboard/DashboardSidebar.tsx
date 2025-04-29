import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { PiggyBank, CreditCard, BarChart2, DollarSign, FileText, Calendar, Settings } from "lucide-react";
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
const DashboardSidebar = () => {
  const {
    signOut
  } = useAuth();
  const location = useLocation();
  const menuItems = [{
    title: "Visão Geral",
    path: "/dashboard",
    icon: BarChart2
  }, {
    title: "Despesas",
    path: "/dashboard/expenses",
    icon: CreditCard
  }, {
    title: "Receitas",
    path: "/dashboard/income",
    icon: DollarSign
  }, {
    title: "Orçamentos",
    path: "/dashboard/budgets",
    icon: PiggyBank
  }, {
    title: "Relatórios",
    path: "/dashboard/reports",
    icon: FileText
  }, {
    title: "Planejamento",
    path: "/dashboard/planning",
    icon: Calendar
  }];
  const isActive = (path: string) => {
    if (path === "/dashboard" && location.pathname === "/dashboard") {
      return true;
    }
    return location.pathname.startsWith(path) && path !== "/dashboard";
  };
  return <Sidebar>
      <SidebarHeader className="pb-0">
        <div className="flex flex-col items-center justify-center pt-6 pb-2">
          <Link to="/dashboard" className="flex items-center">
            <span className="text-2xl font-bold text-finance-primary">Axios</span>
            <span className="text-2xl font-medium ml-1 text-finance-primary">Finanças</span>
          </Link>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Gerenciar</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map(item => <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton asChild isActive={isActive(item.path)} tooltip={item.title}>
                    <Link to={item.path}>
                      <item.icon className="size-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>)}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Configurações</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={location.pathname === "/dashboard/settings"} tooltip="Configurações">
                  <Link to="/dashboard/settings">
                    <Settings className="size-4" />
                    <span>Configurações</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="py-4">
        <div className="flex justify-center">
          <span className="text-xs text-gray-500">Axios Finanças v1.0</span>
        </div>
      </SidebarFooter>
    </Sidebar>;
};
export default DashboardSidebar;

import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useFamilyPlan } from "@/contexts/FamilyPlanContext";
import { Button } from "@/components/ui/button";
import { Sidebar, SidebarSection, SidebarItem } from "@/components/ui/sidebar";
import {
  CreditCard,
  DollarSign,
  BarChart2,
  PieChart,
  Target,
  Settings,
  LogOut,
  Users,
} from "lucide-react";

const DashboardSidebar = () => {
  const { signOut } = useAuth();
  const location = useLocation();
  const { isFamilyPlan } = useFamilyPlan();

  const menuItems = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: <BarChart2 className="h-5 w-5" />,
      exact: true,
    },
    {
      title: "Despesas",
      href: "/dashboard/expenses",
      icon: <CreditCard className="h-5 w-5" />,
      exact: false,
    },
    {
      title: "Receitas",
      href: "/dashboard/income",
      icon: <DollarSign className="h-5 w-5" />,
      exact: false,
    },
    {
      title: "Orçamentos",
      href: "/dashboard/budgets",
      icon: <PieChart className="h-5 w-5" />,
      exact: false,
    },
    {
      title: "Relatórios",
      href: "/dashboard/reports",
      icon: <BarChart2 className="h-5 w-5" />,
      exact: false,
    },
    {
      title: "Planejamento",
      href: "/dashboard/planning",
      icon: <Target className="h-5 w-5" />,
      exact: false,
    },
  ];
  
  if (isFamilyPlan) {
    menuItems.push({
      title: "Plano Familiar",
      href: "/dashboard/family",
      icon: <Users className="h-5 w-5" />,
      exact: false,
    });
  }
  
  menuItems.push({
    title: "Configurações",
    href: "/dashboard/settings",
    icon: <Settings className="h-5 w-5" />,
    exact: false,
  });

  const isActive = (href: string, exact: boolean) => {
    if (exact) {
      return location.pathname === href;
    }
    return location.pathname.startsWith(href);
  };

  return (
    <Sidebar className="border-r border-border">
      <div className="flex flex-col h-full">
        <div className="p-4 border-b">
          <Link to="/" className="flex items-center">
            <span className="text-xl font-bold text-finance-primary">Axios</span>
            <span className="text-xl font-bold ml-1">Finanças</span>
          </Link>
        </div>

        <SidebarSection>
          {menuItems.map((item, index) => (
            <SidebarItem
              key={index}
              icon={item.icon}
              href={item.href}
              active={isActive(item.href, item.exact)}
            >
              {item.title}
            </SidebarItem>
          ))}
        </SidebarSection>

        <div className="mt-auto p-4 border-t">
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() => signOut()}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sair
          </Button>
        </div>
      </div>
    </Sidebar>
  );
};

export default DashboardSidebar;

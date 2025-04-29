
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useFamilyPlan } from "@/contexts/FamilyPlanContext";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
} from "@/components/ui/sidebar";
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
  DrawerClose
} from "@/components/ui/drawer";
import {
  CreditCard,
  DollarSign,
  BarChart2,
  PieChart,
  Target,
  Settings,
  LogOut,
  Users,
  Menu,
  X
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

const DashboardSidebar = () => {
  const { signOut } = useAuth();
  const location = useLocation();
  const { isFamilyPlan } = useFamilyPlan();
  const isMobile = useIsMobile();
  const [drawerOpen, setDrawerOpen] = useState(false);

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

  // Renderiza o botão do menu para mobile e a sidebar para desktop
  if (isMobile) {
    return (
      <>
        <div className="md:hidden fixed top-0 left-0 z-30 p-4">
          <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
            <DrawerTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </DrawerTrigger>
            <DrawerContent className="h-[80vh] p-0">
              <div className="flex flex-col h-full">
                <div className="p-4 border-b flex items-center justify-between">
                  <Link to="/" className="flex items-center" onClick={() => setDrawerOpen(false)}>
                    <span className="text-xl font-bold text-finance-primary">Axios</span>
                    <span className="text-xl font-bold ml-1">Finanças</span>
                  </Link>
                  <DrawerClose asChild>
                    <Button variant="ghost" size="icon">
                      <X className="h-5 w-5" />
                    </Button>
                  </DrawerClose>
                </div>
                
                <div className="flex-1 overflow-auto py-4">
                  <div className="space-y-1 px-2">
                    {menuItems.map((item, index) => (
                      <DrawerClose key={index} asChild>
                        <Link
                          to={item.href}
                          className={`flex items-center gap-3 px-4 py-3 rounded-md text-sm transition-colors
                            ${isActive(item.href, item.exact) 
                              ? "bg-finance-primary text-white" 
                              : "hover:bg-gray-100 dark:hover:bg-gray-800"}`}
                        >
                          {item.icon}
                          <span>{item.title}</span>
                        </Link>
                      </DrawerClose>
                    ))}
                  </div>
                </div>
                
                <div className="p-4 border-t">
                  <Button
                    variant="outline"
                    className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
                    onClick={() => {
                      setDrawerOpen(false);
                      signOut();
                    }}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sair
                  </Button>
                </div>
              </div>
            </DrawerContent>
          </Drawer>
        </div>
      </>
    );
  }

  // Versão desktop da sidebar
  return (
    <Sidebar className="border-r border-border hidden md:block">
      <div className="flex flex-col h-full">
        <div className="p-4 border-b">
          <Link to="/" className="flex items-center">
            <span className="text-xl font-bold text-finance-primary">Axios</span>
            <span className="text-xl font-bold ml-1">Finanças</span>
          </Link>
        </div>

        <SidebarContent>
          <SidebarGroup>
            <SidebarMenu>
              {menuItems.map((item, index) => (
                <SidebarMenuItem key={index}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={isActive(item.href, item.exact)}
                  >
                    <Link to={item.href}>
                      {item.icon}
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>

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

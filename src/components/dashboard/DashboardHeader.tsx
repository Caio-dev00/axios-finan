
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  Bell, 
  User, 
  Settings, 
  LogOut, 
  Check,
  AlertTriangle,
  Info 
} from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ScrollArea } from "@/components/ui/scroll-area";

// Tipo para as notificações
interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success';
  isRead: boolean;
  createdAt: Date;
}

const DashboardHeader = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [notificationCount, setNotificationCount] = useState(0);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSignOut = async () => {
    await signOut();
  };

  // Função para buscar notificações (simulada, pois ainda não temos uma tabela de notificações)
  const fetchNotifications = async () => {
    setIsLoading(true);
    // Em um cenário real, buscaríamos do banco de dados
    // Por enquanto, vamos simular algumas notificações
    try {
      // Simula o tempo de carregamento
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Dados simulados para demonstração
      const mockNotifications: Notification[] = [
        {
          id: "1",
          title: "Alerta de orçamento",
          message: "Você atingiu 80% do seu orçamento para Alimentação este mês.",
          type: "warning",
          isRead: false,
          createdAt: new Date(Date.now() - 3600000) // 1 hora atrás
        },
        {
          id: "2",
          title: "Conta próxima do vencimento",
          message: "Você tem uma conta de Água com vencimento em 3 dias.",
          type: "info",
          isRead: false,
          createdAt: new Date(Date.now() - 86400000) // 1 dia atrás
        },
        {
          id: "3",
          title: "Meta alcançada",
          message: "Parabéns! Você alcançou 100% da sua meta de poupança.",
          type: "success",
          isRead: true,
          createdAt: new Date(Date.now() - 172800000) // 2 dias atrás
        }
      ];
      
      setNotifications(mockNotifications);
      setNotificationCount(mockNotifications.filter(n => !n.isRead).length);
    } catch (error) {
      console.error("Erro ao buscar notificações:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar suas notificações",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Carregar notificações quando o componente montar
  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAsRead = (id: string) => {
    setNotifications(notifications.map(notif => 
      notif.id === id ? { ...notif, isRead: true } : notif
    ));
    
    setNotificationCount(prev => Math.max(0, prev - 1));
    
    toast({
      title: "Notificação marcada como lida",
      description: "Esta notificação foi marcada como lida",
    });
  };

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map(notif => ({ ...notif, isRead: true })));
    setNotificationCount(0);
    
    toast({
      title: "Todas as notificações lidas",
      description: "Todas as notificações foram marcadas como lidas",
    });
  };

  // Função para renderizar o ícone baseado no tipo de notificação
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-amber-500" />;
      case 'success':
        return <Check className="h-4 w-4 text-green-500" />;
      case 'info':
      default:
        return <Info className="h-4 w-4 text-blue-500" />;
    }
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link to="/dashboard" className="flex items-center">
              <span className="text-2xl font-bold text-finance-primary">Axios</span>
              <span className="text-2xl font-medium text-finance-dark ml-1">Finanças</span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  {notificationCount > 0 && (
                    <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-red-600 flex items-center justify-center text-[10px] text-white">
                      {notificationCount > 9 ? '9+' : notificationCount}
                    </span>
                  )}
                  <span className="sr-only">Notificações</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-0">
                <div className="p-4 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium">Notificações</h3>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={handleMarkAllAsRead}
                      disabled={notificationCount === 0}
                      className="text-xs h-7"
                    >
                      Marcar todas como lidas
                    </Button>
                  </div>
                </div>
                <ScrollArea className="h-[300px]">
                  {isLoading ? (
                    <div className="flex justify-center items-center h-[200px]">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
                    </div>
                  ) : notifications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-[200px] text-gray-500">
                      <Bell className="h-12 w-12 mb-2 opacity-20" />
                      <p className="text-sm">Nenhuma notificação</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-100">
                      {notifications.map((notification) => (
                        <div 
                          key={notification.id}
                          className={`p-4 hover:bg-gray-50 transition-colors ${!notification.isRead ? 'bg-blue-50/20' : ''}`}
                        >
                          <div className="flex">
                            <div className="flex-shrink-0 mt-0.5">
                              {getNotificationIcon(notification.type)}
                            </div>
                            <div className="ml-3 flex-1">
                              <div className="flex items-center justify-between">
                                <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                                <span className="text-xs text-gray-500">
                                  {new Date(notification.createdAt).toLocaleDateString('pt-BR', {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </span>
                              </div>
                              <p className="text-sm text-gray-500 mt-1">{notification.message}</p>
                              {!notification.isRead && (
                                <Button 
                                  variant="link" 
                                  size="sm" 
                                  onClick={() => handleMarkAsRead(notification.id)}
                                  className="text-xs p-0 h-auto mt-1"
                                >
                                  Marcar como lida
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </ScrollArea>
                <div className="p-2 border-t border-gray-100">
                  <Button variant="ghost" size="sm" asChild className="text-xs w-full h-7">
                    <Link to="/dashboard/settings?tab=notifications">
                      Configurar notificações
                    </Link>
                  </Button>
                </div>
              </PopoverContent>
            </Popover>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative rounded-full">
                  <User className="h-5 w-5" />
                  <span className="sr-only">Menu do usuário</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Minha conta</DropdownMenuLabel>
                <DropdownMenuItem asChild>
                  <Link to="/dashboard/settings">Perfil</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/dashboard/settings">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Configurações</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sair</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;

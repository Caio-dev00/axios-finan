
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, AlertCircle, Sun, Moon, Monitor } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useSearchParams } from "react-router-dom";

// Profile schema validation
const profileSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório"),
  phone: z.string().optional(),
  occupation: z.string().optional(),
});

// Password schema validation
const passwordSchema = z.object({
  currentPassword: z.string().min(6, "A senha atual deve ter no mínimo 6 caracteres"),
  newPassword: z.string().min(6, "A nova senha deve ter no mínimo 6 caracteres"),
  confirmPassword: z.string().min(6, "Confirme a senha deve ter no mínimo 6 caracteres"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
});

type ProfileFormValues = z.infer<typeof profileSchema>;
type PasswordFormValues = z.infer<typeof passwordSchema>;

// Interface para as preferências de notificação
interface NotificationPreferences {
  id: string;
  user_id: string;
  budget_alerts: boolean;
  bill_reminders: boolean;
  weekly_reports: boolean;
  financial_tips: boolean;
  app_updates: boolean;
}

const SettingsPage = () => {
  const [searchParams] = useSearchParams();
  const defaultTab = searchParams.get("tab") || "profile";
  const { user } = useAuth();
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [profileData, setProfileData] = useState<any>(null);
  const [notificationPreferences, setNotificationPreferences] = useState<NotificationPreferences | null>(null);
  const [savingNotifications, setSavingNotifications] = useState(false);
  const [savingPreferences, setSavingPreferences] = useState(false);
  const [currencyPreference, setCurrencyPreference] = useState("BRL");
  const [dateFormatPreference, setDateFormatPreference] = useState("DD/MM/YYYY");
  const [monthStartDayPreference, setMonthStartDayPreference] = useState("1");
  const [passwordError, setPasswordError] = useState<string | null>(null);
  
  // Initialize form with react-hook-form
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      nome: "",
      phone: "",
      occupation: "",
    },
  });

  // Initialize password form with react-hook-form
  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  // Fetch user profile data when component loads
  useEffect(() => {
    const fetchProfileData = async () => {
      if (user?.id) {
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

          if (error) {
            throw error;
          }

          if (data) {
            setProfileData(data);
            form.reset({
              nome: data.nome || user?.user_metadata?.nome || "",
              phone: data.phone || "",
              occupation: data.occupation || "",
            });
            
            // Carregar preferências gerais - checking if properties exist
            if (data && typeof data === 'object' && 'currency_preference' in data) {
              setCurrencyPreference(String(data.currency_preference || "BRL"));
            }
            
            if (data && typeof data === 'object' && 'date_format_preference' in data) {
              setDateFormatPreference(String(data.date_format_preference || "DD/MM/YYYY"));
            }
            
            if (data && typeof data === 'object' && 'month_start_day' in data) {
              setMonthStartDayPreference(String(data.month_start_day || "1"));
            }
          }
        } catch (error: any) {
          console.error("Erro ao buscar perfil:", error.message);
        }
      }
    };

    fetchProfileData();
  }, [user, form]);

  // Buscar preferências de notificação
  useEffect(() => {
    const fetchNotificationPreferences = async () => {
      if (user?.id) {
        try {
          const { data, error } = await supabase
            .from('notification_preferences')
            .select('*')
            .eq('user_id', user.id)
            .maybeSingle();

          if (error) {
            throw error;
          }

          if (data) {
            setNotificationPreferences(data);
          } else {
            // Se não encontrar, criar um registro com valores padrão
            const { data: newPrefs, error: createError } = await supabase
              .from('notification_preferences')
              .insert([{ user_id: user.id }])
              .select('*')
              .single();

            if (createError) {
              throw createError;
            }

            setNotificationPreferences(newPrefs);
          }
        } catch (error: any) {
          console.error("Erro ao buscar preferências de notificação:", error.message);
          toast({
            title: "Erro",
            description: "Não foi possível carregar suas preferências de notificação",
            variant: "destructive",
          });
        }
      }
    };

    fetchNotificationPreferences();
  }, [user, toast]);

  // Handle form submission
  const onSubmit = async (formData: ProfileFormValues) => {
    setLoading(true);
    try {
      // Update the profiles table
      const { error } = await supabase
        .from('profiles')
        .update({
          nome: formData.nome,
          phone: formData.phone,
          occupation: formData.occupation,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user?.id);

      if (error) throw error;

      toast({
        title: "Perfil atualizado",
        description: "Suas informações foram atualizadas com sucesso",
      });
      
    } catch (error: any) {
      toast({
        title: "Erro ao atualizar perfil",
        description: error.message,
        variant: "destructive",
      });
      console.error("Erro ao atualizar perfil:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle password change submission
  const onPasswordSubmit = async (formData: PasswordFormValues) => {
    setPasswordLoading(true);
    setPasswordError(null);
    
    try {
      // Primeiro, verifica a senha atual tentando fazer login
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user?.email || "",
        password: formData.currentPassword,
      });

      // Se houve erro no login, significa que a senha atual está incorreta
      if (signInError) {
        setPasswordError("Senha atual incorreta");
        throw new Error("Senha atual incorreta");
      }

      // Atualizar a senha
      const { error: updateError } = await supabase.auth.updateUser({
        password: formData.newPassword
      });

      if (updateError) throw updateError;

      toast({
        title: "Senha atualizada",
        description: "Sua senha foi atualizada com sucesso",
      });
      
      // Limpar o formulário
      passwordForm.reset({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      
    } catch (error: any) {
      if (!passwordError) {
        toast({
          title: "Erro ao atualizar senha",
          description: error.message,
          variant: "destructive",
        });
      }
      console.error("Erro ao atualizar senha:", error);
    } finally {
      setPasswordLoading(false);
    }
  };

  // Atualizar preferências de notificação
  const handleToggleNotification = async (field: keyof NotificationPreferences, value: boolean) => {
    if (!user?.id || !notificationPreferences) return;
    
    // Atualizar state localmente para feedback imediato
    setNotificationPreferences(prev => {
      if (!prev) return prev;
      return { ...prev, [field]: value };
    });
    
    try {
      const { error } = await supabase
        .from('notification_preferences')
        .update({ [field]: value, updated_at: new Date().toISOString() })
        .eq('user_id', user.id);
      
      if (error) throw error;
    } catch (error: any) {
      console.error("Erro ao atualizar preferência:", error.message);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar sua preferência",
        variant: "destructive",
      });
      
      // Reverter mudança em caso de erro
      setNotificationPreferences(prev => {
        if (!prev) return prev;
        return { ...prev, [field]: !value };
      });
    }
  };

  // Salvar todas as preferências de notificação
  const saveNotificationPreferences = async () => {
    if (!user?.id || !notificationPreferences) return;
    
    setSavingNotifications(true);
    try {
      const { error } = await supabase
        .from('notification_preferences')
        .update({
          ...notificationPreferences,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      toast({
        title: "Preferências atualizadas",
        description: "Suas preferências de notificações foram atualizadas com sucesso",
      });
    } catch (error: any) {
      console.error("Erro ao salvar preferências:", error.message);
      toast({
        title: "Erro",
        description: "Não foi possível salvar suas preferências",
        variant: "destructive",
      });
    } finally {
      setSavingNotifications(false);
    }
  };

  // Salvar preferências gerais do aplicativo
  const saveAppPreferences = async () => {
    if (!user?.id) return;
    
    setSavingPreferences(true);
    try {
      // Create an update object with only the properties we want to update
      const updateData: Record<string, any> = {};
      
      // Only include properties in the update if they're being used
      updateData.currency_preference = currencyPreference;
      updateData.date_format_preference = dateFormatPreference;
      updateData.month_start_day = monthStartDayPreference;
      updateData.updated_at = new Date().toISOString();
      
      const { error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', user.id);
      
      if (error) throw error;
      
      toast({
        title: "Preferências atualizadas",
        description: "Suas preferências do aplicativo foram atualizadas com sucesso",
      });
    } catch (error: any) {
      console.error("Erro ao salvar preferências gerais:", error.message);
      toast({
        title: "Erro",
        description: "Não foi possível salvar suas preferências",
        variant: "destructive",
      });
    } finally {
      setSavingPreferences(false);
    }
  };

  // Alterar o tema
  const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
    setTheme(newTheme);
    toast({
      title: "Tema alterado",
      description: `O tema foi alterado para ${newTheme === 'light' ? 'claro' : newTheme === 'dark' ? 'escuro' : 'do sistema'}`,
    });
  };

  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold mb-6">Configurações</h1>

      <Tabs defaultValue={defaultTab} className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="profile">Perfil</TabsTrigger>
          <TabsTrigger value="preferences">Preferências</TabsTrigger>
          <TabsTrigger value="notifications">Notificações</TabsTrigger>
          <TabsTrigger value="security">Segurança</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Informações de Perfil</CardTitle>
              <CardDescription>Atualize suas informações pessoais</CardDescription>
            </CardHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="nome"
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <FormLabel>Nome</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Seu nome" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" defaultValue={user?.email || ""} disabled />
                      <p className="text-xs text-gray-500 dark:text-gray-400">O email não pode ser alterado</p>
                    </div>
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel>Telefone</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="(00) 00000-0000" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="occupation"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel>Ocupação</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Sua ocupação" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
                <CardFooter>
                  <Button type="submit" disabled={loading}>
                    {loading ? "Salvando..." : "Salvar Alterações"}
                  </Button>
                </CardFooter>
              </form>
            </Form>
          </Card>
        </TabsContent>
        
        <TabsContent value="preferences">
          <Card>
            <CardHeader>
              <CardTitle>Preferências do Aplicativo</CardTitle>
              <CardDescription>Personalize sua experiência no Axios Finanças</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Moeda Padrão</Label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Moeda usada nos relatórios e visualizações</p>
                </div>
                <div className="w-[180px]">
                  <select 
                    className="w-full p-2 border rounded bg-background dark:bg-gray-800 text-foreground"
                    value={currencyPreference}
                    onChange={(e) => setCurrencyPreference(e.target.value)}
                  >
                    <option value="BRL">Real Brasileiro (R$)</option>
                    <option value="USD">Dólar Americano ($)</option>
                    <option value="EUR">Euro (€)</option>
                  </select>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Formato de Data</Label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Como as datas são exibidas</p>
                </div>
                <div className="w-[180px]">
                  <select 
                    className="w-full p-2 border rounded bg-background dark:bg-gray-800 text-foreground"
                    value={dateFormatPreference}
                    onChange={(e) => setDateFormatPreference(e.target.value)}
                  >
                    <option value="DD/MM/YYYY">DD/MM/AAAA</option>
                    <option value="MM/DD/YYYY">MM/DD/AAAA</option>
                    <option value="YYYY-MM-DD">AAAA-MM-DD</option>
                  </select>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Dia de início do mês</Label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Para cálculo de orçamentos mensais</p>
                </div>
                <div className="w-[180px]">
                  <select 
                    className="w-full p-2 border rounded bg-background dark:bg-gray-800 text-foreground"
                    value={monthStartDayPreference}
                    onChange={(e) => setMonthStartDayPreference(e.target.value)}
                  >
                    <option value="1">Dia 1</option>
                    <option value="5">Dia 5</option>
                    <option value="10">Dia 10</option>
                    <option value="15">Dia 15</option>
                    <option value="20">Dia 20</option>
                    <option value="25">Dia 25</option>
                  </select>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Tema</Label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Aparência do aplicativo</p>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant={theme === 'light' ? "default" : "outline"} 
                    className="flex items-center gap-2"
                    onClick={() => handleThemeChange('light')}
                  >
                    <Sun className="h-4 w-4" />
                    Claro
                  </Button>
                  <Button 
                    variant={theme === 'dark' ? "default" : "outline"} 
                    className="flex items-center gap-2"
                    onClick={() => handleThemeChange('dark')}
                  >
                    <Moon className="h-4 w-4" />
                    Escuro
                  </Button>
                  <Button 
                    variant={theme === 'system' ? "default" : "outline"} 
                    className="flex items-center gap-2"
                    onClick={() => handleThemeChange('system')}
                  >
                    <Monitor className="h-4 w-4" />
                    Sistema
                  </Button>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={saveAppPreferences}
                disabled={savingPreferences}
              >
                {savingPreferences ? "Salvando..." : "Salvar Preferências"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notificações</CardTitle>
              <CardDescription>Configure quais notificações deseja receber</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {!notificationPreferences ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Alertas de orçamento</Label>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Notificações quando você ultrapassar 75% do orçamento</p>
                    </div>
                    <Switch 
                      checked={notificationPreferences.budget_alerts}
                      onCheckedChange={(checked) => handleToggleNotification('budget_alerts', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Lembretes de contas</Label>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Lembretes para contas próximas do vencimento</p>
                    </div>
                    <Switch 
                      checked={notificationPreferences.bill_reminders}
                      onCheckedChange={(checked) => handleToggleNotification('bill_reminders', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Relatórios semanais</Label>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Resumo semanal das suas finanças por email</p>
                    </div>
                    <Switch 
                      checked={notificationPreferences.weekly_reports}
                      onCheckedChange={(checked) => handleToggleNotification('weekly_reports', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Dicas financeiras</Label>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Receba dicas para melhorar suas finanças</p>
                    </div>
                    <Switch 
                      checked={notificationPreferences.financial_tips}
                      onCheckedChange={(checked) => handleToggleNotification('financial_tips', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Novidades e atualizações</Label>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Notificações sobre novos recursos do aplicativo</p>
                    </div>
                    <Switch 
                      checked={notificationPreferences.app_updates}
                      onCheckedChange={(checked) => handleToggleNotification('app_updates', checked)}
                    />
                  </div>
                </>
              )}
            </CardContent>
            <CardFooter>
              <Button 
                onClick={saveNotificationPreferences} 
                disabled={savingNotifications || !notificationPreferences}
              >
                {savingNotifications ? "Salvando..." : "Salvar Configurações"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Segurança da Conta</CardTitle>
              <CardDescription>Gerencie a segurança da sua conta</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-medium">Alterar Senha</h3>
                
                {passwordError && (
                  <Alert variant="destructive" className="mb-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{passwordError}</AlertDescription>
                  </Alert>
                )}
                
                <Form {...passwordForm}>
                  <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
                    <FormField
                      control={passwordForm.control}
                      name="currentPassword"
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <FormLabel>Senha Atual</FormLabel>
                          <FormControl>
                            <Input id="current-password" type="password" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={passwordForm.control}
                      name="newPassword"
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <FormLabel>Nova Senha</FormLabel>
                          <FormControl>
                            <Input id="new-password" type="password" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={passwordForm.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <FormLabel>Confirmar Nova Senha</FormLabel>
                          <FormControl>
                            <Input id="confirm-password" type="password" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button type="submit" disabled={passwordLoading}>
                      {passwordLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Atualizando...
                        </>
                      ) : (
                        "Atualizar Senha"
                      )}
                    </Button>
                  </form>
                </Form>
              </div>
              
              {/* Removidas as seções de autenticação de dois fatores e dispositivos conectados */}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsPage;

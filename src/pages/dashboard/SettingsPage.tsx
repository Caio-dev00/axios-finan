
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { updateProfile, getProfile } from '@/services/profileService';
import { NotificationPreferences, getUserNotificationPreferences, updateUserNotificationPreferences } from '@/services/notificationService';
import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";

const SettingsPage = () => {
  const { toast } = useToast();
  const { user } = useAuth();

  // Perfil de usuário
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [occupation, setOccupation] = useState('');
  const [loading, setLoading] = useState(false);

  // Preferências de notificações
  const [billReminders, setBillReminders] = useState(true);
  const [budgetAlerts, setBudgetAlerts] = useState(true);
  const [weeklyReports, setWeeklyReports] = useState(false);
  const [financialTips, setFinancialTips] = useState(true);
  const [appUpdates, setAppUpdates] = useState(true);

  // Preferências de visualização
  const [currency, setCurrency] = useState('BRL');
  const [theme, setTheme] = useState('light');
  const [dateFormat, setDateFormat] = useState('DD/MM/YYYY');
  const [monthStartDay, setMonthStartDay] = useState('1');

  // Carregar perfil do usuário
  useEffect(() => {
    if (user) {
      setName(user.user_metadata?.nome || '');
      setEmail(user.email || '');
      
      // Carregar dados adicionais do perfil
      const fetchProfileData = async () => {
        try {
          const profiles = await getProfile();
          
          if (profiles) {
            setPhone(profiles.phone || '');
            setOccupation(profiles.occupation || '');
            setTheme(profiles.theme_preference || 'light');
            setCurrency(profiles.currency_preference || 'BRL');
            setDateFormat(profiles.date_format_preference || 'DD/MM/YYYY');
            setMonthStartDay(profiles.month_start_day || '1');
          }
        } catch (error) {
          console.error('Erro ao carregar perfil:', error);
        }
      };
      
      fetchProfileData();
    }
  }, [user]);

  // Carregar preferências de notificações
  const { data: notificationPrefs } = useQuery({
    queryKey: ['notificationPreferences', user?.id],
    queryFn: getUserNotificationPreferences,
    enabled: !!user,
    onSuccess: (data) => {
      if (data) {
        setBillReminders(data.bill_reminders);
        setBudgetAlerts(data.budget_alerts);
        setWeeklyReports(data.weekly_reports);
        setFinancialTips(data.financial_tips);
        setAppUpdates(data.app_updates);
      }
    }
  });

  // Salvar perfil
  const handleSaveProfile = async () => {
    try {
      setLoading(true);
      await updateProfile({
        name,
        phone,
        occupation,
      });
      toast({
        title: 'Perfil atualizado',
        description: 'Suas informações foram atualizadas com sucesso.',
      });
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível atualizar seu perfil.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Salvar preferências de notificação
  const handleSaveNotifications = async () => {
    try {
      setLoading(true);
      await updateUserNotificationPreferences({
        bill_reminders: billReminders,
        budget_alerts: budgetAlerts,
        weekly_reports: weeklyReports,
        financial_tips: financialTips,
        app_updates: appUpdates
      });
      toast({
        title: 'Preferências atualizadas',
        description: 'Suas preferências de notificação foram atualizadas com sucesso.',
      });
    } catch (error) {
      console.error('Erro ao atualizar preferências de notificação:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível atualizar suas preferências de notificação.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Salvar preferências de visualização
  const handleSaveDisplayPreferences = async () => {
    try {
      setLoading(true);
      await updateProfile({
        theme_preference: theme,
        currency_preference: currency,
        date_format_preference: dateFormat,
        month_start_day: monthStartDay,
      });
      toast({
        title: 'Preferências atualizadas',
        description: 'Suas preferências de visualização foram atualizadas com sucesso.',
      });
    } catch (error) {
      console.error('Erro ao atualizar preferências de visualização:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível atualizar suas preferências de visualização.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Configurações</h1>
      
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid grid-cols-3 mb-8">
          <TabsTrigger value="profile">Perfil</TabsTrigger>
          <TabsTrigger value="notifications">Notificações</TabsTrigger>
          <TabsTrigger value="display">Visualização</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Informações Pessoais</CardTitle>
              <CardDescription>
                Atualize suas informações pessoais e de contato.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome</Label>
                  <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" value={email} disabled />
                  <p className="text-sm text-muted-foreground">O email não pode ser alterado.</p>
                </div>
              </div>
              
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone</Label>
                  <Input 
                    id="phone" 
                    value={phone} 
                    onChange={(e) => setPhone(e.target.value)} 
                    placeholder="(00) 00000-0000"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="occupation">Profissão</Label>
                  <Input 
                    id="occupation" 
                    value={occupation} 
                    onChange={(e) => setOccupation(e.target.value)}
                    placeholder="Sua profissão"
                  />
                </div>
              </div>
              
              <Button 
                onClick={handleSaveProfile} 
                disabled={loading}
                className="mt-4"
              >
                {loading ? "Salvando..." : "Salvar alterações"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Preferências de Notificações</CardTitle>
              <CardDescription>
                Configure quais notificações deseja receber.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="bill-reminders" className="font-medium">Lembretes de contas</Label>
                    <p className="text-sm text-muted-foreground">
                      Receba lembretes sobre contas próximas do vencimento.
                    </p>
                  </div>
                  <Switch 
                    id="bill-reminders" 
                    checked={billReminders} 
                    onCheckedChange={setBillReminders}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="budget-alerts" className="font-medium">Alertas de orçamento</Label>
                    <p className="text-sm text-muted-foreground">
                      Receba alertas quando ultrapassar limites de orçamento.
                    </p>
                  </div>
                  <Switch 
                    id="budget-alerts" 
                    checked={budgetAlerts} 
                    onCheckedChange={setBudgetAlerts}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="weekly-reports" className="font-medium">Relatórios semanais</Label>
                    <p className="text-sm text-muted-foreground">
                      Receba relatórios semanais sobre sua atividade financeira.
                    </p>
                  </div>
                  <Switch 
                    id="weekly-reports" 
                    checked={weeklyReports} 
                    onCheckedChange={setWeeklyReports}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="financial-tips" className="font-medium">Dicas financeiras</Label>
                    <p className="text-sm text-muted-foreground">
                      Receba dicas personalizadas para melhorar sua saúde financeira.
                    </p>
                  </div>
                  <Switch 
                    id="financial-tips" 
                    checked={financialTips} 
                    onCheckedChange={setFinancialTips}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="app-updates" className="font-medium">Atualizações do aplicativo</Label>
                    <p className="text-sm text-muted-foreground">
                      Seja notificado sobre novas funcionalidades e melhorias.
                    </p>
                  </div>
                  <Switch 
                    id="app-updates" 
                    checked={appUpdates} 
                    onCheckedChange={setAppUpdates}
                  />
                </div>
              </div>
              
              <Button 
                onClick={handleSaveNotifications} 
                disabled={loading}
                className="mt-4"
              >
                {loading ? "Salvando..." : "Salvar preferências"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="display">
          <Card>
            <CardHeader>
              <CardTitle>Preferências de Visualização</CardTitle>
              <CardDescription>
                Personalize como as informações são exibidas no aplicativo.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="currency">Moeda</Label>
                  <Select value={currency} onValueChange={setCurrency}>
                    <SelectTrigger id="currency">
                      <SelectValue placeholder="Selecione uma moeda" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="BRL">Real (R$)</SelectItem>
                      <SelectItem value="USD">Dólar ($)</SelectItem>
                      <SelectItem value="EUR">Euro (€)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="theme">Tema</Label>
                  <Select value={theme} onValueChange={setTheme}>
                    <SelectTrigger id="theme">
                      <SelectValue placeholder="Selecione um tema" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Claro</SelectItem>
                      <SelectItem value="dark">Escuro</SelectItem>
                      <SelectItem value="system">Sistema</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="date-format">Formato de data</Label>
                  <Select value={dateFormat} onValueChange={setDateFormat}>
                    <SelectTrigger id="date-format">
                      <SelectValue placeholder="Selecione um formato" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DD/MM/YYYY">DD/MM/AAAA</SelectItem>
                      <SelectItem value="MM/DD/YYYY">MM/DD/AAAA</SelectItem>
                      <SelectItem value="YYYY-MM-DD">AAAA-MM-DD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="month-start">Início do mês</Label>
                  <Select value={monthStartDay} onValueChange={setMonthStartDay}>
                    <SelectTrigger id="month-start">
                      <SelectValue placeholder="Selecione um dia" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Dia 1</SelectItem>
                      <SelectItem value="5">Dia 5</SelectItem>
                      <SelectItem value="10">Dia 10</SelectItem>
                      <SelectItem value="15">Dia 15</SelectItem>
                      <SelectItem value="20">Dia 20</SelectItem>
                      <SelectItem value="25">Dia 25</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground">Para cálculo de ciclos financeiros mensais.</p>
                </div>
              </div>
              
              <Button 
                onClick={handleSaveDisplayPreferences} 
                disabled={loading}
                className="mt-4"
              >
                {loading ? "Salvando..." : "Salvar preferências"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsPage;

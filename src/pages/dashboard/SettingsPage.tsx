
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/contexts/AuthContext";

const SettingsPage = () => {
  const { user } = useAuth();

  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold mb-6">Configurações</h1>

      <Tabs defaultValue="profile" className="w-full">
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
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome</Label>
                  <Input id="name" placeholder="Seu nome" defaultValue={user?.user_metadata?.nome || ""} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" defaultValue={user?.email || ""} disabled />
                  <p className="text-xs text-gray-500">O email não pode ser alterado</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Telefone</Label>
                <Input id="phone" placeholder="(00) 00000-0000" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="occupation">Ocupação</Label>
                <Input id="occupation" placeholder="Sua ocupação" />
              </div>
            </CardContent>
            <CardFooter>
              <Button>Salvar Alterações</Button>
            </CardFooter>
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
                  <p className="text-sm text-gray-500">Moeda usada nos relatórios e visualizações</p>
                </div>
                <div className="w-[180px]">
                  <select className="w-full p-2 border rounded">
                    <option value="BRL">Real Brasileiro (R$)</option>
                    <option value="USD">Dólar Americano ($)</option>
                    <option value="EUR">Euro (€)</option>
                  </select>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Formato de Data</Label>
                  <p className="text-sm text-gray-500">Como as datas são exibidas</p>
                </div>
                <div className="w-[180px]">
                  <select className="w-full p-2 border rounded">
                    <option value="DD/MM/YYYY">DD/MM/AAAA</option>
                    <option value="MM/DD/YYYY">MM/DD/AAAA</option>
                    <option value="YYYY-MM-DD">AAAA-MM-DD</option>
                  </select>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Dia de início do mês</Label>
                  <p className="text-sm text-gray-500">Para cálculo de orçamentos mensais</p>
                </div>
                <div className="w-[180px]">
                  <select className="w-full p-2 border rounded">
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
                  <p className="text-sm text-gray-500">Aparência do aplicativo</p>
                </div>
                <div className="w-[180px]">
                  <select className="w-full p-2 border rounded">
                    <option value="light">Claro</option>
                    <option value="dark">Escuro</option>
                    <option value="system">Sistema</option>
                  </select>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button>Salvar Preferências</Button>
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
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Alertas de orçamento</Label>
                  <p className="text-sm text-gray-500">Notificações quando você ultrapassar 75% do orçamento</p>
                </div>
                <Switch defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Lembretes de contas</Label>
                  <p className="text-sm text-gray-500">Lembretes para contas próximas do vencimento</p>
                </div>
                <Switch defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Relatórios semanais</Label>
                  <p className="text-sm text-gray-500">Resumo semanal das suas finanças por email</p>
                </div>
                <Switch />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Dicas financeiras</Label>
                  <p className="text-sm text-gray-500">Receba dicas para melhorar suas finanças</p>
                </div>
                <Switch defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Novidades e atualizações</Label>
                  <p className="text-sm text-gray-500">Notificações sobre novos recursos do aplicativo</p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
            <CardFooter>
              <Button>Salvar Configurações</Button>
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
                <div className="space-y-2">
                  <Label htmlFor="current-password">Senha Atual</Label>
                  <Input id="current-password" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-password">Nova Senha</Label>
                  <Input id="new-password" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirmar Nova Senha</Label>
                  <Input id="confirm-password" type="password" />
                </div>
                <Button>Atualizar Senha</Button>
              </div>
              
              <div className="border-t pt-6 space-y-4">
                <h3 className="font-medium">Autenticação de Dois Fatores</h3>
                <p className="text-sm text-gray-500">
                  A autenticação de dois fatores adiciona uma camada extra de segurança à sua conta.
                </p>
                <Button variant="outline">Configurar Autenticação de Dois Fatores</Button>
              </div>
              
              <div className="border-t pt-6 space-y-4">
                <h3 className="font-medium">Dispositivos Conectados</h3>
                <p className="text-sm text-gray-500">
                  Dispositivos que atualmente têm acesso à sua conta.
                </p>
                <div className="space-y-2">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                    <div>
                      <p className="font-medium">Chrome - Windows</p>
                      <p className="text-xs text-gray-500">Último acesso: hoje às 14:23</p>
                    </div>
                    <Button variant="ghost" size="sm">Desconectar</Button>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                    <div>
                      <p className="font-medium">Safari - iPhone</p>
                      <p className="text-xs text-gray-500">Último acesso: ontem às 19:45</p>
                    </div>
                    <Button variant="ghost" size="sm">Desconectar</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsPage;

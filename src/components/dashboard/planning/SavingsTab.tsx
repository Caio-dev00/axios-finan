
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getSavingsData, updateSavingsData, Savings } from "@/services/savingsService";
import { Loader2, PencilIcon, CheckIcon, XIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const SavingsTab = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [savingsForm, setSavingsForm] = useState<Savings>({
    balance: 0,
    monthly_saved: 0,
    monthly_returns: 0,
    savings_rate: 0
  });

  const { data: savingsData, isLoading } = useQuery({
    queryKey: ["savings"],
    queryFn: getSavingsData,
    onSettled: (data) => {
      if (data) {
        setSavingsForm({
          balance: data.balance,
          monthly_saved: data.monthly_saved,
          monthly_returns: data.monthly_returns,
          savings_rate: data.savings_rate
        });
      }
    }
  });

  const updateMutation = useMutation({
    mutationFn: updateSavingsData,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["savings"] });
      setIsEditing(false);
      toast({
        title: "Dados atualizados",
        description: "Suas informações de poupança foram atualizadas com sucesso.",
      });
    },
    onError: (error) => {
      console.error("Erro ao atualizar dados de poupança:", error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar os dados de poupança.",
        variant: "destructive",
      });
    }
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSavingsForm({
      ...savingsForm,
      [name]: parseFloat(value)
    });
  };

  const handleSaveClick = () => {
    updateMutation.mutate(savingsForm);
  };

  const handleCancelClick = () => {
    if (savingsData) {
      setSavingsForm({
        balance: savingsData.balance,
        monthly_saved: savingsData.monthly_saved,
        monthly_returns: savingsData.monthly_returns,
        savings_rate: savingsData.savings_rate
      });
    }
    setIsEditing(false);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-10">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Resumo de Poupança</CardTitle>
            <CardDescription>Visão geral das suas economias</CardDescription>
          </div>
          {!isEditing ? (
            <Button variant="ghost" size="icon" onClick={() => setIsEditing(true)}>
              <PencilIcon className="h-4 w-4" />
            </Button>
          ) : null}
        </CardHeader>
        <CardContent>
          {!isEditing ? (
            <div className="space-y-4">
              <div className="flex justify-between">
                <span>Saldo total poupança:</span>
                <span className="font-bold">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(savingsForm.balance)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Economizado este mês:</span>
                <span className="font-bold text-green-600">
                  + {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(savingsForm.monthly_saved)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Rendimentos este mês:</span>
                <span className="font-bold text-green-600">
                  + {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(savingsForm.monthly_returns)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Taxa de economia mensal:</span>
                <span className="font-bold">{savingsForm.savings_rate}% da renda</span>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <Label htmlFor="balance">Saldo total poupança (R$)</Label>
                <Input 
                  id="balance" 
                  name="balance" 
                  type="number" 
                  value={savingsForm.balance} 
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="monthly_saved">Economizado este mês (R$)</Label>
                <Input 
                  id="monthly_saved" 
                  name="monthly_saved" 
                  type="number" 
                  value={savingsForm.monthly_saved} 
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="monthly_returns">Rendimentos este mês (R$)</Label>
                <Input 
                  id="monthly_returns" 
                  name="monthly_returns" 
                  type="number" 
                  value={savingsForm.monthly_returns} 
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="savings_rate">Taxa de economia mensal (%)</Label>
                <Input 
                  id="savings_rate" 
                  name="savings_rate" 
                  type="number" 
                  value={savingsForm.savings_rate} 
                  onChange={handleInputChange}
                />
              </div>
            </div>
          )}
        </CardContent>
        {isEditing && (
          <CardFooter className="flex justify-end gap-2">
            <Button variant="outline" onClick={handleCancelClick} disabled={updateMutation.isPending}>
              <XIcon className="h-4 w-4 mr-2" />
              Cancelar
            </Button>
            <Button onClick={handleSaveClick} disabled={updateMutation.isPending}>
              {updateMutation.isPending ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <CheckIcon className="h-4 w-4 mr-2" />
              )}
              Salvar
            </Button>
          </CardFooter>
        )}
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Dicas de Poupança</CardTitle>
          <CardDescription>Estratégias para melhorar suas economias</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 list-disc pl-5">
            <li>Economize automaticamente 10-20% da sua renda mensal</li>
            <li>Mantenha um fundo de emergência de 3-6 meses de despesas</li>
            <li>Considere investimentos de renda fixa para preservar capital</li>
            <li>Revise despesas recorrentes e elimine gastos desnecessários</li>
            <li>Use a regra 50/30/20: 50% para necessidades, 30% para desejos, 20% para poupança</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default SavingsTab;

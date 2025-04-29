import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import InvestmentDistributionItem from "./InvestmentDistributionItem";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  getInvestments, 
  getInvestmentTotalAndReturns,
  updateInvestmentPerformance,
  addInvestment,
  deleteInvestment,
  Investment, 
  InvestmentPerformance 
} from "@/services/investmentService";
import { Loader2, PencilIcon, CheckIcon, XIcon, Plus, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const InvestmentsTab = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [investmentToDelete, setInvestmentToDelete] = useState<string | null>(null);
  
  const [performanceForm, setPerformanceForm] = useState<Omit<InvestmentPerformance, "id" | "user_id" | "created_at" | "updated_at">>({
    monthly_return_percentage: 0,
    monthly_return_amount: 0,
    yearly_return_percentage: 0,
    yearly_return_amount: 0,
    total_invested: 0
  });
  
  const [newInvestment, setNewInvestment] = useState<Partial<Investment>>({
    category: "",
    amount: 0,
    percentage: 0,
    color: "bg-blue-600"
  });
  
  const { data: investments = [], isLoading: investmentsLoading } = useQuery({
    queryKey: ["investments"],
    queryFn: getInvestments
  });
  
  const { data: performance, isLoading: performanceLoading } = useQuery({
    queryKey: ["investment-performance"],
    queryFn: getInvestmentTotalAndReturns,
    onSuccess: (data) => {
      if (data) {
        setPerformanceForm({
          monthly_return_percentage: data.monthly_return_percentage,
          monthly_return_amount: data.monthly_return_amount,
          yearly_return_percentage: data.yearly_return_percentage,
          yearly_return_amount: data.yearly_return_amount,
          total_invested: data.total_invested
        });
      }
    }
  });
  
  // Calculate total investment
  const totalInvestment = investments.reduce((sum, inv) => sum + parseFloat(String(inv.amount)), 0);
  
  const updatePerformanceMutation = useMutation({
    mutationFn: (data: Omit<InvestmentPerformance, "id" | "user_id" | "created_at" | "updated_at">) => updateInvestmentPerformance({
      ...data,
      total_invested: totalInvestment
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["investment-performance"] });
      setIsEditing(false);
      toast({
        title: "Dados atualizados",
        description: "Seus dados de rendimento foram atualizados com sucesso.",
      });
    },
    onError: (error) => {
      console.error("Erro ao atualizar rendimentos:", error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar os dados de rendimento.",
        variant: "destructive",
      });
    }
  });
  
  const addInvestmentMutation = useMutation({
    mutationFn: () => addInvestment(newInvestment as Required<Pick<Investment, "category" | "amount" | "percentage" | "color">>),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["investments"] });
      setIsAddDialogOpen(false);
      setNewInvestment({
        category: "",
        amount: 0,
        percentage: 0,
        color: "bg-blue-600"
      });
      toast({
        title: "Investimento adicionado",
        description: "Seu novo investimento foi adicionado com sucesso.",
      });
    },
    onError: (error) => {
      console.error("Erro ao adicionar investimento:", error);
      toast({
        title: "Erro",
        description: "Não foi possível adicionar o investimento.",
        variant: "destructive",
      });
    }
  });
  
  const deleteInvestmentMutation = useMutation({
    mutationFn: (id: string) => deleteInvestment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["investments"] });
      toast({
        title: "Investimento excluído",
        description: "O investimento foi removido com sucesso.",
      });
    },
    onError: (error) => {
      console.error("Erro ao excluir investimento:", error);
      toast({
        title: "Erro",
        description: "Não foi possível excluir o investimento.",
        variant: "destructive",
      });
    }
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPerformanceForm({
      ...performanceForm,
      [name]: parseFloat(value)
    });
  };
  
  const handleNewInvestmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewInvestment({
      ...newInvestment,
      [name]: name === "category" ? value : parseFloat(value)
    });
  };
  
  const handleSaveClick = () => {
    updatePerformanceMutation.mutate(performanceForm);
  };
  
  const handleCancelClick = () => {
    if (performance) {
      setPerformanceForm({
        monthly_return_percentage: performance.monthly_return_percentage,
        monthly_return_amount: performance.monthly_return_amount,
        yearly_return_percentage: performance.yearly_return_percentage,
        yearly_return_amount: performance.yearly_return_amount,
        total_invested: performance.total_invested
      });
    }
    setIsEditing(false);
  };
  
  const handleAddInvestment = () => {
    addInvestmentMutation.mutate();
  };
  
  const handleDeleteInvestment = (id: string) => {
    deleteInvestmentMutation.mutate(id);
    setInvestmentToDelete(null);
  };
  
  const getRandomColor = () => {
    const colors = [
      "bg-blue-600",
      "bg-green-600",
      "bg-yellow-600",
      "bg-purple-600",
      "bg-red-600",
      "bg-indigo-600",
      "bg-pink-600",
      "bg-teal-600"
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };
  
  if (investmentsLoading || performanceLoading) {
    return (
      <div className="flex justify-center py-10">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Carteira de Investimentos</CardTitle>
            <CardDescription>Distribuição atual dos seus investimentos</CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-1" />
                  Adicionar
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Adicionar Investimento</DialogTitle>
                  <DialogDescription>
                    Preencha os dados do seu novo investimento
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div>
                    <Label htmlFor="category">Categoria</Label>
                    <Input 
                      id="category" 
                      name="category" 
                      value={newInvestment.category} 
                      onChange={handleNewInvestmentChange} 
                      placeholder="Renda Fixa, Ações, etc." 
                    />
                  </div>
                  <div>
                    <Label htmlFor="amount">Valor Investido (R$)</Label>
                    <Input 
                      id="amount" 
                      name="amount" 
                      type="number" 
                      value={newInvestment.amount} 
                      onChange={handleNewInvestmentChange} 
                    />
                  </div>
                  <div>
                    <Label htmlFor="percentage">Porcentagem da Carteira (%)</Label>
                    <Input 
                      id="percentage" 
                      name="percentage" 
                      type="number" 
                      value={newInvestment.percentage} 
                      onChange={handleNewInvestmentChange} 
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleAddInvestment} disabled={addInvestmentMutation.isPending}>
                    {addInvestmentMutation.isPending ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : null}
                    Adicionar
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Valor total investido</h3>
              <p className="text-xl font-bold">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalInvestment)}
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium">Distribuição por classe de ativo</h3>
                {!isEditing && (
                  <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)}>
                    <PencilIcon className="h-4 w-4" />
                  </Button>
                )}
              </div>
              {investments.length > 0 ? (
                <div className="space-y-4">
                  {investments.map((investment) => (
                    <div key={investment.id} className="relative">
                      {investmentToDelete === investment.id ? (
                        <AlertDialog open={true} onOpenChange={() => setInvestmentToDelete(null)}>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Excluir investimento</AlertDialogTitle>
                              <AlertDialogDescription>
                                Tem certeza que deseja excluir este investimento? Esta ação não pode ser desfeita.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction 
                                onClick={() => handleDeleteInvestment(investment.id as string)} 
                                className="bg-red-600 text-white hover:bg-red-700"
                              >
                                Excluir
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      ) : null}
                      <div className="absolute right-0 top-0 z-10">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-gray-500 hover:text-red-600"
                          onClick={() => setInvestmentToDelete(investment.id as string)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <InvestmentDistributionItem
                        label={investment.category}
                        percentage={investment.percentage}
                        amount={investment.amount}
                        color={investment.color}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">Nenhum investimento encontrado</p>
                  <p className="text-sm text-gray-400 mt-1">
                    Adicione investimentos para visualizar sua distribuição
                  </p>
                </div>
              )}
            </div>

            <div className="pt-4 border-t">
              {!isEditing ? (
                <>
                  <h3 className="text-sm font-medium mb-2">Rendimento da carteira</h3>
                  <div className="flex justify-between">
                    <span>Este mês:</span>
                    <span className="font-medium text-green-600">
                      +{performanceForm.monthly_return_percentage}% 
                      ({new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(performanceForm.monthly_return_amount)})
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Últimos 12 meses:</span>
                    <span className="font-medium text-green-600">
                      +{performanceForm.yearly_return_percentage}% 
                      ({new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(performanceForm.yearly_return_amount)})
                    </span>
                  </div>
                </>
              ) : (
                <>
                  <h3 className="text-sm font-medium mb-2">Editar rendimentos da carteira</h3>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <Label htmlFor="monthly_return_percentage">Retorno mensal (%)</Label>
                      <Input 
                        id="monthly_return_percentage" 
                        name="monthly_return_percentage" 
                        type="number" 
                        step="0.1"
                        value={performanceForm.monthly_return_percentage} 
                        onChange={handleInputChange} 
                      />
                    </div>
                    <div>
                      <Label htmlFor="monthly_return_amount">Valor mensal (R$)</Label>
                      <Input 
                        id="monthly_return_amount" 
                        name="monthly_return_amount" 
                        type="number" 
                        step="0.01"
                        value={performanceForm.monthly_return_amount} 
                        onChange={handleInputChange} 
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="yearly_return_percentage">Retorno anual (%)</Label>
                      <Input 
                        id="yearly_return_percentage" 
                        name="yearly_return_percentage" 
                        type="number" 
                        step="0.1"
                        value={performanceForm.yearly_return_percentage} 
                        onChange={handleInputChange} 
                      />
                    </div>
                    <div>
                      <Label htmlFor="yearly_return_amount">Valor anual (R$)</Label>
                      <Input 
                        id="yearly_return_amount" 
                        name="yearly_return_amount" 
                        type="number" 
                        step="0.01"
                        value={performanceForm.yearly_return_amount} 
                        onChange={handleInputChange} 
                      />
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </CardContent>
        {isEditing && (
          <CardFooter className="flex justify-end gap-2">
            <Button variant="outline" onClick={handleCancelClick} disabled={updatePerformanceMutation.isPending}>
              <XIcon className="h-4 w-4 mr-2" />
              Cancelar
            </Button>
            <Button onClick={handleSaveClick} disabled={updatePerformanceMutation.isPending}>
              {updatePerformanceMutation.isPending ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <CheckIcon className="h-4 w-4 mr-2" />
              )}
              Salvar
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
};

export default InvestmentsTab;

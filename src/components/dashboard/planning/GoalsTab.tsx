import React from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Loader2, Trash2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getGoals, deleteGoal } from "@/services/goalService";
import { Button } from "@/components/ui/button";
import GoalItem from "./GoalItem";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
const GoalsTab = () => {
  const {
    toast
  } = useToast();
  const queryClient = useQueryClient();
  const {
    data: goals,
    isLoading
  } = useQuery({
    queryKey: ["goals"],
    queryFn: getGoals
  });
  const deleteGoalMutation = useMutation({
    mutationFn: deleteGoal,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["goals"]
      });
      toast({
        title: "Meta excluída",
        description: "A meta foi excluída com sucesso."
      });
    },
    onError: error => {
      toast({
        title: "Erro",
        description: "Não foi possível excluir a meta. Tente novamente.",
        variant: "destructive"
      });
      console.error("Erro ao excluir meta:", error);
    }
  });
  const handleDeleteGoal = (id: string) => {
    deleteGoalMutation.mutate(id);
  };

  // Calcular estatísticas
  const totalGoals = goals?.length || 0;
  const completedGoals = goals?.filter(goal => goal.percentage >= 100).length || 0;
  const activeGoals = totalGoals - completedGoals;
  return <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="py-4">
            <CardTitle className="text-base font-medium">Total de Metas</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-2xl font-bold">{totalGoals}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="py-4">
            <CardTitle className="text-base font-medium">Metas Ativas</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-2xl font-bold">{activeGoals}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="py-4">
            <CardTitle className="text-base font-medium">Metas Concluídas</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-2xl font-bold">{completedGoals}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Suas Metas Financeiras</CardTitle>
          <CardDescription>Acompanhe o progresso de cada meta</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? <div className="flex justify-center items-center py-8">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div> : goals && goals.length > 0 ? <div className="space-y-8">
              {goals.map(goal => <div key={goal.id} className="relative">
                  <div className="absolute right-0 top-0 z-10">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="sm" className="text-gray-500 hover:text-red-600 my-[3px]">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Excluir meta</AlertDialogTitle>
                          <AlertDialogDescription>
                            Tem certeza que deseja excluir a meta "{goal.title}"? Esta ação não pode ser desfeita.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction className="bg-red-600 text-white hover:bg-red-700" onClick={() => handleDeleteGoal(goal.id)}>
                            Excluir
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                  <GoalItem goal={goal} />
                </div>)}
            </div> : <div className="text-center py-8">
              <p className="text-gray-500">Nenhuma meta encontrada</p>
              <p className="text-sm text-gray-400 mt-1">
                Adicione metas financeiras para acompanhar seu progresso
              </p>
            </div>}
        </CardContent>
      </Card>
    </div>;
};
export default GoalsTab;
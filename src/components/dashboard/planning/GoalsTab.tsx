
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getGoals } from "@/services/goalService";
import GoalItem from "./GoalItem";
import AddGoalDialog from "../AddGoalDialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const GoalsTab = () => {
  const { data: goals, isLoading } = useQuery({
    queryKey: ["goals"],
    queryFn: getGoals
  });
  
  return (
    <div className="grid grid-cols-1 gap-6">
      <Card>
        <CardHeader className="flex flex-row justify-between items-center">
          <div>
            <CardTitle>Suas Metas Financeiras</CardTitle>
            <CardDescription>Acompanhe e gerencie suas metas financeiras</CardDescription>
          </div>
          <AddGoalDialog 
            trigger={
              <Button size="sm" className="flex items-center gap-1">
                <Plus className="h-3.5 w-3.5" />
                <span>Nova Meta</span>
              </Button>
            }
          />
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : goals && goals.length > 0 ? (
            <div className="space-y-8">
              {goals.map((goal) => (
                <GoalItem
                  key={goal.id}
                  title={goal.title}
                  deadline={goal.deadline}
                  targetAmount={parseFloat(goal.target_amount)}
                  savedAmount={parseFloat(goal.current_amount)}
                  percentage={goal.percentage}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">Nenhuma meta encontrada</p>
              <p className="text-sm text-gray-400 mt-1">
                Adicione uma nova meta financeira para começar a acompanhar seu progresso
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default GoalsTab;

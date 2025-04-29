
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import GoalItem from "./GoalItem";

const GoalsTab = () => {
  // Sample goal data - in a real app, this would come from an API or state
  const goals = [
    {
      id: 1,
      title: "Férias em Cancún",
      deadline: "dezembro 2025",
      targetAmount: 8000,
      savedAmount: 2500,
      percentage: 31
    },
    {
      id: 2,
      title: "Entrada para apartamento",
      deadline: "junho 2026",
      targetAmount: 40000,
      savedAmount: 18500,
      percentage: 46
    },
    {
      id: 3,
      title: "Novo notebook",
      deadline: "agosto 2025",
      targetAmount: 5500,
      savedAmount: 3200,
      percentage: 58
    }
  ];
  
  return (
    <div className="grid grid-cols-1 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Suas Metas Financeiras</CardTitle>
          <CardDescription>Acompanhe e gerencie suas metas financeiras</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            {goals.map((goal) => (
              <GoalItem
                key={goal.id}
                title={goal.title}
                deadline={goal.deadline}
                targetAmount={goal.targetAmount}
                savedAmount={goal.savedAmount}
                percentage={goal.percentage}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GoalsTab;

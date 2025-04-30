
import React from "react";

interface Goal {
  id: string;
  title: string;
  deadline: string;
  target_amount: number;
  current_amount: number;
  percentage: number;
  target_date: Date;
  description?: string;
  user_id: string;
  created_at: string;
}

interface GoalItemProps {
  goal: Goal;
}

const GoalItem = ({
  goal
}: GoalItemProps) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <div>
          <h3 className="text-lg font-medium">{goal.title}</h3>
          <p className="text-sm text-gray-500">Meta para {goal.deadline}</p>
        </div>
        <p className="font-semibold mx-[45px]">R$ {goal.target_amount.toLocaleString('pt-BR', {
          minimumFractionDigits: 2
        })}</p>
      </div>
      <div className="flex justify-between items-center text-sm">
        <span>R$ {goal.current_amount.toLocaleString('pt-BR', {
          minimumFractionDigits: 2
        })} economizados</span>
        <span>{goal.percentage}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div className="bg-blue-600 h-2.5 rounded-full" style={{
          width: `${goal.percentage}%`
        }}></div>
      </div>
    </div>
  );
};

export default GoalItem;

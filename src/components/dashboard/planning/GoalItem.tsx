
import React from "react";

interface GoalItemProps {
  title: string;
  deadline: string;
  targetAmount: number;
  savedAmount: number;
  percentage: number;
}

const GoalItem = ({ title, deadline, targetAmount, savedAmount, percentage }: GoalItemProps) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <div>
          <h3 className="text-lg font-medium">{title}</h3>
          <p className="text-sm text-gray-500">Meta para {deadline}</p>
        </div>
        <p className="font-semibold">R$ {targetAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
      </div>
      <div className="flex justify-between items-center text-sm">
        <span>R$ {savedAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} economizados</span>
        <span>{percentage}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div 
          className="bg-blue-600 h-2.5 rounded-full" 
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

export default GoalItem;

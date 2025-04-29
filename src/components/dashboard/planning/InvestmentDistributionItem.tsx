import React from "react";
interface InvestmentDistributionItemProps {
  label: string;
  percentage: number;
  amount: number;
  color: string;
}
const InvestmentDistributionItem = ({
  label,
  percentage,
  amount,
  color
}: InvestmentDistributionItemProps) => {
  return <div>
      <div className="flex justify-between mb-1">
        <span>{label}</span>
        <span className="mx-[48px]">{percentage}% (R$ {amount.toLocaleString('pt-BR', {
          minimumFractionDigits: 2
        })})</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div className={`${color} h-2.5 rounded-full`} style={{
        width: `${percentage}%`
      }}></div>
      </div>
    </div>;
};
export default InvestmentDistributionItem;
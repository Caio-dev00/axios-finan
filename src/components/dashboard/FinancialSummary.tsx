
import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ArrowUpCircle, ArrowDownCircle, Wallet } from "lucide-react";

const FinancialSummary = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="bg-white shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <h3 className="text-sm font-medium">Saldo Atual</h3>
          <Wallet className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-finance-primary">R$ 4.250,00</div>
          <p className="text-xs text-muted-foreground">
            Atualizado: hoje às 14:30
          </p>
        </CardContent>
      </Card>
      
      <Card className="bg-white shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <h3 className="text-sm font-medium">Receitas (Abr/2025)</h3>
          <ArrowUpCircle className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">R$ 6.800,00</div>
          <p className="text-xs text-muted-foreground">
            +12% em relação ao mês anterior
          </p>
        </CardContent>
      </Card>
      
      <Card className="bg-white shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <h3 className="text-sm font-medium">Despesas (Abr/2025)</h3>
          <ArrowDownCircle className="h-4 w-4 text-red-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">R$ 2.550,00</div>
          <p className="text-xs text-muted-foreground">
            -5% em relação ao mês anterior
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default FinancialSummary;

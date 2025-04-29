
import React from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Crown } from "lucide-react";
import { useNavigate } from "react-router-dom";

const SubscriptionStatus = () => {
  const { plan, isLoading } = useSubscription();
  const navigate = useNavigate();
  
  if (isLoading) {
    return (
      <Card className="border-dashed border-gray-300 animate-pulse">
        <CardHeader className="flex space-y-0">
          <div className="h-5 bg-gray-200 rounded w-1/3"></div>
        </CardHeader>
        <CardContent>
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </CardContent>
      </Card>
    );
  }

  const isPro = plan === "pro";

  return (
    <Card className={`${
      isPro 
        ? "border-finance-primary bg-gradient-to-br from-finance-primary/5 to-transparent" 
        : "border-gray-200"
    }`}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Seu Plano</CardTitle>
        {isPro ? (
          <Badge className="bg-finance-primary">
            <Crown size={12} className="mr-1" /> Pro
          </Badge>
        ) : (
          <Badge variant="outline">Free</Badge>
        )}
      </CardHeader>
      <CardContent>
        {isPro ? (
          <div className="space-y-2">
            <p className="text-sm text-gray-600">Você tem acesso a todos os recursos premium.</p>
            <ul className="text-xs text-gray-500 space-y-1">
              <li>✓ Transações ilimitadas</li>
              <li>✓ Exportação de relatórios</li>
              <li>✓ Categorização automática</li>
            </ul>
          </div>
        ) : (
          <div className="space-y-2">
            <p className="text-sm text-gray-600">Recursos limitados disponíveis no plano gratuito.</p>
            <p className="text-xs text-gray-500">Faça upgrade para desbloquear todos os recursos.</p>
          </div>
        )}
      </CardContent>
      {!isPro && (
        <CardFooter>
          <Button 
            size="sm" 
            className="w-full bg-finance-primary hover:bg-finance-primary/90"
            onClick={() => navigate("/precos")}
          >
            <CreditCard size={16} className="mr-2" /> Fazer Upgrade
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default SubscriptionStatus;

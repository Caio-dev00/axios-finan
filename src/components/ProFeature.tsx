
import React from "react";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { Badge } from "@/components/ui/badge";
import { Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface ProFeatureProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

const ProFeature: React.FC<ProFeatureProps> = ({ children, fallback }) => {
  const { isPro } = useSubscription();
  const { toast } = useToast();
  const navigate = useNavigate();

  if (isPro) {
    return <>{children}</>;
  }

  const handleProClick = () => {
    toast({
      title: "Recurso exclusivo do plano Pro",
      description: "Atualize seu plano para acessar este recurso.",
      action: (
        <button
          className="bg-finance-primary text-white px-3 py-1 rounded-md text-xs font-medium"
          onClick={() => navigate("/precos")}
        >
          Ver planos
        </button>
      ),
    });
  };

  if (fallback) {
    return <div onClick={handleProClick}>{fallback}</div>;
  }

  return (
    <div 
      className="relative cursor-not-allowed opacity-75 group"
      onClick={handleProClick}
    >
      <div className="absolute inset-0 bg-gray-200 bg-opacity-50 flex items-center justify-center z-10 rounded-md">
        <div className="flex items-center gap-2 bg-white px-3 py-1 rounded-full shadow-md group-hover:bg-finance-primary group-hover:text-white transition-colors">
          <Lock size={14} />
          <span className="text-xs font-medium">Recurso Pro</span>
        </div>
      </div>
      <div className="pointer-events-none">{children}</div>
    </div>
  );
};

export default ProFeature;

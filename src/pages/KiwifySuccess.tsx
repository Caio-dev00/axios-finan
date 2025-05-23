
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { processKiwifyPayment } from "@/services/subscriptionService";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const KiwifySuccess = () => {
  const [isProcessing, setIsProcessing] = useState(true);
  const { user } = useAuth();
  const { refreshSubscription } = useSubscription();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  useEffect(() => {
    const processPayment = async () => {
      try {
        // Extrair parâmetros da URL
        const queryParams = new URLSearchParams(location.search);
        const userId = queryParams.get("user_id");
        const email = queryParams.get("email");
        const transactionId = queryParams.get("transaction_id");
        
        if (!user && !userId) {
          toast({
            title: "Erro ao processar pagamento",
            description: "Não foi possível identificar o usuário para ativação do plano.",
            variant: "destructive",
          });
          setIsProcessing(false);
          return;
        }
        
        // Usar o ID do usuário da URL ou do usuário logado
        const effectiveUserId = userId || user?.id;
        
        if (effectiveUserId) {
          // Processar o pagamento via webhook simulado
          await processKiwifyPayment(effectiveUserId, {
            email: email || user?.email,
            transaction_id: transactionId,
            status: 'paid'
          });
          
          await refreshSubscription();
          
          toast({
            title: "Pagamento processado com sucesso!",
            description: "Seu plano Pro foi ativado.",
            variant: "default",
          });
        } else {
          // Caso não tenha usuário nem ID
          toast({
            title: "Atenção",
            description: "Para ativar seu plano Pro, você precisa criar uma conta ou fazer login.",
            variant: "default",
          });
          
          // Se tiver email, sugerir criar conta com esse email
          if (email) {
            navigate("/auth", { state: { suggestedEmail: email } });
            return;
          }
        }
      } catch (error) {
        console.error("Erro ao processar pagamento:", error);
        toast({
          title: "Erro ao processar pagamento",
          description: "Ocorreu um erro ao ativar seu plano Pro. Entre em contato com o suporte.",
          variant: "destructive",
        });
      } finally {
        setIsProcessing(false);
      }
    };

    processPayment();
  }, [user, location.search, navigate, refreshSubscription, toast]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-background py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
        <div className="text-center">
          {isProcessing ? (
            <>
              <Loader2 className="h-12 w-12 text-finance-primary mx-auto animate-spin" />
              <h2 className="mt-6 text-2xl font-bold text-gray-900 dark:text-gray-100">
                Processando seu pagamento...
              </h2>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Por favor, aguarde enquanto ativamos seu Plano Pro.
              </p>
            </>
          ) : (
            <>
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
              <h2 className="mt-6 text-2xl font-bold text-gray-900 dark:text-gray-100">
                Pagamento confirmado!
              </h2>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Obrigado por assinar o Plano Pro. Você agora tem acesso a todos os recursos premium.
              </p>
            </>
          )}
        </div>
        
        {!isProcessing && (
          <div className="mt-6">
            <Button
              onClick={() => navigate("/dashboard")}
              className="w-full bg-finance-primary hover:bg-finance-primary/90"
            >
              Ir para o Dashboard
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default KiwifySuccess;

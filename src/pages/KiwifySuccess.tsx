
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const KiwifySuccess = () => {
  const [isProcessing, setIsProcessing] = useState(true);
  const [processedSuccessfully, setProcessedSuccessfully] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const { refreshSubscription } = useSubscription();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  useEffect(() => {
    const processPayment = async () => {
      try {
        setIsProcessing(true);
        setError(null);
        
        // Extrair parâmetros da URL
        const queryParams = new URLSearchParams(location.search);
        const userIdParam = queryParams.get("user_id");
        const emailParam = queryParams.get("email");
        const transactionId = queryParams.get("transaction_id");
        
        console.log("Parâmetros recebidos:", {
          userIdParam,
          emailParam,
          transactionId,
          currentUser: user?.id,
          currentUserEmail: user?.email
        });

        // Determinar o ID do usuário e email a serem usados
        let targetUserId = userIdParam || user?.id;
        let targetEmail = emailParam || user?.email;

        // Dados para enviar para a edge function
        const requestData: any = {
          plan_type: 'pro',
          payment_id: transactionId || `TEST_TRANSACTION_${Date.now()}_APPROVED`
        };

        // Adicionar user_id se disponível
        if (targetUserId) {
          requestData.user_id = targetUserId;
        }

        // Adicionar email se disponível
        if (targetEmail) {
          requestData.email = targetEmail;
        }

        // Verificar se temos pelo menos um identificador
        if (!targetUserId && !targetEmail) {
          setError("Não foi possível identificar o usuário. Por favor, faça login e tente novamente.");
          setIsProcessing(false);
          return;
        }

        console.log("Enviando dados para edge function:", requestData);

        // Chamar a edge function para atualizar a assinatura
        const { data, error } = await supabase.functions.invoke('update-subscription', {
          body: requestData
        });
        
        if (error) {
          console.error("Erro da edge function:", error);
          setError(error.message || "Erro ao ativar o plano Pro. Tente novamente ou entre em contato com o suporte.");
          setIsProcessing(false);
          return;
        }

        if (!data?.success) {
          console.error("Resposta de erro:", data);
          setError(data?.error || "Erro ao ativar o plano Pro. Tente novamente ou entre em contato com o suporte.");
          setIsProcessing(false);
          return;
        }

        console.log("Assinatura atualizada com sucesso:", data);

        // Refresh da assinatura no contexto
        await refreshSubscription();
        
        setProcessedSuccessfully(true);

        toast({
          title: "Pagamento processado com sucesso!",
          description: data.test_mode 
            ? "Seu plano Pro de teste foi ativado. Bem-vindo!" 
            : "Seu plano Pro foi ativado. Bem-vindo!",
          variant: "default",
        });

      } catch (error) {
        console.error("Erro ao processar pagamento:", error);
        setError("Ocorreu um erro inesperado ao ativar seu plano Pro. Entre em contato com o suporte.");
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
          ) : error ? (
            <>
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
              <h2 className="mt-6 text-2xl font-bold text-gray-900 dark:text-gray-100">
                Erro no processamento
              </h2>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                {error}
              </p>
              {error.includes("faça login") && (
                <div className="mt-4">
                  <Button
                    onClick={() => navigate("/auth")}
                    className="bg-finance-primary hover:bg-finance-primary/90"
                  >
                    Fazer Login
                  </Button>
                </div>
              )}
            </>
          ) : processedSuccessfully ? (
            <>
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
              <h2 className="mt-6 text-2xl font-bold text-gray-900 dark:text-gray-100">
                Pagamento confirmado!
              </h2>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Obrigado por assinar o Plano Pro. Você agora tem acesso a todos os recursos premium.
              </p>
            </>
          ) : (
            <>
              <CheckCircle className="h-12 w-12 text-yellow-500 mx-auto" />
              <h2 className="mt-6 text-2xl font-bold text-gray-900 dark:text-gray-100">
                Processamento finalizado
              </h2>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Verifique os detalhes do seu plano no dashboard.
              </p>
            </>
          )}
        </div>
        
        {!isProcessing && (
          <div className="mt-6 space-y-3">
            <Button
              onClick={() => navigate("/dashboard")}
              className="w-full bg-finance-primary hover:bg-finance-primary/90"
            >
              Ir para o Dashboard
            </Button>
            
            <Button
              variant="outline"
              onClick={() => navigate("/dashboard/assinatura")}
              className="w-full"
            >
              Ver detalhes da assinatura
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default KiwifySuccess;


import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const KiwifySuccess = () => {
  const [isProcessing, setIsProcessing] = useState(true);
  const [processedSuccessfully, setProcessedSuccessfully] = useState(false);
  const { user } = useAuth();
  const { refreshSubscription } = useSubscription();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  useEffect(() => {
    const processPayment = async () => {
      try {
        setIsProcessing(true);
        
        // Extrair parâmetros da URL
        const queryParams = new URLSearchParams(location.search);
        const userIdParam = queryParams.get("user_id");
        const email = queryParams.get("email");
        const transactionId = queryParams.get("transaction_id");
        
        console.log("Processando pagamento com parâmetros:", {
          userIdParam,
          email,
          transactionId,
          currentUser: user?.email
        });

        // Determinar o ID do usuário a ser usado
        let targetUserId = userIdParam || user?.id;
        let targetEmail = email || user?.email;

        if (!targetUserId && !targetEmail) {
          toast({
            title: "Erro no processamento",
            description: "Não foi possível identificar o usuário para ativação do plano.",
            variant: "destructive",
          });
          setIsProcessing(false);
          return;
        }

        // Se não temos user_id mas temos email, buscar o usuário
        if (!targetUserId && targetEmail) {
          console.log("Buscando usuário pelo email:", targetEmail);
          
          const { data: profile, error: profileError } = await supabase
            .from("profiles")
            .select("id")
            .eq("email", targetEmail)
            .maybeSingle();

          if (profileError) {
            console.error("Erro ao buscar perfil:", profileError);
          }

          if (profile) {
            targetUserId = profile.id;
            console.log("Usuário encontrado:", targetUserId);
          }
        }

        if (!targetUserId) {
          toast({
            title: "Usuário não encontrado",
            description: "Para ativar seu plano Pro, você precisa criar uma conta ou fazer login com o email usado na compra.",
            variant: "default",
          });
          
          if (targetEmail) {
            navigate("/auth", { state: { suggestedEmail: targetEmail } });
            return;
          }
          
          setIsProcessing(false);
          return;
        }

        console.log("Atualizando assinatura para usuário:", targetUserId);

        // Chamar a edge function para atualizar a assinatura
        const { data, error } = await supabase.functions.invoke('update-subscription', {
          body: { 
            user_id: targetUserId,
            plan_type: 'pro',
            payment_id: transactionId
          }
        });
        
        if (error) {
          console.error("Erro ao atualizar assinatura:", error);
          throw error;
        }

        console.log("Assinatura atualizada com sucesso:", data);

        // Refresh da assinatura no contexto
        await refreshSubscription();
        
        setProcessedSuccessfully(true);

        toast({
          title: "Pagamento processado com sucesso!",
          description: "Seu plano Pro foi ativado. Bem-vindo!",
          variant: "default",
        });

      } catch (error) {
        console.error("Erro ao processar pagamento:", error);
        toast({
          title: "Erro ao processar pagamento",
          description: "Ocorreu um erro ao ativar seu plano Pro. Entre em contato com o suporte se o problema persistir.",
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

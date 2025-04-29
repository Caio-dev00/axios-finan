
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { acceptFamilyInvite } from "@/services/familyService";
import { useToast } from "@/hooks/use-toast";

const InvitePage: React.FC = () => {
  const { token } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [inviteData, setInviteData] = useState<{familyId: string} | null>(null);

  useEffect(() => {
    if (!token) {
      setError("Convite inválido. O token não foi fornecido.");
      setLoading(false);
      return;
    }

    // Decodificar o token (em uma aplicação real, você validaria isso do lado do servidor)
    try {
      const decoded = atob(token);
      const [prefix, familyId] = decoded.split(':');
      
      if (prefix !== "invite" || !familyId) {
        throw new Error("Token inválido");
      }

      setInviteData({ familyId });
    } catch (err) {
      setError("O link de convite é inválido ou expirou.");
    } finally {
      setLoading(false);
    }
  }, [token]);

  const handleAcceptInvite = async () => {
    if (!token) return;
    
    setProcessing(true);
    
    try {
      const result = await acceptFamilyInvite(token);
      
      if (result.success) {
        setSuccess(result.message);
        toast({
          title: "Sucesso!",
          description: result.message,
        });
        
        // Redirecionar para o dashboard após aceitar o convite
        setTimeout(() => {
          navigate("/dashboard/family");
        }, 2000);
      } else if (result.redirectToAuth) {
        // Redirecionar para a página de autenticação se o usuário não estiver logado
        toast({
          title: "Login necessário",
          description: "Você precisa fazer login para aceitar o convite.",
        });
        navigate("/auth", { state: { returnTo: `/invite/${token}` } });
      } else {
        setError(result.message);
        toast({
          title: "Erro",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (err: any) {
      setError(err.message || "Ocorreu um erro ao processar o convite.");
      toast({
        title: "Erro",
        description: "Erro ao processar o convite. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow flex items-center justify-center p-6">
        <div className="max-w-md w-full p-8 bg-white shadow-lg rounded-lg text-center">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-finance-primary mb-4" />
              <p>Verificando convite...</p>
            </div>
          ) : error ? (
            <div>
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-red-600 mb-4">Erro</h2>
              <p className="text-gray-600 mb-6">{error}</p>
              <Button onClick={() => navigate("/")}>Voltar para a página inicial</Button>
            </div>
          ) : success ? (
            <div>
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-green-600 mb-4">Sucesso!</h2>
              <p className="text-gray-600 mb-6">{success}</p>
              <Button onClick={() => navigate("/dashboard/family")} className="bg-finance-primary hover:bg-finance-primary/90">
                Ir para o Dashboard
              </Button>
            </div>
          ) : (
            <div>
              <h2 className="text-2xl font-bold text-finance-dark mb-4">
                Convite para Plano Familiar
              </h2>
              <p className="text-gray-600 mb-6">
                Você foi convidado para participar de um plano familiar no Axios Finanças.
                {!user && " Para aceitar, você precisará criar uma conta ou fazer login."}
              </p>
              <div className="space-y-3">
                <Button 
                  onClick={handleAcceptInvite}
                  className="w-full bg-finance-primary hover:bg-finance-primary/90"
                  disabled={processing}
                >
                  {processing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {user ? "Aceitar Convite" : "Fazer login para continuar"}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => navigate("/")}
                  className="w-full"
                  disabled={processing}
                >
                  Não agora
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default InvitePage;


import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Loader2 } from "lucide-react";

const InvitePage: React.FC = () => {
  const { token } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [inviteData, setInviteData] = useState<{familyId: string} | null>(null);

  useEffect(() => {
    if (!token) {
      setError("Convite inválido. O token não foi fornecido.");
      setLoading(false);
      return;
    }

    // Decode the token (in a real app, you would validate this server-side)
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
    // In a real application, you would:
    // 1. Validate the token server-side
    // 2. Add the user to the family_members table
    // 3. Update the user's subscription to family
    
    // For this demo, we'll just redirect to the dashboard
    if (user) {
      navigate("/dashboard");
    } else {
      navigate("/auth");
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
              <h2 className="text-2xl font-bold text-red-600 mb-4">Erro</h2>
              <p className="text-gray-600 mb-6">{error}</p>
              <Button onClick={() => navigate("/")}>Voltar para a página inicial</Button>
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
                >
                  {user ? "Aceitar Convite" : "Fazer login para continuar"}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => navigate("/")}
                  className="w-full"
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


import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AuthContainer from "@/components/auth/AuthContainer";
import LoginForm from "@/components/auth/LoginForm";
import RegisterForm from "@/components/auth/RegisterForm";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const Auth: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"login" | "register">("register");
  const { toast } = useToast();

  // Check if there's a return path in the location state
  const returnTo = location.state?.returnTo || "/dashboard";
  const redirectToPurchase = location.state?.redirectToPurchase || false;

  // If user is already logged in, redirect to dashboard or returnTo path
  React.useEffect(() => {
    if (user) {
      if (redirectToPurchase) {
        toast({
          title: "Login realizado com sucesso",
          description: "Agora você será redirecionado para completar sua compra.",
        });
        
        setTimeout(() => {
          // Redirecionar para a página de preços onde o usuário pode completar a compra
          navigate("/precos");
        }, 1500);
      } else {
        navigate(returnTo);
      }
    }
  }, [user, navigate, returnTo, redirectToPurchase, toast]);

  // Set the active tab based on the presence of redirectToPurchase
  useEffect(() => {
    if (location.state?.redirectToPurchase) {
      // Se o usuário foi redirecionado para comprar, mostrar o registro por padrão
      setActiveTab("register");
    }
  }, [location]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-finance-light to-white py-12">
      <div className="container mx-auto px-4">
        {redirectToPurchase && (
          <div className="max-w-md mx-auto mb-6 bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h2 className="font-semibold text-blue-800 mb-2">Crie sua conta para continuar com a compra</h2>
            <p className="text-blue-600 text-sm">
              Para acessar o plano Pro, primeiro crie ou entre em sua conta. Depois você será redirecionado para completar sua compra.
            </p>
          </div>
        )}
      
        <AuthContainer activeTab={activeTab} setActiveTab={setActiveTab}>
          {activeTab === "login" ? (
            <LoginForm returnTo={returnTo} />
          ) : (
            <RegisterForm returnTo={returnTo} />
          )}
        </AuthContainer>
      </div>
    </div>
  );
};

export default Auth;

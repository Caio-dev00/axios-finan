
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();

  // Mostra um indicador de carregamento enquanto verifica a autenticação
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  // Redireciona para a página de login se o usuário não estiver autenticado
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // Renderiza os filhos se o usuário estiver autenticado
  return <>{children}</>;
};

export default ProtectedRoute;

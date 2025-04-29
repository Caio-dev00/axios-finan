
import React, { useState } from "react";
import { Navigate, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

import LoginForm, { LoginFormValues } from "@/components/auth/LoginForm";
import RegisterForm, { RegisterFormValues } from "@/components/auth/RegisterForm";
import AuthContainer from "@/components/auth/AuthContainer";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const { user, signIn, signUp, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Verifica se existe um estado com rota de retorno
  const returnTo = location.state?.returnTo || "/dashboard";

  const onLoginSubmit = async (values: LoginFormValues) => {
    try {
      await signIn(values.email, values.password);
      navigate(returnTo);
    } catch (error) {
      // Erro já tratado no contexto de autenticação
    }
  };

  const onRegisterSubmit = async (values: RegisterFormValues) => {
    try {
      await signUp(values.email, values.password, values.nome);
      setIsLogin(true); // Volta para a tela de login após cadastro
    } catch (error) {
      // Erro já tratado no contexto de autenticação
    }
  };

  // Se o usuário já estiver autenticado, redireciona para o dashboard
  if (user) {
    return <Navigate to={returnTo} replace />;
  }

  return (
    <AuthContainer
      isLogin={isLogin}
      onToggleForm={() => setIsLogin(!isLogin)}
      loading={loading}
    >
      {isLogin ? (
        <LoginForm onSubmit={onLoginSubmit} loading={loading} />
      ) : (
        <RegisterForm onSubmit={onRegisterSubmit} loading={loading} />
      )}
    </AuthContainer>
  );
};

export default Auth;

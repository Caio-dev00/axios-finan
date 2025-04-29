
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AuthContainer from "@/components/auth/AuthContainer";
import LoginForm from "@/components/auth/LoginForm";
import RegisterForm from "@/components/auth/RegisterForm";
import { useAuth } from "@/contexts/AuthContext";

const Auth: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");

  // Check if there's a return path in the location state
  const returnTo = location.state?.returnTo || "/dashboard";

  // If user is already logged in, redirect to dashboard or returnTo path
  React.useEffect(() => {
    if (user) {
      navigate(returnTo);
    }
  }, [user, navigate, returnTo]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-finance-light to-white py-12">
      <div className="container mx-auto px-4">
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

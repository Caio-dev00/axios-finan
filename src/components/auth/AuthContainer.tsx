
import React, { ReactNode, Dispatch, SetStateAction } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface AuthContainerProps {
  children: ReactNode;
  activeTab: "login" | "register";
  setActiveTab: Dispatch<SetStateAction<"login" | "register">>;
}

const AuthContainer: React.FC<AuthContainerProps> = ({ 
  children, 
  activeTab, 
  setActiveTab 
}) => {
  const isLogin = activeTab === "login";

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link to="/" className="flex items-center justify-center mb-4">
          <span className="text-3xl font-bold text-finance-primary">Wisex</span>
          <span className="text-3xl font-medium text-finance-dark ml-1">Finanças</span>
        </Link>
        <h2 className="mt-6 text-center text-2xl font-semibold text-gray-700">
          {isLogin ? "Acesse sua conta" : "Crie sua conta"}
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {children}

          <div className="mt-6">
            <Separator className="my-4" />
            <p className="text-sm text-gray-500 text-center">
              {isLogin ? "Não tem uma conta?" : "Já tem uma conta?"}
              <Button
                variant="link"
                className="ml-1 text-finance-primary"
                onClick={() => setActiveTab(isLogin ? "register" : "login")}
                type="button"
              >
                {isLogin ? "Cadastre-se" : "Faça login"}
              </Button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthContainer;

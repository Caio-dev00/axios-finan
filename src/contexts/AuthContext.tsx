
import React, { createContext, useContext, useEffect, useState } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

type AuthError = {
  message: string;
}

type AuthResult = {
  error?: AuthError | null;
}

type AuthContextType = {
  user: User | null;
  session: Session | null;
  signIn: (email: string, password: string) => Promise<AuthResult>;
  signUp: (email: string, password: string, nome: string) => Promise<AuthResult>;
  signOut: () => Promise<void>;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Configurar o listener de mudança de estado de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        // Feedback apropriado para eventos de autenticação
        if (event === 'SIGNED_IN') {
          console.log("Usuário autenticado com sucesso!");
        } else if (event === 'SIGNED_OUT') {
          console.log("Usuário desconectado.");
        } else if (event === 'USER_UPDATED') {
          console.log("Dados do usuário atualizados.");
        } else if (event === 'PASSWORD_RECOVERY') {
          console.log("Solicitação de recuperação de senha.");
        }
        
        setLoading(false);
      }
    );

    // Verificar sessão existente
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string): Promise<AuthResult> => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) return { error };
      
      return {};
    } catch (error: any) {
      const errorMessage = error.message || "Erro ao entrar. Tente novamente.";
      toast({
        title: "Erro ao entrar",
        description: errorMessage,
        variant: "destructive",
      });
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, nome: string): Promise<AuthResult> => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            nome,
          },
        },
      });
      
      if (error) {
        if (error.message.includes("User already registered")) {
          return { error: { message: "Este email já está cadastrado. Por favor, faça login ou use outro email." } };
        }
        return { error };
      }
      
      toast({
        title: "Cadastro realizado com sucesso!",
        description: "Verifique seu email para confirmar sua conta.",
      });
      
      return {};
    } catch (error: any) {
      const errorMessage = error.message || "Erro ao cadastrar. Tente novamente.";
      toast({
        title: "Erro ao cadastrar",
        description: errorMessage,
        variant: "destructive",
      });
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      await supabase.auth.signOut();
      toast({
        title: "Desconectado com sucesso",
        description: "Você foi desconectado do sistema.",
      });
    } catch (error: any) {
      const errorMessage = error.message || "Erro ao sair. Tente novamente.";
      toast({
        title: "Erro ao sair",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    session,
    signIn,
    signUp,
    signOut,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
};


import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from './AuthContext';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  isDarkMode: boolean;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>('light');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const { user } = useAuth();
  
  // Efeito para carregar o tema do armazenamento local ao iniciar
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  // Efeito para carregar o tema do usuário da base de dados quando estiver logado
  useEffect(() => {
    const loadUserTheme = async () => {
      if (user?.id) {
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

          if (error) throw error;
          
          // Check if theme_preference property exists in the data
          if (data && typeof data === 'object') {
            const userTheme = data.theme_preference as Theme | undefined;
            if (userTheme && (userTheme === 'light' || userTheme === 'dark' || userTheme === 'system')) {
              setTheme(userTheme);
              localStorage.setItem('theme', userTheme);
            }
          }
        } catch (error) {
          console.error("Erro ao carregar preferência de tema:", error);
        }
      }
    };

    loadUserTheme();
  }, [user?.id]);

  // Efeito para salvar o tema na base de dados quando o usuário alterar
  useEffect(() => {
    const saveUserTheme = async () => {
      if (user?.id) {
        try {
          const updates: Record<string, any> = {
            updated_at: new Date().toISOString()
          };
          
          if (theme !== 'system') {
            updates.theme_preference = theme;
          }
          
          if (Object.keys(updates).length > 1) { // > 1 because updated_at is always there
            await supabase
              .from('profiles')
              .update(updates)
              .eq('id', user.id);
          }
        } catch (error) {
          console.error("Erro ao salvar preferência de tema:", error);
        }
      }
    };

    if (theme !== 'system') {
      localStorage.setItem('theme', theme);
      saveUserTheme();
    }
  }, [theme, user?.id]);

  // Efeito para aplicar o tema com base na preferência do usuário e nas preferências do sistema
  useEffect(() => {
    const applyTheme = () => {
      const root = window.document.documentElement;
      const isSystemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      
      if (theme === 'system') {
        if (isSystemDark) {
          root.classList.add('dark');
          setIsDarkMode(true);
        } else {
          root.classList.remove('dark');
          setIsDarkMode(false);
        }
      } else {
        if (theme === 'dark') {
          root.classList.add('dark');
          setIsDarkMode(true);
        } else {
          root.classList.remove('dark');
          setIsDarkMode(false);
        }
      }
    };

    applyTheme();

    // Listener para mudanças na preferência do sistema
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (theme === 'system') {
        applyTheme();
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, isDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

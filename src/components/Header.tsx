
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  Sheet, 
  SheetContent, 
  SheetTrigger, 
  SheetClose 
} from "@/components/ui/sheet";
import { Menu, User, LogOut } from "lucide-react";

const Header = () => {
  const { user, signOut } = useAuth();
  const [open, setOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <header className="w-full bg-white shadow-sm sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        <div className="flex items-center">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-finance-primary">Wisex</span>
            <span className="text-2xl font-medium text-finance-dark">Finanças</span>
          </Link>
        </div>
        
        <div className="hidden md:flex items-center space-x-8">
          {user ? (
            <>
              <Link to="/dashboard" className="text-gray-700 hover:text-finance-primary transition-colors">
                Dashboard
              </Link>
              <Link to="/dashboard/transacoes" className="text-gray-700 hover:text-finance-primary transition-colors">
                Transações
              </Link>
              <Link to="/dashboard/relatorios" className="text-gray-700 hover:text-finance-primary transition-colors">
                Relatórios
              </Link>
              <Link to="/dashboard/dicas" className="text-gray-700 hover:text-finance-primary transition-colors">
                Dicas
              </Link>
            </>
          ) : (
            <>
              <Link to="/" className="text-gray-700 hover:text-finance-primary transition-colors">
                Início
              </Link>
              <Link to="/recursos" className="text-gray-700 hover:text-finance-primary transition-colors">
                Recursos
              </Link>
              <Link to="/precos" className="text-gray-700 hover:text-finance-primary transition-colors">
                Preços
              </Link>
            </>
          )}
        </div>
        
        <div className="hidden md:block">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative rounded-full">
                  <User className="h-5 w-5" />
                  <span className="sr-only">Menu do usuário</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Minha conta</DropdownMenuLabel>
                <DropdownMenuItem asChild>
                  <Link to="/dashboard/configuracoes">Perfil</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/dashboard/configuracoes">Configurações</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sair</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button className="bg-finance-primary hover:bg-finance-primary/90 text-white" asChild>
              <Link to="/auth">Entrar</Link>
            </Button>
          )}
        </div>
        
        <div className="md:hidden flex items-center">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="text-gray-700">
                <span className="sr-only">Abrir menu</span>
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="flex flex-col h-full">
                <div className="py-4">
                  <Link to="/" className="flex items-center mb-6" onClick={() => setOpen(false)}>
                    <span className="text-xl font-bold text-finance-primary">Wisex</span>
                    <span className="text-xl font-medium text-finance-dark ml-1">Finanças</span>
                  </Link>
                  <div className="flex flex-col space-y-4">
                    {user ? (
                      <>
                        <SheetClose asChild>
                          <Link 
                            to="/dashboard/configuracoes" 
                            className="text-gray-700 hover:text-finance-primary transition-colors"
                          >
                            Perfil
                          </Link>
                        </SheetClose>
                        <SheetClose asChild>
                          <Link 
                            to="/dashboard/configuracoes" 
                            className="text-gray-700 hover:text-finance-primary transition-colors"
                          >
                            Configurações
                          </Link>
                        </SheetClose>
                      </>
                    ) : (
                      <>
                        <SheetClose asChild>
                          <Link 
                            to="/" 
                            className="text-gray-700 hover:text-finance-primary transition-colors"
                          >
                            Início
                          </Link>
                        </SheetClose>
                        <SheetClose asChild>
                          <Link 
                            to="/recursos" 
                            className="text-gray-700 hover:text-finance-primary transition-colors"
                          >
                            Recursos
                          </Link>
                        </SheetClose>
                        <SheetClose asChild>
                          <Link 
                            to="/precos" 
                            className="text-gray-700 hover:text-finance-primary transition-colors"
                          >
                            Preços
                          </Link>
                        </SheetClose>
                      </>
                    )}
                  </div>
                </div>
                <div className="mt-auto pb-6">
                  {user ? (
                    <SheetClose asChild>
                      <Button 
                        onClick={handleSignOut}
                        variant="outline"
                        className="w-full flex items-center justify-center text-red-600 border-red-200"
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Sair</span>
                      </Button>
                    </SheetClose>
                  ) : (
                    <SheetClose asChild>
                      <Button className="w-full bg-finance-primary hover:bg-finance-primary/90 text-white" asChild>
                        <Link to="/auth">Entrar</Link>
                      </Button>
                    </SheetClose>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
};

export default Header;

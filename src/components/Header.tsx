
import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="w-full bg-white shadow-sm sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        <div className="flex items-center">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-finance-primary">Axios</span>
            <span className="text-2xl font-medium text-finance-dark">Finanças</span>
          </Link>
        </div>
        
        <div className="hidden md:flex items-center space-x-8">
          <Link to="/dashboard" className="text-gray-700 hover:text-finance-primary transition-colors">
            Dashboard
          </Link>
          <Link to="/transacoes" className="text-gray-700 hover:text-finance-primary transition-colors">
            Transações
          </Link>
          <Link to="/relatorios" className="text-gray-700 hover:text-finance-primary transition-colors">
            Relatórios
          </Link>
          <Link to="/dicas" className="text-gray-700 hover:text-finance-primary transition-colors">
            Dicas
          </Link>
        </div>
        
        <div className="hidden md:block">
          <Button className="bg-finance-primary hover:bg-finance-primary/90 text-white">
            Assinar Plano Pro
          </Button>
        </div>
        
        <div className="md:hidden flex items-center">
          <Button variant="outline" size="icon" className="text-gray-700">
            <span className="sr-only">Open menu</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="4" x2="20" y1="12" y2="12" />
              <line x1="4" x2="20" y1="6" y2="6" />
              <line x1="4" x2="20" y1="18" y2="18" />
            </svg>
          </Button>
        </div>
      </nav>
    </header>
  );
};

export default Header;

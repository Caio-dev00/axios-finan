
import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-finance-dark py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8 mb-12">
          <div>
            <div className="flex items-center mb-4">
              <span className="text-2xl font-bold text-finance-primary">Axios</span>
              <span className="text-2xl font-medium text-white ml-1">Finanças</span>
            </div>
            <p className="text-gray-400">
              Controle suas finanças com facilidade e alcance seus objetivos financeiros.
            </p>
          </div>
          
          <div>
            <h3 className="text-white font-semibold mb-4">Produto</h3>
            <ul className="space-y-2">
              <li><Link to="/recursos" className="text-gray-400 hover:text-white transition-colors">Recursos</Link></li>
              <li><Link to="/precos" className="text-gray-400 hover:text-white transition-colors">Planos</Link></li>
              <li><Link to="/dashboard/dicas" className="text-gray-400 hover:text-white transition-colors">Dicas Financeiras</Link></li>
              <li><Link to="/dashboard/relatorios" className="text-gray-400 hover:text-white transition-colors">Relatórios</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white font-semibold mb-4">Suporte</h3>
            <ul className="space-y-2">
              <li><Link to="/saiba-mais" className="text-gray-400 hover:text-white transition-colors">Ajuda</Link></li>
              <li><Link to="/saiba-mais" className="text-gray-400 hover:text-white transition-colors">Contato</Link></li>
              <li><Link to="/saiba-mais" className="text-gray-400 hover:text-white transition-colors">Perguntas Frequentes</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li><Link to="/saiba-mais" className="text-gray-400 hover:text-white transition-colors">Termos de Uso</Link></li>
              <li><Link to="/saiba-mais" className="text-gray-400 hover:text-white transition-colors">Política de Privacidade</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">
            &copy; 2025 Axios Finanças. Todos os direitos reservados.
          </p>
          <div className="flex space-x-4">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
              </svg>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

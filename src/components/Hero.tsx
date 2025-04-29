
import React from "react";
import { Button } from "@/components/ui/button";

const Hero = () => {
  return (
    <section className="bg-gradient-to-br from-finance-light to-white py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center justify-between">
          <div className="lg:w-1/2 lg:pr-12 mb-10 lg:mb-0 animate-fade-up">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-finance-dark leading-tight mb-6">
              Controle suas finanças com <span className="text-finance-primary">facilidade</span>
            </h1>
            <p className="text-lg text-gray-700 mb-8 max-w-lg">
              Axios Finanças é o app ideal para quem quer ter o controle das finanças pessoais de forma simples, organizada e eficaz.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button className="finance-btn-primary text-base">
                Comece agora gratuitamente
              </Button>
              <Button variant="outline" className="border-finance-primary text-finance-primary hover:bg-finance-light text-base">
                Saiba mais
              </Button>
            </div>
            <div className="mt-6 text-sm text-gray-500">
              Teste por 2 dias sem compromisso. Cancele quando quiser.
            </div>
          </div>
          <div className="lg:w-1/2 animate-fade-in">
            <div className="glass-card p-6 rounded-xl shadow-lg">
              <img
                src="https://via.placeholder.com/600x400/E8F5E9/1E3A2B?text=Dashboard+Axios+Financas"
                alt="Dashboard Axios Finanças"
                className="w-full h-auto rounded-lg shadow-sm"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

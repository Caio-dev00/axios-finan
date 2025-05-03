
import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const CallToAction = () => {
  return <section className="py-16 bg-finance-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Comece a transformar suas finanças hoje
          </h2>
          <p className="text-lg text-white/90 mb-8 max-w-2xl">
            Teste o Axios Finanças gratuitamente por 2 dias e descubra como é fácil ter o controle total das suas finanças.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button className="bg-white text-finance-primary hover:bg-white/90 text-base" asChild>
              <Link to="/auth">Começar teste grátis</Link>
            </Button>
            <Button variant="outline" className="border-white text-white text-base bg-gray-800 hover:bg-gray-700">
              <a href="https://pay.cakto.com.br/4j2tn5j_365602" target="_blank" rel="noopener noreferrer">
                Assinar plano Pro - R$ 24,90/mês
              </a>
            </Button>
          </div>
          <p className="mt-6 text-sm text-white/80">
            Cancele quando quiser. Sem compromisso de permanência.
          </p>
        </div>
      </div>
    </section>;
};

export default CallToAction;

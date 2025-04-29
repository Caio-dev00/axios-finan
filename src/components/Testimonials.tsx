
import React from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

const Testimonials = () => {
  const testimonials = [
    {
      quote: "O Axios Finanças transformou minha relação com o dinheiro. Antes eu não sabia para onde ia meu salário, agora tenho total controle.",
      name: "Ana Silva",
      role: "Designer",
      avatar: "https://via.placeholder.com/64/E8F5E9/1E3A2B?text=AS"
    },
    {
      quote: "Consegui economizar R$ 5.000 em apenas 6 meses usando as dicas personalizadas e o controle de gastos do app.",
      name: "Carlos Mendes",
      role: "Engenheiro",
      avatar: "https://via.placeholder.com/64/E8F5E9/1E3A2B?text=CM"
    },
    {
      quote: "Interface super intuitiva e relatórios detalhados. O melhor app de finanças que já usei. Vale cada centavo investido.",
      name: "Marina Santos",
      role: "Professora",
      avatar: "https://via.placeholder.com/64/E8F5E9/1E3A2B?text=MS"
    }
  ];

  return (
    <section className="py-16 bg-finance-gray">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold text-finance-dark mb-4">O que nossos usuários dizem</h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Milhares de pessoas já transformaram suas finanças com o Axios Finanças.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="bg-white border-none shadow-md">
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg key={star} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#F4B400" className="mr-1">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-700 italic mb-4">"{testimonial.quote}"</p>
              </CardContent>
              <CardFooter className="flex items-center border-t border-gray-100 pt-4">
                <img 
                  src={testimonial.avatar} 
                  alt={testimonial.name} 
                  className="w-10 h-10 rounded-full mr-3"
                />
                <div>
                  <p className="font-medium text-finance-dark">{testimonial.name}</p>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;


import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useSubscription } from "@/contexts/SubscriptionContext";
import ProFeature from "@/components/ProFeature";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Bookmark, BookmarkPlus, MessageSquare, ThumbsUp, Star, Share2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Dicas financeiras para todos os usuários
const dicasGerais = [
  {
    id: 1,
    titulo: "Regra 50/30/20 para seu orçamento",
    descricao: "Destine 50% da sua renda para necessidades básicas, 30% para desejos pessoais e 20% para poupança e investimentos.",
    categoria: "Orçamento",
    nivel: "Básico",
    estrelas: 5,
    dataCriacao: "2025-04-01",
    destacado: true
  },
  {
    id: 2,
    titulo: "Como montar um fundo de emergência",
    descricao: "Tenha pelo menos 6 meses de despesas guardados em uma conta de alta liquidez para emergências inesperadas.",
    categoria: "Poupança",
    nivel: "Básico",
    estrelas: 5,
    dataCriacao: "2025-04-15",
    destacado: true
  },
  {
    id: 3,
    titulo: "Negociando dívidas de forma eficaz",
    descricao: "Aprenda como conversar com credores e renegociar taxas, prazos e condições de pagamento.",
    categoria: "Dívidas",
    nivel: "Intermediário",
    estrelas: 4,
    dataCriacao: "2025-04-20",
    destacado: false
  },
  {
    id: 4,
    titulo: "Automatize suas finanças",
    descricao: "Configure transferências automáticas para investimentos logo depois do recebimento do seu salário.",
    categoria: "Hábitos",
    nivel: "Básico",
    estrelas: 4,
    dataCriacao: "2025-04-12",
    destacado: false
  }
];

// Dicas financeiras premium para usuários Pro
const dicasPro = [
  {
    id: 5,
    titulo: "Estratégias avançadas de investimento",
    descricao: "Diversifique sua carteira com uma combinação de ativos de renda fixa, renda variável e investimentos alternativos.",
    categoria: "Investimentos",
    nivel: "Avançado",
    estrelas: 5,
    dataCriacao: "2025-04-28",
    destacado: true
  },
  {
    id: 6,
    titulo: "Planejamento tributário para investidores",
    descricao: "Aprenda como otimizar seus investimentos para reduzir a carga tributária legal e maximizar seus retornos.",
    categoria: "Impostos",
    nivel: "Avançado",
    estrelas: 5,
    dataCriacao: "2025-04-23",
    destacado: true
  },
  {
    id: 7,
    titulo: "Independência financeira: O guia completo",
    descricao: "Descubra quanto você precisa poupar e investir para alcançar a independência financeira com base em seus gastos atuais.",
    categoria: "Planejamento",
    nivel: "Avançado",
    estrelas: 5,
    dataCriacao: "2025-04-18",
    destacado: true
  }
];

// Categorias de dicas
const categorias = [
  "Todas", "Orçamento", "Poupança", "Investimentos", "Dívidas", "Impostos", "Planejamento", "Hábitos"
];

const DicaCard = ({ dica, isPro }) => {
  const { toast } = useToast();
  const [salvo, setSalvo] = useState(false);
  const [curtido, setCurtido] = useState(false);
  
  const handleSalvar = () => {
    setSalvo(!salvo);
    toast({
      title: !salvo ? "Dica salva!" : "Dica removida dos salvos",
      description: !salvo ? "Esta dica foi adicionada aos seus favoritos." : "Esta dica foi removida dos seus favoritos."
    });
  };
  
  const handleCurtir = () => {
    setCurtido(!curtido);
    toast({
      title: !curtido ? "Você curtiu esta dica!" : "Você descurtiu esta dica",
      description: !curtido ? "Obrigado pelo feedback positivo." : "Seu feedback foi registrado."
    });
  };
  
  const handleCompartilhar = () => {
    toast({
      title: "Link copiado!",
      description: "O link para esta dica foi copiado para sua área de transferência."
    });
  };

  return (
    <Card className={`h-full flex flex-col ${dica.destacado ? "border-finance-primary/20" : ""}`}>
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{dica.titulo}</CardTitle>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="secondary">{dica.categoria}</Badge>
              <Badge variant="outline">{dica.nivel}</Badge>
            </div>
          </div>
          {dica.destacado && (
            <div className="text-yellow-500 flex">
              <Star size={16} fill="currentColor" />
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-gray-600 dark:text-gray-300">{dica.descricao}</p>
      </CardContent>
      <CardFooter className="flex justify-between pt-2 pb-3 border-t">
        <div className="flex gap-1 text-sm text-gray-500">
          {Array(dica.estrelas).fill(0).map((_, i) => (
            <Star key={i} size={14} fill="currentColor" className="text-yellow-500" />
          ))}
        </div>
        <div className="flex gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-7 w-7 p-0" 
            onClick={handleCurtir}
          >
            <ThumbsUp size={14} className={curtido ? "text-finance-primary fill-finance-primary" : ""} />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-7 w-7 p-0" 
            onClick={handleSalvar}
          >
            {salvo ? 
              <Bookmark size={14} className="text-finance-primary fill-finance-primary" /> : 
              <BookmarkPlus size={14} />
            }
          </Button>
          {isPro && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-7 w-7 p-0"
              onClick={handleCompartilhar}
            >
              <Share2 size={14} />
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

const DicasPage = () => {
  const { isPro } = useSubscription();
  const navigate = useNavigate();
  const [categoriaAtiva, setCategoriaAtiva] = useState("Todas");
  const { toast } = useToast();

  // Filtrar dicas com base na categoria selecionada
  const dicasFiltradasGerais = categoriaAtiva === "Todas" 
    ? dicasGerais 
    : dicasGerais.filter(dica => dica.categoria === categoriaAtiva);

  const dicasFiltradasPro = categoriaAtiva === "Todas" 
    ? dicasPro 
    : dicasPro.filter(dica => dica.categoria === categoriaAtiva);

  // Inscrever para receber notificações de novas dicas
  const inscreverNotificacoes = () => {
    toast({
      title: "Inscrição confirmada!",
      description: "Você receberá notificações quando novas dicas financeiras forem adicionadas."
    });
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-foreground">Dicas Financeiras</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Aprenda estratégias para melhorar sua saúde financeira
          </p>
        </div>
        
        <div className="mt-4 md:mt-0 flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-1"
            onClick={inscreverNotificacoes}
          >
            <MessageSquare size={16} />
            <span>Receber novas dicas</span>
          </Button>
        </div>
      </div>

      {/* Filtros de categoria */}
      <div className="mb-6 overflow-x-auto">
        <div className="flex gap-2 pb-2">
          {categorias.map((categoria) => (
            <Button
              key={categoria}
              variant={categoriaAtiva === categoria ? "default" : "outline"}
              size="sm"
              onClick={() => setCategoriaAtiva(categoria)}
            >
              {categoria}
            </Button>
          ))}
        </div>
      </div>
      
      {/* Dicas em destaque */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Dicas em Destaque</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dicasFiltradasGerais
            .filter(dica => dica.destacado)
            .map(dica => (
              <DicaCard key={dica.id} dica={dica} isPro={isPro} />
            ))}
          
          {isPro && dicasFiltradasPro
            .filter(dica => dica.destacado)
            .map(dica => (
              <DicaCard key={dica.id} dica={dica} isPro={isPro} />
            ))}
        </div>
      </div>

      {/* Dicas gerais */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Dicas para Todos</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dicasFiltradasGerais
            .filter(dica => !dica.destacado)
            .map(dica => (
              <DicaCard key={dica.id} dica={dica} isPro={isPro} />
            ))}
        </div>
      </div>

      {/* Dicas premium - apenas para usuários Pro */}
      <div>
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          Dicas Premium
          <Badge className="bg-amber-100 text-amber-800">Pro</Badge>
        </h2>

        {isPro ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dicasFiltradasPro
              .filter(dica => !dica.destacado)
              .map(dica => (
                <DicaCard key={dica.id} dica={dica} isPro={isPro} />
              ))}
          </div>
        ) : (
          <Card className="bg-finance-light border-finance-primary border">
            <CardContent className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-6">
              <div>
                <h3 className="text-lg font-semibold text-finance-dark">Desbloqueie dicas financeiras avançadas</h3>
                <p className="text-finance-dark/80">
                  Assine o plano Pro e tenha acesso a conteúdos exclusivos e personalizados para o seu perfil financeiro.
                </p>
              </div>
              <Button onClick={() => navigate("/precos")} className="bg-finance-primary hover:bg-finance-primary/90 whitespace-nowrap">
                Ver planos
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default DicasPage;

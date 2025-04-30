
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSubscription } from "@/contexts/SubscriptionContext";
import ProFeature from "@/components/ProFeature";

// Lista completa de 50 dicas financeiras
const financialTips = [
  {
    title: "Regra 50/30/20",
    content: "Destine 50% da sua renda para necessidades, 30% para desejos e 20% para investimentos e economia.",
    category: "orçamento"
  },
  {
    title: "Fundo de Emergência",
    content: "Mantenha um fundo de emergência equivalente a pelo menos 6 meses dos seus gastos mensais.",
    category: "poupança"
  },
  {
    title: "Automatize suas economias",
    content: "Configure transferências automáticas para sua conta de investimentos logo após receber seu salário.",
    category: "poupança"
  },
  {
    title: "Elimine dívidas caras primeiro",
    content: "Foque em pagar as dívidas com juros mais altos primeiro, como cartão de crédito, antes de investir.",
    category: "dívidas"
  },
  {
    title: "Use a técnica do envelope",
    content: "Separe dinheiro em envelopes (físicos ou digitais) para diferentes categorias de despesas para controlar gastos.",
    category: "orçamento"
  },
  {
    title: "Invista com regularidade",
    content: "Fazer aportes regulares nos investimentos, mesmo que pequenos, traz benefícios enormes a longo prazo devido aos juros compostos.",
    category: "investimentos"
  },
  {
    title: "Revisão trimestral",
    content: "Faça uma revisão completa das suas finanças a cada 3 meses para identificar padrões e oportunidades de economia.",
    category: "planejamento"
  },
  {
    title: "Lista de compras",
    content: "Sempre faça uma lista antes de ir às compras e comprometa-se a segui-la para evitar compras por impulso.",
    category: "economizar"
  },
  {
    title: "Regra das 24 horas",
    content: "Antes de fazer uma compra não planejada, espere 24 horas. Se ainda quiser o item depois desse tempo, considere comprá-lo.",
    category: "economizar"
  },
  {
    title: "Diversifique investimentos",
    content: "Não coloque todos os ovos na mesma cesta. Distribua seus investimentos entre diferentes classes de ativos.",
    category: "investimentos"
  },
  {
    title: "Aprenda continuamente",
    content: "Invista em educação financeira. Leia livros, participe de cursos e acompanhe conteúdos sobre finanças.",
    category: "educação"
  },
  {
    title: "Reavalie subscrições",
    content: "Revise mensalmente todas as suas assinaturas e serviços recorrentes. Cancele o que não usa com frequência.",
    category: "economizar"
  },
  {
    title: "Metas financeiras claras",
    content: "Estabeleça metas financeiras específicas, mensuráveis, atingíveis, relevantes e temporizáveis (SMART).",
    category: "planejamento"
  },
  {
    title: "Invista em você",
    content: "Invista em sua educação e habilidades para aumentar sua capacidade de ganhos a longo prazo.",
    category: "educação"
  },
  {
    title: "Prepare-se para aposentadoria",
    content: "Comece a investir para a aposentadoria o quanto antes, mesmo que seja com pequenas quantias.",
    category: "aposentadoria"
  },
  {
    title: "Seguro adequado",
    content: "Tenha seguros adequados para proteger seu patrimônio e sua família em caso de imprevistos.",
    category: "proteção"
  },
  {
    title: "Evite dívidas ruins",
    content: "Evite dívidas para financiar bens que se depreciam rapidamente. Faça exceções apenas quando necessário.",
    category: "dívidas"
  },
  {
    title: "Cuide da saúde",
    content: "Investir em saúde preventiva economiza muito dinheiro em tratamentos futuros.",
    category: "saúde"
  },
  {
    title: "Reavalie contratos",
    content: "Periodicamente, reavalie contratos como internet, telefone e seguros para buscar melhores condições.",
    category: "economizar"
  },
  {
    title: "Poupar primeiro",
    content: "'Pague-se primeiro': separe uma porcentagem do salário para poupança antes de pagar as contas.",
    category: "poupança"
  },
  {
    title: "Cuidado com compras parceladas",
    content: "Evite parcelar muitas compras simultaneamente. O acúmulo pode comprometer seu orçamento futuro.",
    category: "dívidas"
  },
  {
    title: "Planeje grandes compras",
    content: "Planeje grandes aquisições com antecedência, economizando especificamente para elas.",
    category: "planejamento"
  },
  {
    title: "Entenda juros compostos",
    content: "Compreenda como os juros compostos funcionam tanto para investimentos quanto para dívidas.",
    category: "educação"
  },
  {
    title: "Reduza despesas fixas",
    content: "Reduzir despesas fixas tem impacto maior a longo prazo do que cortar pequenos gastos ocasionais.",
    category: "economizar"
  },
  {
    title: "Aprenda a dizer não",
    content: "Desenvolva a capacidade de dizer não a gastos desnecessários e pressões sociais para consumir.",
    category: "comportamento"
  },
  {
    title: "Análise custo-benefício",
    content: "Antes de gastar, avalie se o benefício que você receberá vale o custo financeiro.",
    category: "comportamento"
  },
  {
    title: "Converse sobre dinheiro",
    content: "Converse abertamente sobre finanças com seu parceiro(a) e família para alinhar objetivos.",
    category: "relacionamento"
  },
  {
    title: "Evite comparações",
    content: "Não compare sua situação financeira com a de outras pessoas. Cada um tem sua própria jornada.",
    category: "comportamento"
  },
  {
    title: "Veja o panorama geral",
    content: "Ao tomar decisões financeiras, considere o impacto de longo prazo, não apenas o benefício imediato.",
    category: "planejamento"
  },
  {
    title: "Use a tecnologia",
    content: "Utilize aplicativos e ferramentas financeiras para facilitar o acompanhamento e controle das suas finanças.",
    category: "educação"
  },
  {
    title: "Pequenas economias importam",
    content: "Economizar em pequenas compras diárias pode gerar uma quantia significativa ao longo do tempo.",
    category: "economizar"
  },
  {
    title: "Equilíbrio é fundamental",
    content: "Busque equilíbrio entre aproveitar o presente e planejar o futuro financeiro.",
    category: "comportamento"
  },
  {
    title: "Tenha um testamento",
    content: "Prepare um testamento e organize seus documentos financeiros para proteger seus entes queridos.",
    category: "proteção"
  },
  {
    title: "Pesquise antes de comprar",
    content: "Pesquise preços e compare alternativas antes de fazer compras significativas.",
    category: "economizar"
  },
  {
    title: "Aprenda a negociar",
    content: "Desenvolva habilidades de negociação para conseguir melhores preços e condições em compras importantes.",
    category: "educação"
  },
  {
    title: "Transforme hobbies em renda",
    content: "Considere transformar passatempos e habilidades em fontes de renda complementar.",
    category: "renda"
  },
  {
    title: "Declutter financeiro",
    content: "Periodicamente, revise e simplifique sua vida financeira eliminando contas, cartões e serviços desnecessários.",
    category: "organização"
  },
  {
    title: "Ensine finanças para crianças",
    content: "Ensine conceitos financeiros básicos às crianças desde cedo para desenvolver uma relação saudável com dinheiro.",
    category: "educação"
  },
  {
    title: "Invista em ESG",
    content: "Considere critérios ambientais, sociais e de governança em seus investimentos para alinhá-los aos seus valores.",
    category: "investimentos"
  },
  {
    title: "Cuidado com lifestyle inflation",
    content: "Evite aumentar seu padrão de vida na mesma proporção que seus rendimentos aumentam.",
    category: "comportamento"
  },
  {
    title: "Tenha um plano de longo prazo",
    content: "Desenvolva um plano financeiro para horizontes de 5, 10 e 20 anos com objetivos claros.",
    category: "planejamento"
  },
  {
    title: "Aposentadoria ativa",
    content: "Planeje uma aposentadoria que inclua atividades produtivas que possam gerar alguma renda complementar.",
    category: "aposentadoria"
  },
  {
    title: "Analise seu perfil de investidor",
    content: "Conheça seu perfil de risco antes de fazer investimentos para evitar decisões inadequadas ao seu perfil.",
    category: "investimentos"
  },
  {
    title: "Repense presentes",
    content: "Considere dar presentes mais significativos e menos caros, ou experiências em vez de objetos.",
    category: "economizar"
  },
  {
    title: "Proteja-se de fraudes",
    content: "Mantenha-se informado sobre golpes financeiros comuns e proteja suas informações pessoais e financeiras.",
    category: "proteção"
  },
  {
    title: "Equilíbrio trabalho-vida",
    content: "Busque um equilíbrio entre trabalho e vida pessoal para evitar custos de saúde associados ao estresse.",
    category: "saúde"
  },
  {
    title: "Cozinhe em casa",
    content: "Cozinhar em casa é significativamente mais econômico e geralmente mais saudável do que comer fora.",
    category: "economizar"
  },
  {
    title: "Consulte um profissional",
    content: "Em decisões financeiras complexas, considere consultar um profissional qualificado.",
    category: "educação"
  },
  {
    title: "Compartilhe recursos",
    content: "Considere compartilhar recursos ou fazer compras coletivas para reduzir custos individuais.",
    category: "economizar"
  },
  {
    title: "Seja grato",
    content: "Pratique a gratidão pelo que você tem, o que pode reduzir a tendência ao consumismo.",
    category: "comportamento"
  },
  {
    title: "Nunca é tarde para começar",
    content: "Independentemente da idade ou situação atual, sempre é possível melhorar sua saúde financeira.",
    category: "motivação"
  }
];

// Dicas gratuitas (primeiras 10)
const freeTips = financialTips.slice(0, 10);

// Para a versão Pro (todas as 50)
const proTips = financialTips;

// Categorias de dicas
const categories = Array.from(new Set(financialTips.map(tip => tip.category)));

// Componente para exibir um card de dica
const TipCard = ({ tip }) => (
  <Card className="h-full">
    <CardHeader className="pb-2">
      <CardTitle className="text-lg">{tip.title}</CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-gray-600">{tip.content}</p>
    </CardContent>
  </Card>
);

const DicasPage = () => {
  const { isPro } = useSubscription();
  const [activeCategory, setActiveCategory] = React.useState("all");

  // Filtrar dicas por categoria
  const filteredTips = React.useMemo(() => {
    const tipsToFilter = isPro ? proTips : freeTips;
    
    if (activeCategory === "all") {
      return tipsToFilter;
    }
    
    return tipsToFilter.filter(tip => tip.category === activeCategory);
  }, [activeCategory, isPro]);

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Dicas Financeiras</h1>
        <p className="text-gray-500">
          {isPro 
            ? "Acesso completo a todas as 50 dicas financeiras para melhorar sua saúde financeira." 
            : "Confira nossas dicas para melhorar sua saúde financeira. Atualize para o plano Pro para acessar todas as 50 dicas."}
        </p>
      </div>

      <div className="mb-6">
        <Tabs defaultValue="all" className="w-full" onValueChange={setActiveCategory}>
          <TabsList className="mb-4 flex flex-wrap gap-1">
            <TabsTrigger value="all">Todas</TabsTrigger>
            {categories.map((category) => (
              <TabsTrigger key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {isPro ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredTips.map((tip, index) => (
            <TipCard key={index} tip={tip} />
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
            {filteredTips.map((tip, index) => (
              <TipCard key={index} tip={tip} />
            ))}
          </div>
          
          <ProFeature>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 opacity-70">
              {proTips.slice(10, 16).map((tip, index) => (
                <TipCard key={index + 10} tip={tip} />
              ))}
            </div>
          </ProFeature>
        </>
      )}
    </div>
  );
};

export default DicasPage;

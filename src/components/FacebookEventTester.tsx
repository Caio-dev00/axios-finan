import type { FC } from 'react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { facebookEvents } from '@/utils/facebookPixel';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

const EVENT_TYPES = [
  { value: 'PageView', label: 'Page View' },
  { value: 'ViewContent', label: 'View Content' },
  { value: 'AddToCart', label: 'Add to Cart' },
  { value: 'Purchase', label: 'Purchase' },
  { value: 'CompleteRegistration', label: 'Complete Registration' },
  { value: 'Subscribe', label: 'Subscribe' },
  { value: 'Lead', label: 'Lead' },
  { value: 'AddPaymentInfo', label: 'Add Payment Info' },
  { value: 'InitiateCheckout', label: 'Initiate Checkout' },
  { value: 'Search', label: 'Search' },
  { value: 'AddTransaction', label: 'Add Transaction' },
  { value: 'CreateBudget', label: 'Create Budget' },
  { value: 'CreateGoal', label: 'Create Goal' },
  { value: 'Login', label: 'Login' },
  { value: 'StartTrial', label: 'Start Trial' }
];

const FacebookEventTester: FC = () => {
  const [eventType, setEventType] = useState('PageView');
  const [email, setEmail] = useState('');
  const [value, setValue] = useState('');
  const [currency, setCurrency] = useState('BRL');
  const [searchString, setSearchString] = useState('');
  const [contentName, setContentName] = useState('');
  const [contentCategory, setContentCategory] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleTestEvent = async () => {
    setIsLoading(true);
    try {
      switch (eventType) {
        case 'PageView':
          facebookEvents.viewPage(email);
          break;
        case 'ViewContent':
          facebookEvents.viewContent(contentName, contentCategory, email);
          break;
        case 'AddToCart':
          facebookEvents.addToCart(Number(value), currency, email);
          break;
        case 'Purchase':
          facebookEvents.purchase(Number(value), currency, email);
          break;
        case 'CompleteRegistration':
          facebookEvents.completeRegistration(email);
          break;
        case 'Subscribe':
          facebookEvents.subscribe(Number(value), currency, email);
          break;
        case 'Lead':
          facebookEvents.lead(Number(value), currency, email);
          break;
        case 'AddPaymentInfo':
          facebookEvents.addPaymentInfo(Number(value), currency, email);
          break;
        case 'InitiateCheckout':
          facebookEvents.initiateCheckout(Number(value), currency, email);
          break;
        case 'Search':
          facebookEvents.search(searchString, email);
          break;
        case 'AddTransaction':
          facebookEvents.addTransaction(email);
          break;
        case 'CreateBudget':
          facebookEvents.createBudget(email);
          break;
        case 'CreateGoal':
          facebookEvents.createGoal(email);
          break;
        case 'Login':
          facebookEvents.login(email);
          break;
        case 'StartTrial':
          facebookEvents.startTrial(email);
          break;
      }

      toast({
        title: 'Sucesso',
        description: 'Evento enviado com sucesso!',
      });
    } catch (error) {
      console.error('Erro ao enviar evento:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao enviar evento. Verifique o console para mais detalhes.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-6 shadow-md">
      <h2 className="text-xl font-bold mb-4">Teste de Eventos do Facebook</h2>
      
      <div className="space-y-4">
        <div>
          <Label htmlFor="event-type">Tipo de Evento</Label>
          <Select value={eventType} onValueChange={setEventType}>
            <SelectTrigger id="event-type">
              <SelectValue placeholder="Selecione o tipo de evento" />
            </SelectTrigger>
            <SelectContent>
              {EVENT_TYPES.map(event => (
                <SelectItem key={event.value} value={event.value}>
                  {event.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="email">Email (opcional)</Label>
          <Input 
            id="email" 
            type="email" 
            placeholder="exemplo@email.com" 
            value={email} 
            onChange={e => setEmail(e.target.value)}
          />
        </div>

        {(eventType === 'Purchase' || eventType === 'Subscribe' || eventType === 'AddToCart') && (
          <>
            <div>
              <Label htmlFor="value">Valor</Label>
              <Input 
                id="value" 
                type="number" 
                placeholder="0.00" 
                value={value} 
                onChange={e => setValue(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="currency">Moeda</Label>
              <Input 
                id="currency" 
                value={currency} 
                onChange={e => setCurrency(e.target.value)}
              />
            </div>
          </>
        )}

        {eventType === 'Search' && (
          <div>
            <Label htmlFor="search">Termo de Busca</Label>
            <Input 
              id="search" 
              value={searchString} 
              onChange={e => setSearchString(e.target.value)}
            />
          </div>
        )}

        {eventType === 'ViewContent' && (
          <>
            <div>
              <Label htmlFor="content-name">Nome do Conteúdo</Label>
              <Input 
                id="content-name" 
                value={contentName} 
                onChange={e => setContentName(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="content-category">Categoria (opcional)</Label>
              <Input 
                id="content-category" 
                value={contentCategory} 
                onChange={e => setContentCategory(e.target.value)}
              />
            </div>
          </>
        )}

        <Button 
          onClick={handleTestEvent} 
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Enviando...
            </>
          ) : 'Enviar Evento de Teste'}
        </Button>
      </div>
    </Card>
  );
};

export default FacebookEventTester; 
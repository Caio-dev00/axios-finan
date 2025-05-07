import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { getUserData } from '@/utils/facebookPixel';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import type { FacebookPixelEvent } from '@/types/facebook-pixel';

interface EventType {
  value: string;
  label: string;
}

interface TestResult {
  success: boolean;
  data?: unknown;
  error?: {
    message?: string;
    error_user_msg?: string;
    error_user_title?: string;
    code?: string;
    error_subcode?: string;
    fbtrace_id?: string;
  };
  details?: unknown;
}

const EVENT_TYPES: EventType[] = [
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

const FacebookApiTest: React.FC = () => {
  const [eventType, setEventType] = useState('PageView');
  const [email, setEmail] = useState('');
  const [value, setValue] = useState('');
  const [currency, setCurrency] = useState('BRL');
  const [searchString, setSearchString] = useState('');
  const [contentName, setContentName] = useState('');
  const [contentCategory, setContentCategory] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<TestResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const getCustomData = (): Record<string, unknown> => {
    const customData: Record<string, unknown> = {
      test_event: true
    };

    switch (eventType) {
      case 'Purchase':
      case 'Subscribe':
      case 'AddToCart':
        customData.value = parseFloat(value);
        customData.currency = currency;
        break;
      case 'Search':
        customData.search_string = searchString;
        break;
      case 'ViewContent':
        customData.content_name = contentName;
        if (contentCategory) {
          customData.content_category = contentCategory;
        }
        break;
    }

    return customData;
  };

  const handleTestEvent = async (): Promise<void> => {
    setIsLoading(true);
    setResult(null);
    setError(null);
    
    try {
      // Prepare user data with email if provided
      const userData = getUserData(email || undefined);
      
      // Define event data
      const eventData: FacebookPixelEvent = {
        eventName: eventType,
        userData,
        customData: getCustomData(),
        eventSourceUrl: window.location.href
      };

      console.log('Sending test event:', eventData);
      
      // Call the edge function
      const { data, error: fnError } = await supabase.functions.invoke('facebook-events', {
        body: eventData
      });
      
      if (fnError) {
        console.error('Edge function error:', fnError);
        throw new Error(`Edge function error: ${fnError.message}`);
      }
      
      console.log('Function response:', data);

      if (!data.success && data.error) {
        setError(`Facebook API Error: ${data.error}`);
        setResult(data.details || {});
        toast({
          title: "Erro na API do Facebook",
          description: data.error,
          variant: "destructive"
        });
      } else {
        setResult(data);
        toast({
          title: "Sucesso",
          description: "Evento enviado com sucesso!",
        });
      }
    } catch (err: unknown) {
      console.error('Test failed:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to send test event';
      setError(errorMessage);
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderErrorDetails = () => {
    if (!result || !error) return null;
    
    // Handle specific Facebook API errors
    if (result.error?.message) {
      return (
        <div className="mt-4 space-y-2">
          <div className="font-medium">Erro do Facebook API:</div>
          <div className="text-sm text-red-600">{result.error.message}</div>
          {result.error.error_user_msg && (
            <div className="text-sm bg-red-50 p-3 rounded">
              <span className="font-medium">Mensagem:</span> {result.error.error_user_msg}
            </div>
          )}
          {result.error.error_user_title && (
            <div className="text-sm">
              <span className="font-medium">Título:</span> {result.error.error_user_title}
            </div>
          )}
          <div className="text-xs text-gray-500">
            Código: {result.error.code}{result.error.error_subcode ? ` (${result.error.error_subcode})` : ''}
            {result.error.fbtrace_id && ` | Trace ID: ${result.error.fbtrace_id}`}
          </div>
        </div>
      );
    }
    
    return null;
  };

  const renderEventFields = () => {
    switch (eventType) {
      case 'Purchase':
      case 'Subscribe':
      case 'AddToCart':
        return (
          <>
            <div>
              <Label htmlFor="value">Valor</Label>
              <Input 
                id="value" 
                type="number" 
                step="0.01"
                placeholder="0.00" 
                value={value} 
                onChange={e => setValue(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="currency">Moeda</Label>
              <Select value={currency} onValueChange={setCurrency}>
                <SelectTrigger id="currency">
                  <SelectValue placeholder="Selecione a moeda" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BRL">BRL</SelectItem>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="EUR">EUR</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        );
      case 'Search':
        return (
          <div>
            <Label htmlFor="search-string">Termo de Busca</Label>
            <Input 
              id="search-string" 
              type="text" 
              placeholder="Digite o termo de busca" 
              value={searchString} 
              onChange={e => setSearchString(e.target.value)}
            />
          </div>
        );
      case 'ViewContent':
        return (
          <>
            <div>
              <Label htmlFor="content-name">Nome do Conteúdo</Label>
              <Input 
                id="content-name" 
                type="text" 
                placeholder="Nome do conteúdo" 
                value={contentName} 
                onChange={e => setContentName(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="content-category">Categoria (opcional)</Label>
              <Input 
                id="content-category" 
                type="text" 
                placeholder="Categoria do conteúdo" 
                value={contentCategory} 
                onChange={e => setContentCategory(e.target.value)}
              />
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <Card className="p-6 shadow-md">
      <h2 className="text-xl font-bold mb-4">Facebook Conversion API Test</h2>
      
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

        {renderEventFields()}

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
        
        {error && (
          <Alert variant="destructive" className="mt-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Erro</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
            {renderErrorDetails()}
          </Alert>
        )}
        
        {result && !error && (
          <Alert variant="default" className="mt-4 border-green-500 bg-green-50 text-green-700">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertTitle className="text-green-600">Sucesso</AlertTitle>
            <AlertDescription className="text-green-700">
              Evento enviado com sucesso!
            </AlertDescription>
          </Alert>
        )}
        
        {result && (
          <div className="mt-4">
            <Label>Resultado:</Label>
            <Textarea 
              value={JSON.stringify(result, null, 2)} 
              className="font-mono text-sm h-40 mt-1"
              readOnly
            />
          </div>
        )}

        <div className="mt-4 text-xs text-gray-500">
          <p>Para verificar os eventos enviados, acesse o <a href="https://business.facebook.com/events_manager/overview" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Facebook Events Manager</a> e verifique se o evento aparece lá.</p>
          <p>Pode demorar alguns minutos para os eventos aparecerem no painel.</p>
        </div>
      </div>
    </Card>
  );
};

export default FacebookApiTest;

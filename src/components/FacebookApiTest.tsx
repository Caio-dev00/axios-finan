
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
import { Loader2, AlertCircle } from 'lucide-react';

const FacebookApiTest = () => {
  const [eventType, setEventType] = useState('PageView');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleTestEvent = async () => {
    setIsLoading(true);
    setResult(null);
    setError(null);
    
    try {
      // Prepare user data with email if provided
      const userData = getUserData(email || undefined);
      
      // Define event data
      const eventData = {
        eventName: eventType,
        userData,
        customData: {
          test_event: true,
          value: eventType === 'Purchase' || eventType === 'Subscribe' ? 49.90 : undefined,
          currency: eventType === 'Purchase' || eventType === 'Subscribe' ? 'BRL' : undefined,
        },
        eventSourceUrl: window.location.href
      };

      console.log('Sending test event:', eventData);
      
      // Call the edge function
      const { data, error } = await supabase.functions.invoke('facebook-events', {
        body: eventData
      });
      
      if (error) {
        throw new Error(`Edge function error: ${error.message}`);
      }
      
      console.log('Function response:', data);

      if (!data.success && data.error) {
        setError(`Facebook API Error: ${data.error}`);
        setResult(data.details || {});
      } else {
        setResult(data);
      }
    } catch (err: any) {
      console.error('Test failed:', err);
      setError(err.message || 'Failed to send test event');
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

  return (
    <Card className="p-6 shadow-md">
      <h2 className="text-xl font-bold mb-4">Facebook Conversion API Test</h2>
      
      <div className="space-y-4">
        <div>
          <Label htmlFor="event-type">Event Type</Label>
          <Select value={eventType} onValueChange={setEventType}>
            <SelectTrigger id="event-type">
              <SelectValue placeholder="Select event type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="PageView">PageView</SelectItem>
              <SelectItem value="ViewContent">ViewContent</SelectItem>
              <SelectItem value="AddToCart">AddToCart</SelectItem>
              <SelectItem value="Purchase">Purchase</SelectItem>
              <SelectItem value="CompleteRegistration">CompleteRegistration</SelectItem>
              <SelectItem value="Subscribe">Subscribe</SelectItem>
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
          <Alert variant="success" className="mt-4 border-green-500 bg-green-50">
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

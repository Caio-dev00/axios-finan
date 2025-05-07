
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { getUserData } from '@/utils/facebookPixel';
import { Textarea } from '@/components/ui/textarea';

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
      
      console.log('Facebook API response:', data);
      setResult(data);
    } catch (err: any) {
      console.error('Test failed:', err);
      setError(err.message || 'Failed to send test event');
    } finally {
      setIsLoading(false);
    }
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
          {isLoading ? 'Enviando...' : 'Enviar Evento de Teste'}
        </Button>
        
        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-300 rounded text-red-700">
            <p className="font-semibold">Erro:</p>
            <p>{error}</p>
          </div>
        )}
        
        {result && (
          <div className="mt-4">
            <Label>Resultado:</Label>
            <Textarea 
              value={JSON.stringify(result, null, 2)} 
              className="font-mono text-sm h-32 mt-1"
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

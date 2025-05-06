
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import axios from 'axios';
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

// Variáveis para armazenar o ID do pixel e token de acesso
const PIXEL_ID = '1354746008979053';
const ACCESS_TOKEN = 'EAARFcJMwR8gBO4amjwuLjT9Km6Fg5dhRV2tzgMZBJOUR3O3gFIBfsaThFsQHow9wtlzLbhoboefI6ZAUYMJSLRDUjWzK1NounYgDFBRkzQSbseZB5ikjoTGhwQYLeeHKWfmZBomZAELZA2yJXbbFnVEU8zRERCVnZBIfVATz4lZCuVY84XeBuycmr4LNJYILhMRNrQZDZD';

const FacebookApiTest: React.FC = () => {
  const [eventName, setEventName] = useState('PageView');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();
  const [customEmail, setCustomEmail] = useState('');

  // Função para obter dados do usuário para a API de Conversão
  const getUserData = (email?: string) => {
    const userEmail = email || user?.email || customEmail;
    
    const userData: Record<string, any> = {
      client_ip_address: '', // Coletado automaticamente pelo Facebook
      client_user_agent: navigator.userAgent,
      fbc: getCookie('_fbc'),
      fbp: getCookie('_fbp'),
      external_id: '' // Pode ser preenchido se o usuário estiver logado
    };
    
    // Adiciona email hasheado se disponível
    if (userEmail) {
      userData.em = [hashData(userEmail.toLowerCase().trim())];
    }
    
    return userData;
  };

  // Função para obter cookies
  const getCookie = (name: string): string => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      return parts.pop()?.split(';').shift() || '';
    }
    return '';
  };

  // Função para hash de dados sensíveis
  const hashData = (data: string): string => {
    console.warn('Hash real deve ser implementado no backend por segurança');
    return data; // Retorna sem hash na implementação frontend
  };

  const sendTestEvent = async () => {
    setLoading(true);
    setResult(null);
    
    try {
      const userData = getUserData();
      
      const eventData = {
        data: [
          {
            event_name: eventName,
            event_time: Math.floor(Date.now() / 1000),
            action_source: 'website',
            event_source_url: window.location.href,
            user_data: userData,
            custom_data: {}
          }
        ],
        access_token: ACCESS_TOKEN
      };

      // Log do payload para depuração
      console.log('Enviando evento:', JSON.stringify(eventData, null, 2));

      // Fazer a requisição HTTP para a API de Conversão
      const response = await axios.post(
        `https://graph.facebook.com/v19.0/${PIXEL_ID}/events`,
        eventData
      );
      
      console.log('Resposta da API:', response.data);
      setResult(JSON.stringify(response.data, null, 2));
      
      toast({
        title: "Evento enviado com sucesso",
        description: `Evento "${eventName}" enviado para a API do Facebook`,
      });
    } catch (error: any) {
      console.error('Erro ao enviar evento:', error);
      setResult(JSON.stringify({
        error: error.message,
        response: error.response?.data
      }, null, 2));
      
      toast({
        title: "Erro ao enviar evento",
        description: error.message || "Ocorreu um erro ao enviar o evento",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Teste da API de Conversão do Facebook</CardTitle>
        <CardDescription>
          Envie eventos de teste para verificar a integração
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="event-type">Tipo de Evento</Label>
            <Select value={eventName} onValueChange={setEventName}>
              <SelectTrigger id="event-type">
                <SelectValue placeholder="Selecione o evento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PageView">PageView</SelectItem>
                <SelectItem value="Lead">Lead</SelectItem>
                <SelectItem value="Purchase">Purchase</SelectItem>
                <SelectItem value="CompleteRegistration">CompleteRegistration</SelectItem>
                <SelectItem value="Subscribe">Subscribe</SelectItem>
                <SelectItem value="AddToCart">AddToCart</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="custom-email">Email personalizado (opcional)</Label>
            <Input 
              id="custom-email"
              type="email"
              placeholder="exemplo@email.com"
              value={customEmail}
              onChange={(e) => setCustomEmail(e.target.value)}
            />
            <p className="text-sm text-gray-500">
              Se não informado, usará o email do usuário logado (se disponível)
            </p>
          </div>

          {result && (
            <div className="mt-4 p-3 bg-gray-50 rounded-md overflow-x-auto">
              <pre className="text-xs text-gray-700">{result}</pre>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full" 
          disabled={loading}
          onClick={sendTestEvent}
        >
          {loading ? "Enviando..." : "Enviar Evento de Teste"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default FacebookApiTest;


/**
 * Utilitário para rastrear eventos do Facebook Pixel e API de Conversão
 */
import axios from 'axios';

// Variável para armazenar o ID do pixel e token de acesso
const PIXEL_ID = '1354746008979053';
const ACCESS_TOKEN = 'EAARFcJMwR8gBO4amjwuLjT9Km6Fg5dhRV2tzgMZBJOUR3O3gFIBfsaThFsQHow9wtlzLbhoboefI6ZAUYMJSLRDUjWzK1NounYgDFBRkzQSbseZB5ikjoTGhwQYLeeHKWfmZBomZAELZA2yJXbbFnVEU8zRERCVnZBIfVATz4lZCuVY84XeBuycmr4LNJYILhMRNrQZDZD';

// Inicializa o Facebook Pixel se ele ainda não estiver carregado
export const initFacebookPixel = () => {
  if (!window.fbq) {
    window.fbq = function() {
      window.fbq.callMethod ? 
        window.fbq.callMethod.apply(window.fbq, arguments) : 
        window.fbq.queue.push(arguments);
    };
    
    if (!window._fbq) window._fbq = window.fbq;
    window.fbq.push = window.fbq;
    window.fbq.loaded = true;
    window.fbq.version = '2.0';
    window.fbq.queue = [];
    
    // Inicializa o pixel com o ID
    window.fbq('init', PIXEL_ID);
  }
};

// Função para hash de dados sensíveis (email, telefone, etc.)
const hashData = (data: string): string => {
  try {
    // Como não podemos usar crypto diretamente no navegador para SHA-256,
    // usamos uma função stub que seria substituída por uma implementação real
    // Em produção, esse hash seria feito no backend
    console.warn('Hash real deve ser implementado no backend por segurança');
    return data; // Retorna sem hash na implementação frontend
  } catch (error) {
    console.error('Erro ao fazer hash dos dados:', error);
    return '';
  }
};

// Função para obter dados adicionais do usuário para a API de Conversão
const getUserData = (email?: string) => {
  const userData: Record<string, any> = {
    client_ip_address: '', // Coletado automaticamente pelo Facebook
    client_user_agent: navigator.userAgent,
    fbc: getCookie('_fbc'),
    fbp: getCookie('_fbp'),
    external_id: '' // Pode ser preenchido se o usuário estiver logado
  };
  
  // Adiciona email hasheado se disponível
  if (email) {
    userData.em = [hashData(email.toLowerCase().trim())];
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

// Envia evento para a API de Conversão do Facebook
const sendToConversionAPI = async (eventName: string, userData: Record<string, any>, customData?: Record<string, any>) => {
  try {
    const eventData = {
      data: [
        {
          event_name: eventName,
          event_time: Math.floor(Date.now() / 1000),
          action_source: 'website',
          event_source_url: window.location.href,
          user_data: userData,
          custom_data: customData || {}
        }
      ],
      access_token: ACCESS_TOKEN
    };

    // Fazer a requisição HTTP real para a API de Conversão
    const response = await axios.post(
      `https://graph.facebook.com/v19.0/${PIXEL_ID}/events`,
      eventData
    );
    
    console.log(`[Facebook Conversion API] Evento enviado com sucesso: ${eventName}`, response.data);
    return response.data;
  } catch (error) {
    console.error('[Facebook Conversion API] Erro ao enviar evento:', error);
    return null;
  }
};

// Função para rastrear evento de conversão personalizado
export const trackFacebookEvent = (eventName: string, eventParams?: Record<string, any>, userEmail?: string) => {
  // Inicializa o pixel caso ainda não tenha sido inicializado
  initFacebookPixel();
  
  if (window.fbq) {
    // Dados do usuário para a API de Conversão
    const userData = getUserData(userEmail);
    
    // Adiciona os dados do usuário aos parâmetros do evento
    const enhancedParams = {
      ...eventParams,
      event_id: 'event_' + Date.now(),
    };
    
    // Rastreia o evento usando o Pixel
    window.fbq('track', eventName, enhancedParams);
    
    // Envia evento para a API de Conversão
    sendToConversionAPI(eventName, userData, eventParams);
    
    console.log(`[Facebook Pixel] Evento rastreado: ${eventName}`, enhancedParams || '');
  } else {
    console.warn('Facebook Pixel não está carregado corretamente');
  }
};

// Eventos comuns pré-definidos
export const facebookEvents = {
  // Eventos de navegação
  viewPage: (userEmail?: string) => trackFacebookEvent('PageView', undefined, userEmail),
  
  // Eventos de registro e autenticação
  completeRegistration: (userEmail?: string) => trackFacebookEvent('CompleteRegistration', undefined, userEmail),
  login: (userEmail?: string) => trackFacebookEvent('Login', undefined, userEmail),
  
  // Eventos de conversão
  startTrial: (userEmail?: string) => trackFacebookEvent('StartTrial', undefined, userEmail),
  subscribe: (value?: number, currency?: string, userEmail?: string) => 
    trackFacebookEvent('Subscribe', { value, currency }, userEmail),
  
  // Eventos de engajamento
  addTransaction: (userEmail?: string) => trackFacebookEvent('AddTransaction', undefined, userEmail),
  createBudget: (userEmail?: string) => trackFacebookEvent('CreateBudget', undefined, userEmail),
  createGoal: (userEmail?: string) => trackFacebookEvent('CreateGoal', undefined, userEmail)
};

// Inicializa o pixel automaticamente quando o arquivo é importado
initFacebookPixel();

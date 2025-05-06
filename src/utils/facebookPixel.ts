
/**
 * Utilitário para rastrear eventos do Facebook Pixel e API de Conversão
 */

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

// Função para obter dados adicionais do usuário para a API de Conversão
const getUserData = () => {
  const userData = {
    client_ip_address: '', // Coletado automaticamente pelo Facebook
    client_user_agent: navigator.userAgent,
    fbc: getCookie('_fbc'),
    fbp: getCookie('_fbp'),
    external_id: '' // Pode ser preenchido se o usuário estiver logado
  };
  
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

// Função para rastrear evento de conversão personalizado
export const trackFacebookEvent = (eventName: string, eventParams?: Record<string, any>) => {
  // Inicializa o pixel caso ainda não tenha sido inicializado
  initFacebookPixel();
  
  if (window.fbq) {
    // Dados do usuário para a API de Conversão
    const userData = getUserData();
    
    // Adiciona os dados do usuário aos parâmetros do evento
    const enhancedParams = {
      ...eventParams,
      event_id: 'event_' + Date.now(),
      ...userData
    };
    
    // Rastreia o evento usando o Pixel
    window.fbq('track', eventName, enhancedParams);
    
    // Envia evento para a API de Conversão (via server-side seria o ideal, mas isso é um exemplo client-side)
    try {
      const eventData = {
        data: [
          {
            event_name: eventName,
            event_time: Math.floor(Date.now() / 1000),
            action_source: 'website',
            event_source_url: window.location.href,
            user_data: userData,
            custom_data: eventParams || {}
          }
        ],
        access_token: ACCESS_TOKEN
      };
      
      // Log para debug (em produção, isso seria enviado via server-side)
      console.log(`[Facebook Conversion API] Evento enviado: ${eventName}`, eventData);
    } catch (error) {
      console.error('[Facebook Conversion API] Erro ao enviar evento:', error);
    }
    
    console.log(`[Facebook Pixel] Evento rastreado: ${eventName}`, enhancedParams || '');
  } else {
    console.warn('Facebook Pixel não está carregado corretamente');
  }
};

// Eventos comuns pré-definidos
export const facebookEvents = {
  // Eventos de navegação
  viewPage: () => trackFacebookEvent('PageView'),
  
  // Eventos de registro e autenticação
  completeRegistration: () => trackFacebookEvent('CompleteRegistration'),
  login: () => trackFacebookEvent('Login'),
  
  // Eventos de conversão
  startTrial: () => trackFacebookEvent('StartTrial'),
  subscribe: (value?: number, currency?: string) => 
    trackFacebookEvent('Subscribe', { value, currency }),
  
  // Eventos de engajamento
  addTransaction: () => trackFacebookEvent('AddTransaction'),
  createBudget: () => trackFacebookEvent('CreateBudget'),
  createGoal: () => trackFacebookEvent('CreateGoal')
};

// Inicializa o pixel automaticamente quando o arquivo é importado
initFacebookPixel();


/**
 * Utilitário para rastrear eventos do Facebook Pixel e API de Conversão
 */

// Variável para armazenar o ID do pixel
const PIXEL_ID = '1354746008979053';

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

// Função para rastrear evento de conversão personalizado
export const trackFacebookEvent = (eventName: string, eventParams?: Record<string, any>) => {
  // Inicializa o pixel caso ainda não tenha sido inicializado
  initFacebookPixel();
  
  if (window.fbq) {
    // Rastreia o evento usando a API de Conversão do Facebook
    window.fbq('track', eventName, eventParams);
    console.log(`[Facebook Pixel] Evento rastreado: ${eventName}`, eventParams || '');
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

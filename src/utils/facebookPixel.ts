
/**
 * Utilitário para rastrear eventos do Facebook Pixel
 */

// Função para rastrear evento de conversão personalizado
export const trackFacebookEvent = (eventName: string, eventParams?: Record<string, any>) => {
  if (window.fbq) {
    window.fbq('track', eventName, eventParams);
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

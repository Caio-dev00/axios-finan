/**
 * Utilitário para rastrear eventos do Facebook Pixel e API de Conversão
 */
import axios from 'axios';
import { supabase } from '@/integrations/supabase/client';
import type { FacebookPixel, FacebookPixelEvent } from '../types/facebook-pixel';

// Variável para armazenar o ID do pixel
const PIXEL_ID = '1354746008979053';

// Cache para deduplicação de eventos
const eventCache = new Map<string, number>();
const CACHE_DURATION = 1000 * 60 * 5; // 5 minutos

// Configuração do retry
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 segundo

// Definindo tipos para os dados
interface UserData {
  client_user_agent: string;
  fbc: string;
  fbp: string;
  external_id: string;
  em?: string[];
  ph?: string[]; // Phone number (will be hashed)
  [key: string]: unknown;
}

interface CustomData {
  value?: number;
  currency?: string;
  search_string?: string;
  content_name?: string;
  content_category?: string;
  event_id?: string;
  event_time?: number;
  [key: string]: unknown;
}

interface EventResponse {
  success: boolean;
  data?: unknown;
  error?: string;
  details?: unknown;
}

interface FailedEvent {
  eventName: string;
  userData: UserData;
  customData?: CustomData;
  timestamp: number;
}

// Garante que todo visitante tenha um external_id único
(function ensureExternalId() {
  if (typeof window !== 'undefined' && window.localStorage) {
    if (!localStorage.getItem('external_id')) {
      const uuid = (typeof crypto !== 'undefined' && crypto.randomUUID)
        ? crypto.randomUUID()
        : '10000000-1000-4000-8000-100000000000'.replace(/[018]/g, c =>
            (Number.parseInt(c) ^ (crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> (Number.parseInt(c) / 4))).toString(16)
          );
      localStorage.setItem('external_id', uuid);
    }
  }
})();

// Inicializa o Facebook Pixel se ele ainda não estiver carregado
export const initFacebookPixel = (): void => {
  if (typeof window === 'undefined') return;
  
  if (!window.fbq) {
    window.fbq = (eventName: string, ...args: unknown[]): void => {
      if (window.fbq.callMethod) {
        window.fbq.callMethod(eventName, ...args);
      } else {
        window.fbq.queue.push([eventName, ...args]);
      }
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
export const getUserData = (email?: string, phone?: string, externalId?: string): UserData => {
  // Buscar email do localStorage se não fornecido
  let userEmail = email;
  if (!userEmail) {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        userEmail = user.email;
      } catch (error) {
        console.error('[Facebook Pixel] Erro ao obter email do usuário:', error);
      }
    }
    // Fallback: buscar do localStorage se ainda não encontrou
    if (!userEmail) {
      userEmail = localStorage.getItem('user_email') || '';
    }
  }

  // Buscar telefone do localStorage se não fornecido
  const userPhone = localStorage.getItem('user_phone') || phone || '';

  // Buscar external_id do localStorage se não fornecido
  let extId = externalId;
  if (!extId) {
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const user = JSON.parse(storedUser);
        extId = user.id || '';
      }
    } catch (e) {
      // Silencia o erro, mas não deixa o bloco vazio
    }
    // Se ainda não encontrou, usa o external_id de visitante
    if (!extId) {
      extId = localStorage.getItem('external_id') || '';
    }
  }

  // Buscar fbc e fbp dos cookies
  const fbc = getCookie('_fbc') || '';
  const fbp = getCookie('_fbp') || '';

  const userData: UserData = {
    client_user_agent: navigator.userAgent,
    fbc: fbc,
    fbp: fbp,
    external_id: extId || '',
  };

  // Adiciona email se disponível (será hasheado no backend)
  if (userEmail) {
    userData.em = [userEmail.toLowerCase().trim()];
  }

  // Adiciona número de telefone se disponível (será hasheado no backend)
  if (userPhone) {
    userData.ph = [userPhone.trim()];
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

// Função para verificar duplicação de eventos
const isEventDuplicate = (eventName: string, eventId: string): boolean => {
  const cacheKey = `${eventName}_${eventId}`;
  const now = Date.now();
  const lastSent = eventCache.get(cacheKey);
  
  if (lastSent && (now - lastSent) < CACHE_DURATION) {
    return true;
  }
  
  eventCache.set(cacheKey, now);
  return false;
};

// Função para limpar cache antigo
const cleanupEventCache = (): void => {
  const now = Date.now();
  for (const [key, timestamp] of eventCache.entries()) {
    if (now - timestamp > CACHE_DURATION) {
      eventCache.delete(key);
    }
  }
};

// Limpa o cache periodicamente
setInterval(cleanupEventCache, CACHE_DURATION);

// Função para retry com delay
const delay = (ms: number): Promise<void> => new Promise(resolve => setTimeout(resolve, ms));

// Envia evento para a API de Conversão do Facebook via edge function
const sendToConversionAPI = async (
  eventName: string, 
  userData: UserData, 
  customData?: CustomData,
  retryCount = 0
): Promise<EventResponse> => {
  try {
    // Gera ID único para o evento
    const eventId = `event_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    
    // Verifica duplicação
    if (isEventDuplicate(eventName, eventId)) {
      console.log('[Facebook Conversion API] Evento duplicado ignorado:', eventName);
      return { success: false };
    }

    // Dados do evento
    const eventData: FacebookPixelEvent = {
      eventName,
      userData,
      customData: {
        ...customData,
        event_id: eventId,
        event_time: Math.floor(Date.now() / 1000)
      },
      eventSourceUrl: window.location.href
    };

    // Chamar a edge function do Supabase
    const { data, error } = await supabase.functions.invoke('facebook-events', {
      body: eventData
    });
    
    if (error) {
      throw error;
    }
    
    console.log('[Facebook Conversion API] Evento enviado com sucesso:', eventName, data);
    return { success: true, data };
  } catch (error) {
    console.error('[Facebook Conversion API] Erro ao enviar evento (tentativa', retryCount + 1, '):', error);
    
    // Implementa retry
    if (retryCount < MAX_RETRIES) {
      await delay(RETRY_DELAY * (2 ** retryCount)); // Exponential backoff
      return sendToConversionAPI(eventName, userData, customData, retryCount + 1);
    }
    
    // Armazena evento falho para retry posterior
    storeFailedEvent(eventName, userData, customData);
    return { success: false };
  }
};

// Armazena eventos falhos para retry posterior
const storeFailedEvent = (
  eventName: string, 
  userData: UserData, 
  customData?: CustomData
): void => {
  try {
    const failedEvents = JSON.parse(localStorage.getItem('fb_failed_events') || '[]') as FailedEvent[];
    failedEvents.push({
      eventName,
      userData,
      customData,
      timestamp: Date.now()
    });
    localStorage.setItem('fb_failed_events', JSON.stringify(failedEvents));
  } catch (error) {
    console.error('[Facebook Conversion API] Erro ao armazenar evento falho:', error);
  }
};

// Tenta reenviar eventos falhos
const retryFailedEvents = async (): Promise<void> => {
  try {
    const failedEvents = JSON.parse(localStorage.getItem('fb_failed_events') || '[]') as FailedEvent[];
    if (failedEvents.length === 0) return;

    const now = Date.now();
    const retryEvents = failedEvents.filter(event => 
      now - event.timestamp < 24 * 60 * 60 * 1000 // 24 horas
    );

    for (const event of retryEvents) {
      await sendToConversionAPI(event.eventName, event.userData, event.customData);
    }

    // Remove eventos processados
    localStorage.setItem('fb_failed_events', JSON.stringify(
      failedEvents.filter(event => 
        now - event.timestamp >= 24 * 60 * 60 * 1000
      )
    ));
  } catch (error) {
    console.error('[Facebook Conversion API] Erro ao reenviar eventos falhos:', error);
  }
};

// Tenta reenviar eventos falhos periodicamente
setInterval(retryFailedEvents, 5 * 60 * 1000); // A cada 5 minutos

// Função para rastrear evento de conversão personalizado
export const trackFacebookEvent = (
  eventName: string, 
  eventParams?: CustomData, 
  userEmail?: string
): void => {
  // Inicializa o pixel caso ainda não tenha sido inicializado
  initFacebookPixel();
  
  // Gerar event_id único para deduplicação
  const event_id = `event_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

  // Buscar telefone e external_id do localStorage
  const userPhone = localStorage.getItem('user_phone') || undefined;
  let externalId: string | undefined = undefined;
  try {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      externalId = user.id || undefined;
    }
  } catch (e) {
    // Silencia o erro
  }

  // Dados do usuário para a API de Conversão
  const userData = getUserData(userEmail, userPhone, externalId);
  
  // Adiciona os dados do usuário aos parâmetros do evento
  const enhancedParams = {
    ...eventParams,
    event_id,
    eventID: event_id, // Passa também como eventID para deduplicação
    // Adiciona email aos parâmetros do evento se disponível
    ...(userData.em && { email: userData.em[0] })
  };
  
  if (window.fbq) {
    window.fbq('track', eventName, enhancedParams); // Passa event_id e eventID nos params
    sendToConversionAPI(eventName, userData, { ...eventParams, event_id }); // Passa o mesmo event_id para a API
    console.log('[Facebook Pixel] Evento rastreado:', eventName, enhancedParams || '');
  } else {
    console.warn('Facebook Pixel não está carregado corretamente');
  }
};

// Eventos comuns pré-definidos
export const facebookEvents = {
  // Eventos de navegação
  viewPage: (userEmail?: string): void => trackFacebookEvent('PageView', undefined, userEmail),
  
  // Eventos de registro e autenticação
  completeRegistration: (userEmail?: string): void => trackFacebookEvent('CompleteRegistration', undefined, userEmail),
  login: (userEmail?: string): void => trackFacebookEvent('Login', undefined, userEmail),
  
  // Eventos de conversão
  startTrial: (userEmail?: string): void => trackFacebookEvent('StartTrial', undefined, userEmail),
  subscribe: (value?: number, currency?: string, userEmail?: string): void => 
    trackFacebookEvent('Subscribe', { value, currency }, userEmail),
  
  // Eventos de engajamento
  addTransaction: (userEmail?: string): void => trackFacebookEvent('AddTransaction', undefined, userEmail),
  createBudget: (userEmail?: string): void => trackFacebookEvent('CreateBudget', undefined, userEmail),
  createGoal: (userEmail?: string): void => trackFacebookEvent('CreateGoal', undefined, userEmail),

  // Novos eventos de conversão
  lead: (value?: number, currency?: string, userEmail?: string): void =>
    trackFacebookEvent('Lead', { value, currency }, userEmail),
  
  addPaymentInfo: (value?: number, currency?: string, userEmail?: string): void =>
    trackFacebookEvent('AddPaymentInfo', { value, currency }, userEmail),
  
  initiateCheckout: (value?: number, currency?: string, userEmail?: string): void =>
    trackFacebookEvent('InitiateCheckout', { value, currency }, userEmail),
  
  search: (searchString: string, userEmail?: string): void =>
    trackFacebookEvent('Search', { search_string: searchString }, userEmail),
  
  purchase: (value: number, currency: string, userEmail?: string): void =>
    trackFacebookEvent('Purchase', { value, currency }, userEmail),
  
  addToCart: (value: number, currency: string, userEmail?: string): void =>
    trackFacebookEvent('AddToCart', { value, currency }, userEmail),
  
  viewContent: (contentName: string, contentCategory?: string, userEmail?: string): void =>
    trackFacebookEvent('ViewContent', { 
      content_name: contentName,
      content_category: contentCategory 
    }, userEmail)
};

// Inicializa o pixel automaticamente quando o arquivo é importado
initFacebookPixel();

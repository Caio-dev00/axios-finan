import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import axios from 'https://esm.sh/axios@1.9.0';
import { crypto } from 'https://deno.land/std@0.168.0/crypto/mod.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Obtenha as variáveis de ambiente
const PIXEL_ID = Deno.env.get('FB_PIXEL_ID') || '1354746008979053'
const ACCESS_TOKEN = Deno.env.get('FB_ACCESS_TOKEN')

// Lista de eventos válidos
const VALID_EVENTS = [
  'PageView',
  'ViewContent',
  'AddToCart',
  'Purchase',
  'CompleteRegistration',
  'Subscribe',
  'Lead',
  'AddPaymentInfo',
  'InitiateCheckout',
  'Search',
  'AddTransaction',
  'CreateBudget',
  'CreateGoal',
  'Login',
  'StartTrial'
];

// Tipos para os dados
interface UserData {
  client_user_agent?: string;
  fbc?: string;
  fbp?: string;
  subscription_id?: string;
  em?: string[];
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

// Função para hash SHA-256
const hashValue = (value: string): string => {
  if (!value) return '';
  
  const encoder = new TextEncoder();
  const data = encoder.encode(value.trim().toLowerCase());
  const hashBuffer = crypto.subtle.digestSync('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  
  return hashHex;
}

// Hash user data following Facebook's requirements
const processUserData = (userData: UserData): UserData => {
  const processed: UserData = { ...userData };
  const nonHashFields = ['client_user_agent', 'fbc', 'fbp', 'subscription_id'];
  
  if (processed.em && Array.isArray(processed.em)) {
    processed.em = processed.em.map(email => hashValue(email));
  }

  Object.keys(processed).forEach(key => {
    if (!nonHashFields.includes(key) && key !== 'em') {
      if (Array.isArray(processed[key])) {
        processed[key] = (processed[key] as string[]).map(val => hashValue(val));
      } else if (processed[key] && typeof processed[key] === 'string') {
        processed[key] = hashValue(processed[key] as string);
      }
    }
  });

  return processed;
}

// Validação de dados do evento
const validateEventData = (eventName: string, customData?: CustomData): string | null => {
  if (!VALID_EVENTS.includes(eventName)) {
    return `Evento inválido: ${eventName}`;
  }

  switch (eventName) {
    case 'Purchase':
    case 'Subscribe':
    case 'AddToCart':
      if (!customData?.value || !customData?.currency) {
        return `Evento ${eventName} requer value e currency`;
      }
      break;
    case 'Search':
      if (!customData?.search_string) {
        return `Evento Search requer search_string`;
      }
      break;
    case 'ViewContent':
      if (!customData?.content_name) {
        return `Evento ViewContent requer content_name`;
      }
      break;
  }

  return null;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { 
      status: 405, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    })
  }

  try {
    const body = await req.json()
    const { eventName, userData, customData, eventSourceUrl } = body
    
    if (!eventName) {
      return new Response(JSON.stringify({ error: 'Event name is required' }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }
    
    if (!ACCESS_TOKEN) {
      return new Response(JSON.stringify({ error: 'Facebook access token is not configured' }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const validationError = validateEventData(eventName, customData);
    if (validationError) {
      return new Response(JSON.stringify({ error: validationError }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const userDataCopy = { ...userData };
    if (!userDataCopy.client_ip_address || userDataCopy.client_ip_address === '') {
      delete userDataCopy.client_ip_address;
    }

    const processedUserData = processUserData(userDataCopy);

    const eventPayload = {
      data: [
        {
          event_name: eventName,
          event_time: Math.floor(Date.now() / 1000),
          action_source: 'website',
          event_source_url: eventSourceUrl || req.headers.get('referer') || '',
          event_id: customData?.event_id || 'event_' + Date.now(),
          user_data: processedUserData,
          custom_data: {
            ...customData,
            content_type: 'product',
            delivery_category: 'home_delivery'
          }
        }
      ],
      access_token: ACCESS_TOKEN,
    }
    
    console.log(`Sending event ${eventName} to Facebook Conversion API`);

    try {
      const response = await axios.post(
        `https://graph.facebook.com/v19.0/${PIXEL_ID}/events`,
        eventPayload,
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          timeout: 5000
        }
      )

      console.log(`Facebook API response:`, JSON.stringify(response.data))

      return new Response(JSON.stringify({
        success: true,
        data: response.data
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    } catch (apiError: unknown) {
      console.error('Facebook API error:', apiError instanceof Error ? apiError.message : 'Unknown error');
      
      const errorMessage = apiError instanceof Error ? apiError.message : 'Facebook API returned an error';
      const errorDetails = apiError instanceof Error ? apiError.message : 'Unknown error';

      return new Response(JSON.stringify({
        success: false,
        error: errorMessage,
        details: errorDetails
      }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }
  } catch (error: unknown) {
    console.error('Error in edge function:', error instanceof Error ? error.message : 'Unknown error');
    
    return new Response(JSON.stringify({
      success: false,
      error: 'Error processing request',
      details: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})

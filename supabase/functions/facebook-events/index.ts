
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import axios from 'https://esm.sh/axios@1.9.0'
import { createHash } from 'https://deno.land/std@0.168.0/crypto/mod.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Obtenha as variáveis de ambiente
const PIXEL_ID = Deno.env.get('FB_PIXEL_ID') || '1354746008979053'
const ACCESS_TOKEN = Deno.env.get('FB_ACCESS_TOKEN')

// Função para hash SHA-256
const hashValue = (value: string): string => {
  if (!value) return '';
  const hash = createHash('sha256');
  hash.update(value.trim().toLowerCase());
  return hash.toString();
}

// Hash user data following Facebook's requirements
const processUserData = (userData: Record<string, any>): Record<string, any> => {
  const processed: Record<string, any> = { ...userData };

  // These fields should NOT be hashed
  const nonHashFields = ['client_user_agent', 'fbc', 'fbp', 'subscription_id'];
  
  // Process email specifically
  if (processed.em && Array.isArray(processed.em)) {
    processed.em = processed.em.map(email => hashValue(email));
  }

  // Process all other fields that require hashing
  Object.keys(processed).forEach(key => {
    if (!nonHashFields.includes(key) && key !== 'em') {
      if (Array.isArray(processed[key])) {
        processed[key] = processed[key].map((val: string) => hashValue(val));
      } else if (processed[key] && typeof processed[key] === 'string') {
        processed[key] = hashValue(processed[key]);
      }
    }
  });

  return processed;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  // Reject non-POST requests
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { 
      status: 405, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    })
  }

  try {
    // Parse the request body
    const body = await req.json()
    const { eventName, userData, customData, eventSourceUrl } = body
    
    if (!eventName) {
      return new Response(JSON.stringify({ error: 'Event name is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }
    
    if (!ACCESS_TOKEN) {
      return new Response(JSON.stringify({ error: 'Facebook access token is not configured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Get the client IP - properly format it for Facebook API
    const clientIp = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || ''

    // Process and hash user data according to Facebook requirements
    const processedUserData = processUserData({
      ...userData,
      client_ip_address: clientIp,
      client_user_agent: req.headers.get('user-agent') || ''
    });

    // Prepare the event payload
    const eventPayload = {
      data: [
        {
          event_name: eventName,
          event_time: Math.floor(Date.now() / 1000),
          action_source: 'website',
          event_source_url: eventSourceUrl || req.headers.get('referer') || '',
          event_id: 'event_' + Date.now(),
          user_data: processedUserData,
          custom_data: customData || {}
        }
      ],
      access_token: ACCESS_TOKEN,
    }
    
    console.log(`Sending event ${eventName} to Facebook Conversion API`);

    try {
      // Send event to Facebook Conversion API
      const response = await axios.post(
        `https://graph.facebook.com/v19.0/${PIXEL_ID}/events`,
        eventPayload
      )

      console.log(`Facebook API response:`, JSON.stringify(response.data))

      return new Response(JSON.stringify({
        success: true,
        data: response.data
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    } catch (apiError) {
      // Log the detailed error for debugging
      console.error('Facebook API error:', apiError.response?.data || apiError.message);
      
      return new Response(JSON.stringify({
        success: false,
        error: 'Facebook API returned an error',
        details: apiError.response?.data || apiError.message
      }), {
        status: 200, // Always return 200 to the client
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }
  } catch (error) {
    console.error('Error in edge function:', error);
    
    return new Response(JSON.stringify({
      success: false,
      error: 'Error processing request',
      details: error.message
    }), {
      status: 200, // Return 200 even for internal errors
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})

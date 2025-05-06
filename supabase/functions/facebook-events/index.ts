
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import axios from 'https://esm.sh/axios@1.9.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Obtenha as variáveis de ambiente
const PIXEL_ID = Deno.env.get('FB_PIXEL_ID') || '1354746008979053'
const ACCESS_TOKEN = Deno.env.get('FB_ACCESS_TOKEN')

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

    // Prepare the event payload
    const eventPayload = {
      data: [
        {
          event_name: eventName,
          event_time: Math.floor(Date.now() / 1000),
          action_source: 'website',
          event_source_url: eventSourceUrl || req.headers.get('referer') || '',
          event_id: 'event_' + Date.now(),
          user_data: userData || {},
          custom_data: customData || {}
        }
      ],
      access_token: ACCESS_TOKEN,
    }
    
    console.log(`Sending event ${eventName} to Facebook Conversion API`)

    // Send event to Facebook Conversion API
    const response = await axios.post(
      `https://graph.facebook.com/v19.0/${PIXEL_ID}/events`,
      eventPayload
    )

    return new Response(JSON.stringify({
      success: true,
      data: response.data
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  } catch (error) {
    console.error('Error sending event to Facebook:', error)
    
    return new Response(JSON.stringify({
      error: 'Failed to send event to Facebook',
      details: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})

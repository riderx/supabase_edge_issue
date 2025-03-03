import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'

Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  try {
    const { filename, contentType } = await req.json()
    
    if (!filename || !contentType) {
      return new Response('Missing filename or contentType', { status: 400 })
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          persistSession: false,
        }
      }
    )

    const { data, error } = await supabaseClient
      .storage
      .from('uploads')
      .createSignedUploadUrl(filename)

    if (error) {
      throw error
    }

    return new Response(JSON.stringify(data), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}) 

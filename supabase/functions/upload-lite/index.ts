import { S3Client } from '@bradenmacdonald/s3-lite-client'

import 'jsr:@supabase/functions-js/edge-runtime.d.ts'

Deno.serve(async (req: Request) => {
  const s3Client = new S3Client({
    endPoint: Deno.env.get('AWS_ENDPOINT') || '',
    region: Deno.env.get('AWS_REGION') || 'us-east-1',
    accessKey: Deno.env.get('AWS_ACCESS_KEY_ID') || '',
    secretKey: Deno.env.get('AWS_SECRET_ACCESS_KEY') || '',
  })

  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  try {
    const { filename, contentType } = await req.json()
    
    if (!filename || !contentType) {
      return new Response('Missing filename or contentType', { status: 400 })
    }

    const url = await s3Client.presignedGetObject(filename, { bucketName: Deno.env.get('AWS_BUCKET_NAME') || '', expirySeconds: 3600 })

    return new Response(JSON.stringify({ signedUrl: url, path: filename }), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error: unknown) {
    console.log("Error", error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}) 

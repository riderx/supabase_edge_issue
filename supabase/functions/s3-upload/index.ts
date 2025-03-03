// ANy of this import would work
// import { S3Client, PutObjectCommand } from 'https://esm.sh/@aws-sdk/client-s3@3.758.0?target=deno'
// import { getSignedUrl } from 'https://esm.sh/@aws-sdk/s3-request-presigner@3.758.0?target=deno'
// import { S3Client, PutObjectCommand } from 'https://esm.sh/@aws-sdk/client-s3@3.758.0.0'
// import { getSignedUrl } from 'https://esm.sh/@aws-sdk/s3-request-presigner@3.758.0'
import { S3Client, PutObjectCommand } from 'npm:@aws-sdk/client-s3@3.758.0'
import { getSignedUrl } from 'npm:@aws-sdk/s3-request-presigner@3.758.0'
// import { S3Client, PutObjectCommand } from 'https://jspm.dev/@aws-sdk/client-s3@3.758.0.0'
// import { getSignedUrl } from 'https://jspm.dev/@aws-sdk/s3-request-presigner@3.758.0'

import 'jsr:@supabase/functions-js/edge-runtime.d.ts'

Deno.serve(async (req: Request) => {

  const s3Client = new S3Client({
    endpoint: Deno.env.get('AWS_ENDPOINT') || '',
    region: Deno.env.get('AWS_REGION') || 'us-east-1',
    credentials: {
      accessKeyId: Deno.env.get('AWS_ACCESS_KEY_ID') || '',
      secretAccessKey: Deno.env.get('AWS_SECRET_ACCESS_KEY') || '',
    },
  })

  console.log('AWS_ACCESS_KEY_ID', Deno.env.get('AWS_ACCESS_KEY_ID'))

  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  try {
    const { filename, contentType } = await req.json()
    if (!filename || !contentType) {
      return new Response('Missing filename or contentType', { status: 400 })
    }
    const command = new PutObjectCommand({
      Bucket: Deno.env.get('AWS_BUCKET_NAME') || '',
      Key: filename,
      ContentType: contentType,
    })
    const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 })
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

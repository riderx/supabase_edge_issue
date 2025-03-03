import { describe, it, expect } from 'vitest'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL || 'http://127.0.0.1:54321',
  process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0'
)

describe('Storage Upload', () => {
  it('should generate signed URL and upload file', async () => {
    const testData = 'Hello, World!'
    const filename = `test-${Date.now()}.txt`

    // Get signed URL
    const { data, error } = await supabase.functions.invoke('upload-lite', {
      body: { filename, contentType: 'text/plain' }
    })

    expect(error).toBeNull()
    expect(data.signedUrl).toBeDefined()
    expect(typeof data.signedUrl).toBe('string')
    expect(data.path).toBeDefined()
    expect(typeof data.path).toBe('string')

    // Upload file using signed URL
    const uploadResponse = await fetch(data.signedUrl, {
      method: 'PUT',
      body: testData,
      headers: {
        'Content-Type': 'text/plain'
      }
    })

    expect(uploadResponse.ok).toBe(true)
    expect(uploadResponse.status).toBe(200)

    // Verify the file exists
    const { data: fileData, error: fileError } = await supabase
      .storage
      .from('uploads')
      .download(data.path)

    expect(fileError).toBeNull()
    expect(fileData).toBeDefined()
    const text = await fileData?.text()
    expect(text).toBe(testData)
  })
}) 

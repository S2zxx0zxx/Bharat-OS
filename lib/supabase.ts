import { createClient, SupabaseClient } from '@supabase/supabase-js'

let _client: SupabaseClient | null = null

export function getSupabaseClient(): SupabaseClient {
  if (!_client) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!url || !key) {
      throw new Error('Missing Supabase environment variables')
    }

    _client = createClient(url, key)
  }
  return _client
}

// Convenience export for client-side usage
export const supabase = {
  get client() {
    return getSupabaseClient()
  },
}

// Server-side admin client (only use in API routes — never expose service key to client)
export function getSupabaseAdmin(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_KEY

  if (!url || !serviceKey) {
    throw new Error('Missing Supabase admin environment variables')
  }

  return createClient(url, serviceKey)
}

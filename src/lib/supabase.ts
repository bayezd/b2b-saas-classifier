import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export type Company = {
  id: string
  name: string
  domain: string
  classification: string
  confidence: number
  metadata: Record<string, any>
  created_at: string
}

export type BatchJob = {
  id: string
  total_companies: number
  processed_count: number
  status: 'pending' | 'processing' | 'completed' | 'failed'
  created_at: string
  completed_at: string | null
}

export type UserContact = {
  id: string
  name: string
  email: string
  company_name: string
  created_at: string
}

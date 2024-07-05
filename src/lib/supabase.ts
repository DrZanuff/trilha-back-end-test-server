import { env } from '@/env'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = env.DATABASE_URL
const supabaseKey = env.SUPABASE_KEY
export const supabase = createClient(supabaseUrl, supabaseKey || '')

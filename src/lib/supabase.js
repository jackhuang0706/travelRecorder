import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// 未設定環境變數時以示範模式執行(前台顯示範例資料,後台無法登入)
export const supabase = url && anonKey ? createClient(url, anonKey) : null
export const isDemoMode = !supabase

export const MEDIA_BUCKET = 'travel-media'

export async function fetchMarkers() {
  const { data, error } = await supabase
    .from('markers')
    .select('*, media(*)')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

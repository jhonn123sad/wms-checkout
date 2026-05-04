import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing env vars')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function check() {
  const { data, error } = await supabase
    .from('checkouts')
    .select('slug, design_key')
    .eq('slug', 'comunidade-wms')
    .single()
  
  if (error) {
    console.error('Error:', error)
  } else {
    console.log('Result:', data)
  }
}

check()

import { createClient } from '@supabase/supabase-js'

console.log("[DEBUG] Supabase URL:", process.env.REACT_APP_SUPABASE_URL);
console.log("[DEBUG] Supabase Key:", process.env.REACT_APP_SUPABASE_KEY);
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_KEY;
if (!supabaseUrl || !supabaseKey) {
    throw new Error("¡Las variables de entorno no están definidas!");
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
    db: { schema: 'public' },
    auth: { persistSession: true },
    global: { headers: { 'x-my-custom-header': 'my-app-name' } }
})
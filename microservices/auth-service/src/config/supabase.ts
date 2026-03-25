import { createClient } from '@supabase/supabase-js';

const getSupabase = () => {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
        throw new Error("❌ SUPABASE_URL and SUPABASE_ANON_KEY must be provided in Vault/Environment.");
    }

    return createClient(supabaseUrl, supabaseKey);
};

export const supabase = getSupabase();
export default supabase;

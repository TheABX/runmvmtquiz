import { createClient } from '@supabase/supabase-js';

export async function testSupabaseConnection() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  console.log('Testing Supabase connection...');
  console.log('URL:', supabaseUrl ? `${supabaseUrl.substring(0, 30)}...` : 'MISSING');
  console.log('Key:', supabaseAnonKey ? `${supabaseAnonKey.substring(0, 20)}...` : 'MISSING');

  if (!supabaseUrl || !supabaseAnonKey) {
    return { success: false, error: 'Missing environment variables' };
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    // Test a simple auth call
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('Supabase error:', error);
      return { success: false, error: error.message };
    }
    
    return { success: true, data };
  } catch (err: any) {
    console.error('Connection error:', err);
    return { success: false, error: err.message };
  }
}



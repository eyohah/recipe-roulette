// Safely expose Supabase config to frontend
export default async function handler(req, res) {
  // Allow CORS for frontend
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase env vars:', { 
      hasUrl: !!supabaseUrl, 
      hasKey: !!supabaseKey 
    });
    return res.status(500).json({ 
      error: 'Supabase not configured',
      message: 'Please set SUPABASE_URL and SUPABASE_ANON_KEY in Vercel environment variables'
    });
  }

  // Return only the public anon key (safe to expose)
  res.status(200).json({
    SUPABASE_URL: supabaseUrl,
    SUPABASE_ANON_KEY: supabaseKey
  });
}


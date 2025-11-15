import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
}

const supabase = supabaseUrl && supabaseKey 
  ? createClient(supabaseUrl, supabaseKey)
  : null;

export default async function handler(req, res) {
  // For now, we'll use a simple user_id from query or default to 'anonymous'
  // In production, this should come from authenticated JWT token
  const userId = req.query.user_id || 'anonymous';
  
  try {
    if (req.method === 'GET') {
      // Get all favorites for user
      if (!supabase) {
        // Fallback: return empty array if Supabase not configured
        return res.status(200).json([]);
      }

      const { data, error } = await supabase
        .from('favorites')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase error:', error);
        return res.status(500).json({ error: 'Failed to fetch favorites' });
      }

      return res.status(200).json(data || []);
    }

    if (req.method === 'POST') {
      // Add a favorite
      const { meal_id, meal_name, meal_thumb } = req.body;

      if (!meal_id || !meal_name) {
        return res.status(400).json({ error: 'meal_id and meal_name are required' });
      }

      if (!supabase) {
        // Fallback: return success but don't actually save
        return res.status(201).json({ 
          id: 'local',
          user_id: userId,
          meal_id,
          meal_name,
          meal_thumb,
          created_at: new Date().toISOString()
        });
      }

      const { data, error } = await supabase
        .from('favorites')
        .insert({
          user_id: userId,
          meal_id,
          meal_name,
          meal_thumb: meal_thumb || null
        })
        .select()
        .single();

      if (error) {
        // Check if it's a duplicate
        if (error.code === '23505') {
          return res.status(409).json({ error: 'Favorite already exists' });
        }
        console.error('Supabase error:', error);
        return res.status(500).json({ error: 'Failed to save favorite' });
      }

      return res.status(201).json(data);
    }

    if (req.method === 'DELETE') {
      // Remove a favorite
      // Support both query param and URL path param
      const meal_id = req.query.meal_id || (req.url && req.url.split('/').pop());

      if (!meal_id) {
        return res.status(400).json({ error: 'meal_id is required' });
      }

      if (!supabase) {
        return res.status(200).json({ success: true, message: 'Favorite removed' });
      }

      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('user_id', userId)
        .eq('meal_id', meal_id);

      if (error) {
        console.error('Supabase error:', error);
        return res.status(500).json({ error: 'Failed to delete favorite' });
      }

      return res.status(200).json({ success: true, message: 'Favorite removed' });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Server error' });
  }
}


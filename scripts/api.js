// Get auth token for API calls
async function getAuthToken() {
  try {
    const { getSessionToken } = await import('./auth.js');
    return await getSessionToken();
  } catch (e) {
    return null;
  }
}

// Simple wrappers for our backend endpoints
export async function getLists() {
  const r = await fetch('/api/lists');
  if (!r.ok) throw new Error('Failed to fetch lists');
  return r.json();
}

export async function spin(params = {}) {
  const q = new URLSearchParams(params);
  const r = await fetch(`/api/spin?${q.toString()}`);
  if (!r.ok) throw new Error('Spin failed');
  return r.json();
}

export async function getFavorites() {
  const token = await getAuthToken();
  if (!token) throw new Error('Not authenticated');
  
  const r = await fetch('/api/favorites', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  if (!r.ok) {
    if (r.status === 401) throw new Error('Please sign in to view favorites');
    throw new Error('Failed to fetch favorites');
  }
  return r.json();
}

export async function saveFavorite(meal) {
  const token = await getAuthToken();
  if (!token) throw new Error('Not authenticated');
  
  const r = await fetch('/api/favorites', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      meal_id: meal.id,
      meal_name: meal.name,
      meal_thumb: meal.thumb
    })
  });
  if (!r.ok) {
    if (r.status === 401) throw new Error('Please sign in to save favorites');
    if (r.status === 409) throw new Error('Already in favorites');
    throw new Error('Failed to save favorite');
  }
  return r.json();
}

export async function deleteFavorite(mealId) {
  const token = await getAuthToken();
  if (!token) throw new Error('Not authenticated');
  
  const r = await fetch(`/api/favorites?meal_id=${encodeURIComponent(mealId)}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  if (!r.ok) {
    if (r.status === 401) throw new Error('Please sign in');
    if (r.status === 404) throw new Error('Favorite not found');
    throw new Error('Failed to delete favorite');
  }
  return r.json();
}
  
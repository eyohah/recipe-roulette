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

export async function getFavorites(userId = 'anonymous') {
  const r = await fetch(`/api/favorites?user_id=${encodeURIComponent(userId)}`);
  if (!r.ok) throw new Error('Failed to fetch favorites');
  return r.json();
}

export async function saveFavorite(meal, userId = 'anonymous') {
  const r = await fetch('/api/favorites', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      meal_id: meal.id,
      meal_name: meal.name,
      meal_thumb: meal.thumb
    })
  });
  if (!r.ok) {
    if (r.status === 409) throw new Error('Already in favorites');
    throw new Error('Failed to save favorite');
  }
  return r.json();
}

export async function deleteFavorite(mealId, userId = 'anonymous') {
  const r = await fetch(`/api/favorites?meal_id=${encodeURIComponent(mealId)}&user_id=${encodeURIComponent(userId)}`, {
    method: 'DELETE'
  });
  if (!r.ok) {
    if (r.status === 404) throw new Error('Favorite not found');
    throw new Error('Failed to delete favorite');
  }
  return r.json();
}
  
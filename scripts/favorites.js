import { getFavorites, deleteFavorite } from './api.js';
import { initSupabase } from './auth.js';

const grid = document.getElementById('grid');
const empty = document.getElementById('empty');

// Wait for auth to be initialized before loading favorites
async function init() {
  try {
    // Make sure Supabase is initialized
    const res = await fetch('/api/config');
    const config = await res.json();
    initSupabase(config.SUPABASE_URL, config.SUPABASE_ANON_KEY);
    
    // Small delay to ensure auth is ready
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const favs = await getFavorites();
    if (!favs.length) {
      empty.classList.remove('hidden');
      return;
    }
    grid.innerHTML = favs.map(f => Tile(f)).join('');
    grid.addEventListener('click', (e) => {
      // Check if click is on Remove button
      const btn = e.target.closest('button[data-id]');
      if (btn) {
        e.stopPropagation(); // Prevent tile click
        const id = btn.getAttribute('data-id');
        removeFavorite(id);
        return;
      }
      
      // Otherwise, check if click is on tile (but not button)
      const tile = e.target.closest('.tile[data-meal-id]');
      if (tile) {
        const mealId = tile.getAttribute('data-meal-id');
        window.location.href = `/meal.html?id=${encodeURIComponent(mealId)}`;
      }
    });
  } catch (e) {
    console.error('Failed to load favorites:', e);
    empty.classList.remove('hidden');
    empty.textContent = `Failed to load favorites: ${e.message || 'Please try again.'}`;
  }
}

// Export init so it can be called after auth is ready
export { init as loadFavorites };

// Auto-init after page loads and auth is ready
(async () => {
  // Wait for page to load
  if (document.readyState === 'loading') {
    await new Promise(resolve => {
      document.addEventListener('DOMContentLoaded', resolve);
    });
  }
  
  // Wait for auth guard to complete (it runs in the HTML)
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Now try to load favorites
  init();
})();

function Tile(f) {
  return `
    <div class="tile animate__animated animate__fadeIn" data-meal-id="${f.meal_id}">
      <img src="${f.meal_thumb || f.thumb}" alt="${escapeHtml(f.meal_name || f.name)}" />
      <div class="p">
        <div>${escapeHtml(f.meal_name || f.name)}</div>
        <button class="btn" data-id="${f.meal_id}" style="margin-top:8px">Remove</button>
      </div>
    </div>
  `;
}

async function removeFavorite(id) {
  try {
    await deleteFavorite(id);
    // Remove from DOM with animation
    const tile = document.querySelector(`[data-meal-id="${id}"]`);
    if (tile) {
      tile.classList.add('animate__animated', 'animate__fadeOut');
      setTimeout(() => {
        tile.remove();
        const remaining = document.querySelectorAll('.tile').length;
        if (remaining === 0) {
          empty.classList.remove('hidden');
        }
      }, 500);
    } else {
      location.reload();
    }
  } catch (e) {
    alert('Failed to remove favorite. Please try again.');
  }
}

function escapeHtml(s='') {
  return s.replace(/[&<>"']/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

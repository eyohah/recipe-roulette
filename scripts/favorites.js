import { getFavorites, deleteFavorite } from './api.js';

const grid = document.getElementById('grid');
const empty = document.getElementById('empty');

init();

async function init() {
  try {
    const favs = await getFavorites();
    if (!favs.length) {
      empty.classList.remove('hidden');
      return;
    }
    grid.innerHTML = favs.map(f => Tile(f)).join('');
    grid.addEventListener('click', (e) => {
      const btn = e.target.closest('button[data-id]');
      if (!btn) return;
      const id = btn.getAttribute('data-id');
      removeFavorite(id);
    });
  } catch (e) {
    console.error('Failed to load favorites:', e);
    empty.classList.remove('hidden');
    empty.textContent = 'Failed to load favorites. Please try again.';
  }
}

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

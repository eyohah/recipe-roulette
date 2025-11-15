import { getLists, spin, saveFavorite } from './api.js';

const categorySel = document.getElementById('category');
const areaSel = document.getElementById('area');
const includeInput = document.getElementById('include');
const spinBtn = document.getElementById('spinBtn');
const resultEl = document.getElementById('result');

init();

async function init() {
  await loadLists();
  spinBtn.addEventListener('click', onSpin);
}

async function loadLists() {
  try {
    const { categories, areas } = await getLists();
    for (const c of categories) {
      const opt = document.createElement('option');
      opt.value = c; opt.textContent = c;
      categorySel.appendChild(opt);
    }
    for (const a of areas) {
      const opt = document.createElement('option');
      opt.value = a; opt.textContent = a;
      areaSel.appendChild(opt);
    }
  } catch (e) {
    console.error(e);
  }
}

async function onSpin() {
  resultEl.classList.remove('hidden');
  resultEl.innerHTML = `<div class="muted animate__animated animate__pulse">Finding something tasty...</div>`;
  try {
    const params = {};
    if (includeInput.value.trim()) params.include = includeInput.value.trim();
    if (categorySel.value) params.category = categorySel.value;
    if (areaSel.value) params.area = areaSel.value;

    const meal = await spin(params);
    resultEl.classList.add('animate__animated', 'animate__fadeIn');
    renderMeal(meal);
  } catch (e) {
    console.error(e);
    resultEl.innerHTML = `<div class="muted">No meal found. Try different filters.</div>`;
  }
}

function renderMeal(m) {
  const tags = (m.tags || []).map(t => `<span class="badge">#${t}</span>`).join(' ');
  const ing = m.ingredients.map(i => `<li>${escapeHtml(i.measure)} ${escapeHtml(i.name)}</li>`).join('');
  const steps = m.instructions.map(s => `<li>${escapeHtml(s)}</li>`).join('');

  resultEl.innerHTML = `
    <div class="result-header">
      <img src="${m.thumb}" alt="${escapeHtml(m.name)}" />
      <div>
        <h2>${escapeHtml(m.name)}</h2>
        <div class="muted">${escapeHtml(m.area || '')} ${m.area && m.category ? '•' : ''} ${escapeHtml(m.category || '')}</div>
        <div style="margin-top:8px">${tags || ''}</div>
        <div class="actions">
          <button class="btn" id="saveBtn">♥ Save</button>
          <button class="btn" id="respins">Re-spin</button>
          ${m.sourceUrl ? `<a class="btn" href="${m.sourceUrl}" target="_blank" rel="noopener">Source</a>` : ''}
          ${m.youtubeUrl ? `<a class="btn" href="${m.youtubeUrl}" target="_blank" rel="noopener">YouTube</a>` : ''}
        </div>
      </div>
    </div>

    <h3>Ingredients</h3>
    <ul class="list">${igClean(ing)}</ul>

    <h3>Instructions</h3>
    <ol class="list">${steps}</ol>
  `;

  document.getElementById('respins').addEventListener('click', onSpin);
  document.getElementById('saveBtn').addEventListener('click', () => saveFavoriteHandler(m));
}

async function saveFavoriteHandler(m) {
  try {
    await saveFavorite(m);
    // Show success message with animation
    const btn = document.getElementById('saveBtn');
    if (btn) {
      btn.textContent = '✓ Saved!';
      btn.classList.add('animate__animated', 'animate__pulse');
      setTimeout(() => {
        btn.textContent = '♥ Save';
        btn.classList.remove('animate__animated', 'animate__pulse');
      }, 2000);
    }
  } catch (e) {
    if (e.message === 'Already in favorites') {
      alert('This recipe is already in your favorites!');
    } else {
      alert('Failed to save favorite. Please try again.');
    }
  }
}

// Tiny sanitizers for text
function escapeHtml(s='') {
  return s.replace(/[&<>"']/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

// Remove stray "null"/"undefined" lines
function igClean(html) { return html.replaceAll('null', '').replaceAll('undefined',''); }

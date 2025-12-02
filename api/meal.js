export default async function handler(req, res) {
  try {
    const { id } = req.query || {};
    
    if (!id) {
      return res.status(400).json({ error: 'Meal ID is required' });
    }

    const base = 'https://www.themealdb.com/api/json/v1/1';
    const r = await fetch(`${base}/lookup.php?i=${encodeURIComponent(id)}`);
    const data = await r.json();
    
    if (!data.meals || data.meals.length === 0) {
      return res.status(404).json({ error: 'Meal not found' });
    }

    return res.status(200).json(normalizeMeal(data.meals[0]));
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Server error' });
  }
}

function normalizeMeal(m) {
  if (!m) return null;

  const ingredients = [];
  for (let i = 1; i <= 20; i++) {
    const name = (m[`strIngredient${i}`] || '').trim();
    const measure = (m[`strMeasure${i}`] || '').trim();
    if (name) ingredients.push({ name, measure });
  }

  const steps = (m.strInstructions || '')
    .split('\n')
    .map(s => s.trim())
    .filter(Boolean);

  const tags = (m.strTags || '')
    .split(',')
    .map(s => s.trim())
    .filter(Boolean);

  return {
    id: m.idMeal,
    name: m.strMeal,
    category: m.strCategory,
    area: m.strArea,
    thumb: m.strMealThumb,
    youtubeUrl: m.strYoutube,
    sourceUrl: m.strSource,
    tags,
    ingredients,
    instructions: steps
  };
}


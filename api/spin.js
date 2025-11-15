export default async function handler(req, res) {
    try {
      const { area, category, include } = req.query || {};
      const base = 'https://www.themealdb.com/api/json/v1/1';
  
      // No filters → random
      if (!area && !category && !include) {
        const r = await fetch(`${base}/random.php`);
        const data = await r.json();
        return res.status(200).json(normalizeMeal(data.meals?.[0]));
      }
  
      // Choose a single filter (priority: include > category > area)
      let filterUrl = null;
      if (include) filterUrl = `${base}/filter.php?i=${encodeURIComponent(include)}`;
      else if (category) filterUrl = `${base}/filter.php?c=${encodeURIComponent(category)}`;
      else if (area) filterUrl = `${base}/filter.php?a=${encodeURIComponent(area)}`;
  
      const fr = await fetch(filterUrl);
      const fdata = await fr.json();
      const list = fdata.meals || [];
      if (!list.length) return res.status(404).json({ error: 'No meals found' });
  
      const pick = list[Math.floor(Math.random() * list.length)];
      const lr = await fetch(`${base}/lookup.php?i=${pick.idMeal}`);
      const ldata = await lr.json();
  
      return res.status(200).json(normalizeMeal(ldata.meals?.[0]));
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
  
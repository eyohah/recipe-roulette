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
  
  const steps = cleanInstructions(m.strInstructions || '');
  
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

function cleanInstructions(instructions) {
  if (!instructions) return [];
  
  // Split by newlines and clean each line
  let lines = instructions
    .split('\n')
    .map(s => s.trim())
    .filter(Boolean);
  
  // Clean up each line
  lines = lines.map(line => {
    // Remove checkbox characters (☐, ☑, ✓, ☒, and similar Unicode box characters)
    line = line.replace(/[☐☑✓☒☓□■▢▣▤▥▦▧▨▩▪▫▬▭▮▯▰▱]/g, '').trim();
    
    // Remove redundant step labels like "step 1", "step 2", "Step 1:", etc. (but keep the content)
    line = line.replace(/^(step\s*\d+|Step\s*\d+)[:.\s]+/i, '');
    
    // Remove leading/trailing dashes or bullets that are just formatting
    line = line.replace(/^[-•]\s+/, '').replace(/\s+[-•]$/, '');
    
    return line.trim();
  });
  
  // Filter out empty lines and lines that are just numbers, checkboxes, or step labels
  lines = lines.filter(line => {
    if (!line) return false;
    
    // Remove lines that are just step labels (like "step 1", "Step 2", etc.)
    if (/^(step\s*\d+|Step\s*\d+)[:.\s]*$/i.test(line)) return false;
    
    // Remove lines that are just numbers with punctuation
    if (/^\d+[.)]\s*$/.test(line)) return false;
    
    // Remove lines that are too short and don't contain meaningful words
    const wordCount = line.split(/\s+/).filter(w => w.length > 1).length;
    if (wordCount === 0) return false;
    
    return true;
  });
  
  // Merge lines that start with lowercase (likely continuations of previous step)
  const merged = [];
  for (let i = 0; i < lines.length; i++) {
    const current = lines[i];
    const prev = merged[merged.length - 1];
    
    // If current line starts with lowercase (and isn't a new sentence), merge with previous
    if (prev && current && /^[a-z]/.test(current) && !current.match(/^[a-z]\.\s/)) {
      merged[merged.length - 1] = prev + ' ' + current;
    } else {
      merged.push(current);
    }
  }
  
  return merged;
}
  
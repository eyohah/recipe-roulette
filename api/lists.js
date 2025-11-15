export default async function handler(req, res) {
    try {
      const base = 'https://www.themealdb.com/api/json/v1/1';
  
      const [catsR, areasR] = await Promise.all([
        fetch(`${base}/list.php?c=list`).then(r => r.json()),
        fetch(`${base}/list.php?a=list`).then(r => r.json())
      ]);
  
      const categories = (catsR.meals || []).map(x => x.strCategory).filter(Boolean);
      const areas = (areasR.meals || []).map(x => x.strArea).filter(Boolean);
  
      res.status(200).json({ categories, areas });
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: 'Failed to load lists' });
    }
  }
  
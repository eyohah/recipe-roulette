# Quick Start Guide

## 🚀 Get Running in 5 Minutes

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Supabase (One-Time Setup)

1. Go to [supabase.com](https://supabase.com) → Create Project
2. In SQL Editor, run:
```sql
CREATE TABLE favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT DEFAULT 'anonymous',
  meal_id TEXT NOT NULL,
  meal_name TEXT NOT NULL,
  meal_thumb TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, meal_id)
);

ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all" ON favorites FOR ALL USING (true);
```

3. Get credentials: Settings → API → Copy URL and anon key

### 3. Create .env File
```bash
echo "SUPABASE_URL=your_url_here" > .env
echo "SUPABASE_ANON_KEY=your_key_here" >> .env
```

### 4. Run Locally
```bash
npm run dev
```

Open http://localhost:3000

### 5. Deploy to Vercel
```bash
vercel
```

Then add environment variables in Vercel dashboard.

---

**Full details**: See [SETUP.md](./SETUP.md) for complete instructions.


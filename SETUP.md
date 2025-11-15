# Recipe Roulette - Setup Guide

This guide will walk you through getting Recipe Roulette up and running step by step.

## Prerequisites

- Node.js (v18 or higher) - [Download here](https://nodejs.org/)
- npm (comes with Node.js)
- A Supabase account (free) - [Sign up here](https://supabase.com)
- A Vercel account (free) - [Sign up here](https://vercel.com)
- Git (for version control)

## Step 1: Install Dependencies

1. Open your terminal and navigate to the project directory:
   ```bash
   cd /Users/eyohahenoke/Documents/INST377/Project/recipe-roulette
   ```

2. Install all required packages:
   ```bash
   npm install
   ```

   This will install:
   - `@supabase/supabase-js` - For database operations
   - `chart.js` - For data visualization
   - `animate.css` - For animations

## Step 2: Set Up Supabase Database

### 2.1 Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Fill in:
   - **Name**: `recipe-roulette` (or any name you prefer)
   - **Database Password**: Choose a strong password (save it!)
   - **Region**: Choose closest to you
4. Click "Create new project" (takes 1-2 minutes)

### 2.2 Create Database Tables

1. In your Supabase project, go to **SQL Editor** (left sidebar)
2. Click "New query"
3. Copy and paste this SQL code:

```sql
-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  role TEXT DEFAULT 'user'
);

-- Create favorites table
CREATE TABLE IF NOT EXISTS favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  meal_id TEXT NOT NULL,
  meal_name TEXT NOT NULL,
  meal_thumb TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, meal_id)
);

-- Create history table (optional, for future use)
CREATE TABLE IF NOT EXISTS history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  meal_id TEXT NOT NULL,
  meal_name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

4. Click "Run" (or press Cmd/Ctrl + Enter)
5. You should see "Success. No rows returned"

### 2.3 Set Up Row Level Security (RLS)

1. Still in SQL Editor, run this to enable RLS:

```sql
-- Enable RLS on favorites
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

-- Enable RLS on history
ALTER TABLE history ENABLE ROW LEVEL SECURITY;

-- Create policies for favorites
CREATE POLICY "Users can view own favorites" ON favorites
  FOR SELECT USING (true);  -- For now, allow all (you can restrict later with auth.uid() = user_id)

CREATE POLICY "Users can insert own favorites" ON favorites
  FOR INSERT WITH CHECK (true);  -- For now, allow all

CREATE POLICY "Users can delete own favorites" ON favorites
  FOR DELETE USING (true);  -- For now, allow all
```

2. Click "Run"

### 2.4 Get Your Supabase Credentials

1. In Supabase, go to **Settings** (gear icon) → **API**
2. You'll see:
   - **Project URL** (something like `https://xxxxx.supabase.co`)
   - **anon public** key (a long string starting with `eyJ...`)
3. **Copy both of these** - you'll need them in the next step

## Step 3: Configure Environment Variables

### 3.1 For Local Development

1. In your project root, create a file named `.env`:
   ```bash
   touch .env
   ```

2. Open `.env` and add:
   ```
   SUPABASE_URL=your_project_url_here
   SUPABASE_ANON_KEY=your_anon_key_here
   ```

3. Replace the placeholders with your actual Supabase credentials from Step 2.4

**Example:**
```
SUPABASE_URL=https://abcdefghijklmnop.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTY0MjE5MjEyMCwiZXhwIjoxOTU3NzY4MTIwfQ.example
```

### 3.2 Important: Add .env to .gitignore

1. Create or edit `.gitignore` file:
   ```bash
   echo ".env" >> .gitignore
   echo "node_modules/" >> .gitignore
   ```

   This prevents accidentally committing your secrets to GitHub!

## Step 4: Run Locally

1. Start the development server:
   ```bash
   npm run dev
   ```

2. You should see output like:
   ```
   Vercel CLI 32.x.x
   > Ready! Available at http://localhost:3000
   ```

3. Open your browser and go to: **http://localhost:3000**

4. You should see the Recipe Roulette homepage!

### Testing the Application

1. **Test Spin (no filters)**:
   - Click the "SPIN" button
   - You should see a random recipe appear

2. **Test Filters**:
   - Type "chicken" in the Ingredient field
   - Click "SPIN"
   - You should get a chicken recipe

3. **Test Favorites**:
   - After spinning, click "♥ Save" on a recipe
   - Go to "Favorites" page
   - You should see your saved recipe

## Step 5: Deploy to Vercel

### 5.1 Install Vercel CLI (if not already installed)

```bash
npm install -g vercel
```

### 5.2 Deploy

1. From your project directory, run:
   ```bash
   vercel
   ```

2. Follow the prompts:
   - **Set up and deploy?** → Yes
   - **Which scope?** → Your account
   - **Link to existing project?** → No
   - **Project name?** → `recipe-roulette` (or press Enter)
   - **Directory?** → `./` (press Enter)
   - **Override settings?** → No

3. After deployment, Vercel will give you a URL like `https://recipe-roulette.vercel.app`

### 5.3 Add Environment Variables to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click on your project
3. Go to **Settings** → **Environment Variables**
4. Add two variables:
   - **Name**: `SUPABASE_URL`, **Value**: (your Supabase URL)
   - **Name**: `SUPABASE_ANON_KEY`, **Value**: (your Supabase anon key)
5. Click "Save"
6. **Important**: Redeploy your project for changes to take effect:
   - Go to **Deployments** tab
   - Click the three dots (⋯) on the latest deployment
   - Click "Redeploy"

## Troubleshooting

### Problem: "Failed to fetch lists" or "Spin failed"

**Solution**: 
- Check that your Vercel serverless functions are working
- Make sure you're running `npm run dev` (not just opening the HTML file)
- Check browser console for errors

### Problem: "Failed to save favorite" or favorites not showing

**Solution**:
- Verify Supabase credentials in `.env` (local) or Vercel environment variables (production)
- Check that you created the database tables (Step 2.2)
- Check Supabase dashboard → Table Editor → `favorites` table to see if data is being inserted
- Make sure RLS policies are set up (Step 2.3)

### Problem: Chart.js not showing on About page

**Solution**:
- Check browser console for errors
- Verify internet connection (Chart.js loads from CDN)
- Make sure you're viewing `/about.html` page

### Problem: Animations not working

**Solution**:
- Animate.css loads from CDN, check internet connection
- Check browser console for any CSS errors

### Problem: "Missing Supabase environment variables"

**Solution**:
- For local: Make sure `.env` file exists and has correct values
- For Vercel: Make sure environment variables are set in Vercel dashboard
- Restart your dev server after creating `.env`

## Quick Start Checklist

- [ ] Installed dependencies (`npm install`)
- [ ] Created Supabase project
- [ ] Created database tables (SQL Editor)
- [ ] Set up RLS policies
- [ ] Got Supabase URL and anon key
- [ ] Created `.env` file with credentials
- [ ] Added `.env` to `.gitignore`
- [ ] Tested locally (`npm run dev`)
- [ ] Deployed to Vercel
- [ ] Added environment variables to Vercel
- [ ] Redeployed on Vercel

## Next Steps

Once everything is working:

1. **Test all features**:
   - Spin with different filters
   - Save favorites
   - View favorites page
   - Check About page chart

2. **Optional Enhancements**:
   - Add user authentication (Supabase Auth)
   - Implement user-specific favorites (using auth.uid())
   - Add recipe history tracking
   - Improve error messages

3. **Share your project**:
   - Make GitHub repo public
   - Share Vercel deployment URL
   - Update README with live link

## Need Help?

- Check the main README.md for API documentation
- Review Supabase docs: https://supabase.com/docs
- Review Vercel docs: https://vercel.com/docs


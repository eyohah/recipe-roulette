# Deploy to Vercel - Step by Step Guide

## Step 1: Create GitHub Repository

1. Go to [GitHub.com](https://github.com) and sign in
2. Click the **+** icon in the top right → **New repository**
3. Fill in:
   - **Repository name**: `recipe-roulette` (or any name you prefer)
   - **Description**: "Recipe Roulette - INST 377 Project"
   - **Visibility**: Choose **Public** (required for free Vercel)
   - **DO NOT** initialize with README, .gitignore, or license (we already have these)
4. Click **Create repository**

## Step 2: Push Code to GitHub

After creating the repo, GitHub will show you commands. Run these in your terminal:

```bash
cd /Users/eyohahenoke/Documents/INST377/Project/recipe-roulette

# Add GitHub remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/recipe-roulette.git

# Push to GitHub
git branch -M main
git push -u origin main
```

**Note**: You'll need to authenticate with GitHub. You can:
- Use a Personal Access Token (recommended)
- Or use GitHub CLI: `gh auth login`

## Step 3: Connect to Vercel

### Option A: Via Vercel Dashboard (Easiest)

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **Add New...** → **Project**
3. Click **Import Git Repository**
4. Find and select your `recipe-roulette` repository
5. Click **Import**

### Option B: Via Vercel CLI

```bash
cd /Users/eyohahenoke/Documents/INST377/Project/recipe-roulette
vercel
```

Follow the prompts:
- Link to existing project? → **No** (first time)
- Project name? → `recipe-roulette` (or press Enter)
- Directory? → `./` (press Enter)
- Override settings? → **No**

## Step 4: Configure Environment Variables in Vercel

1. In Vercel Dashboard → Your Project → **Settings** → **Environment Variables**
2. Add these two variables:

   **Variable 1:**
   - Name: `SUPABASE_URL`
   - Value: (your Supabase project URL)
   - Environment: Select **Production**, **Preview**, and **Development**

   **Variable 2:**
   - Name: `SUPABASE_ANON_KEY`
   - Value: (your Supabase anon key)
   - Environment: Select **Production**, **Preview**, and **Development**

3. Click **Save**

## Step 5: Deploy

1. Go to **Deployments** tab
2. If you just added environment variables, click the three dots (⋯) on the latest deployment
3. Click **Redeploy**
4. Wait for deployment to complete (usually 1-2 minutes)

## Step 6: Test Your Deployment

1. Click on the deployment URL (e.g., `https://recipe-roulette.vercel.app`)
2. Test the app:
   - Click "SPIN" button → Should show a recipe
   - Try filters (ingredient, category, area)
   - Save a favorite → Should work with Supabase
   - Go to Favorites page → Should show saved recipes

## Troubleshooting

### API Routes Not Working
- Check Vercel function logs: **Deployments** → Click deployment → **Functions** tab
- Verify environment variables are set correctly
- Make sure Supabase tables are created

### Favorites Not Saving
- Check Supabase dashboard → Table Editor → `favorites` table
- Verify RLS policies are set correctly
- Check browser console for errors

### Build Errors
- Check **Deployments** → Click failed deployment → View logs
- Make sure `package.json` is correct
- Verify all files are committed to GitHub

## Next Steps

- Share your Vercel URL with your team/class
- Update README.md with your live URL
- Continue developing - Vercel auto-deploys on every push to main branch!


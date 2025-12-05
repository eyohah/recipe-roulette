# Recipe Roulette

**INST 377 Final Project**  
**Group Members**: Eyoha Henoke, Hawareyawe Ketema

## Project Description

Recipe Roulette is a web application that solves the "choice overload" problem when deciding what to cook. Instead of endlessly scrolling through recipes, users can click a single "SPIN" button to get a complete, cookable recipe instantly. The application supports optional filters by ingredient, category (e.g., Dessert, Seafood), or cuisine area (e.g., Italian, Mexican) to help users find recipes they can make with ingredients they already have.

### Key Features

- **One-Click Recipe Discovery**: Spin for instant recipe suggestions
- **Smart Filtering**: Filter by ingredient, category, or cuisine area
- **User Authentication**: Secure login/signup with Supabase Auth
- **Personal Favorites**: Save and manage favorite recipes (requires login)
- **Recipe Details**: Complete ingredient lists, step-by-step instructions, and video links
- **Clickable Favorites**: Click on any favorite meal to view full recipe details
- **Responsive Design**: Works seamlessly on desktop and mobile devices

### Technology Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript (ES6 modules)
- **Backend**: Vercel Serverless Functions (Node.js)
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **External API**: TheMealDB (recipe data)
- **Libraries**: Chart.js (data visualization), Animate.css (animations)
- **Deployment**: Vercel

## Target Browsers

Recipe Roulette is designed to work on all contemporary desktop and mobile browsers:

- **Desktop**: Chrome (latest), Firefox (latest), Safari (latest), Edge (latest)
- **Mobile**: iOS Safari (iOS 14+), Chrome Mobile (Android 8+)
- **Responsive Design**: Mobile-first responsive design that adapts to various screen sizes

The application uses modern web standards (ES6 modules, Fetch API, CSS Grid) and should work on any browser that supports these features (generally browsers from 2018 onwards).

## Live Demo

https://recipe-roulette-git-main-eyohas-projects.vercel.app

## Developer Manual

See the [Developer Manual](#developer-manual) section below for complete setup and API documentation.

---

# Developer Manual

This manual is designed for developers who will take over or contribute to the Recipe Roulette system. It provides all the technical information needed to set up, run, and extend the application.

## Table of Contents

1. [Installation and Dependencies](#installation-and-dependencies)
2. [Running the Application](#running-the-application)
3. [Testing](#testing)
4. [API Documentation](#api-documentation)
5. [Known Bugs and Limitations](#known-bugs-and-limitations)
6. [Future Development Roadmap](#future-development-roadmap)

---

## Installation and Dependencies

### Prerequisites

Before installing Recipe Roulette, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Git** (for version control)
- **Supabase account** (free) - [Sign up here](https://supabase.com)
- **Vercel account** (free) - [Sign up here](https://vercel.com)

### Step-by-Step Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd recipe-roulette
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```
   
   This installs the following packages:
   - `@supabase/supabase-js` (^2.45.0) - Supabase client library for database operations and authentication
   - `chart.js` (^4.4.0) - Charting library for data visualization on the About page
   - `animate.css` (^4.1.1) - CSS animation library for UI enhancements

3. **Set up Supabase Database**
   
   a. Create a new Supabase project at [https://supabase.com](https://supabase.com)
   
   b. In the SQL Editor, create the `favorites` table:
   ```sql
   CREATE TABLE favorites (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
     meal_id TEXT NOT NULL,
     meal_name TEXT NOT NULL,
     meal_thumb TEXT,
     created_at TIMESTAMPTZ DEFAULT NOW(),
     UNIQUE(user_id, meal_id)
   );
   ```
   
   c. Enable Row Level Security (RLS) and create policies:
   ```sql
   -- Enable RLS
   ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
   
   -- Allow users to read their own favorites
   CREATE POLICY "Users can view own favorites" ON favorites
     FOR SELECT USING (auth.uid() = user_id);
   
   -- Allow users to insert their own favorites
   CREATE POLICY "Users can insert own favorites" ON favorites
     FOR INSERT WITH CHECK (auth.uid() = user_id);
   
   -- Allow users to delete their own favorites
   CREATE POLICY "Users can delete own favorites" ON favorites
     FOR DELETE USING (auth.uid() = user_id);
   ```
   
   d. Enable Email authentication in Authentication → Providers

4. **Configure environment variables**
   
   For local development, create a `.env` file in the project root:
   ```
   SUPABASE_URL=your_supabase_project_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   ```
   
   **Important**: Add `.env` to `.gitignore` to prevent committing secrets.
   
   For production deployment on Vercel, add these as environment variables in the Vercel dashboard (Settings → Environment Variables).

---

## Running the Application

### Local Development

1. **Start the development server**
   ```bash
   npm run dev
   ```
   
   This starts a local HTTP server on port 3000 using Python's built-in server.

   **Alternative**: For full Vercel serverless function support locally:
   ```bash
   npm run vercel:dev
   ```
   This uses Vercel CLI to run the full application with serverless functions.

2. **Access the application**
   - Open your browser and navigate to `http://localhost:3000`
   - You will be redirected to the login page if not authenticated
   - Sign up or sign in to access the full application

### Production Deployment

1. **Deploy to Vercel**
   ```bash
   vercel
   ```
   
   Or connect your GitHub repository to Vercel for automatic deployments on every push.

2. **Configure environment variables in Vercel**
   - Go to your project settings in Vercel Dashboard
   - Navigate to Settings → Environment Variables
   - Add:
     - `SUPABASE_URL` = your Supabase project URL
     - `SUPABASE_ANON_KEY` = your Supabase anon key
   - **Important**: Redeploy after adding environment variables for changes to take effect

3. **Verify deployment**
   - Check the deployment URL provided by Vercel
   - Test all features: spin, favorites, authentication

---

## Testing

Currently, Recipe Roulette does not include automated test suites. Manual testing is recommended:

### Manual Testing Checklist

1. **Authentication**
   - [ ] Sign up with new email
   - [ ] Sign in with existing credentials
   - [ ] Sign out functionality
   - [ ] Protected routes redirect to login

2. **Recipe Spinning**
   - [ ] Spin without filters (random recipe)
   - [ ] Spin with ingredient filter
   - [ ] Spin with category filter
   - [ ] Spin with area filter
   - [ ] Verify recipe details display correctly

3. **Favorites**
   - [ ] Save a recipe to favorites
   - [ ] View favorites page
   - [ ] Click on favorite to view details
   - [ ] Remove favorite
   - [ ] Verify favorites are user-specific

4. **UI/UX**
   - [ ] Responsive design on mobile
   - [ ] Animations work correctly
   - [ ] Navigation between pages
   - [ ] Error messages display appropriately

### Future Testing Recommendations

- Add unit tests for instruction cleaning functions
- Add integration tests for API endpoints
- Add end-to-end tests with Playwright or Cypress
- Add tests for authentication flows

---

## API Documentation

All API endpoints are serverless functions located in the `/api` directory. They run on Vercel's serverless infrastructure.

### Base URL

- **Local**: `http://localhost:3000/api`
- **Production**: `https://your-vercel-url.vercel.app/api`

### Authentication

Most endpoints require authentication via Supabase JWT tokens. Include the token in the Authorization header:
```
Authorization: Bearer {supabase_jwt_token}
```

The token is obtained from Supabase Auth after successful login and is automatically included by the frontend.

---

### GET `/api/config`

Retrieves Supabase configuration for the frontend. This endpoint safely exposes only the public anon key.

**Request:**
```
GET /api/config
```

**Response:**
```json
{
  "SUPABASE_URL": "https://xxxxx.supabase.co",
  "SUPABASE_ANON_KEY": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Status Codes:**
- `200`: Success
- `500`: Server error (missing environment variables)

**Notes:**
- No authentication required
- Returns public configuration only
- Used by frontend to initialize Supabase client

---

### GET `/api/lists`

Retrieves lists of available categories and cuisine areas from TheMealDB API.

**Request:**
```
GET /api/lists
```

**Response:**
```json
{
  "categories": ["Beef", "Chicken", "Dessert", "Lamb", "Miscellaneous", "Pasta", "Pork", "Seafood", "Side", "Starter", "Vegan", "Vegetarian"],
  "areas": ["American", "British", "Canadian", "Chinese", "Croatian", "Dutch", "Egyptian", "Filipino", "French", "Greek", "Indian", "Irish", "Italian", "Jamaican", "Japanese", "Kenyan", "Malaysian", "Mexican", "Moroccan", "Polish", "Portuguese", "Russian", "Spanish", "Thai", "Tunisian", "Turkish", "Unknown", "Vietnamese"]
}
```

**Status Codes:**
- `200`: Success
- `500`: Server error (TheMealDB API unavailable)

**Notes:**
- No authentication required
- Data is fetched from TheMealDB API
- Used to populate filter dropdowns

---

### GET `/api/spin`

Retrieves a random recipe from TheMealDB API, optionally filtered by ingredient, category, or area.

**Request:**
```
GET /api/spin?area=Italian&category=Dessert&include=chicken
```

**Query Parameters:**
- `area` (optional): Cuisine area (e.g., "Italian", "Mexican")
- `category` (optional): Recipe category (e.g., "Dessert", "Seafood")
- `include` (optional): Ingredient name (e.g., "chicken", "tomato")

**Note**: Only one filter type is applied at a time (priority: include > category > area).

**Response:**
```json
{
  "id": "52772",
  "name": "Teriyaki Chicken Casserole",
  "category": "Chicken",
  "area": "Japanese",
  "thumb": "https://www.themealdb.com/images/media/meals/wvpsxx1468259621.jpg",
  "youtubeUrl": "https://www.youtube.com/watch?v=4aZr5hZXP_s",
  "sourceUrl": "https://www.delish.com/cooking/recipe-ideas/recipes/a46538/teriyaki-chicken-casserole-recipe/",
  "tags": ["Meat", "Casserole"],
  "ingredients": [
    { "name": "soy sauce", "measure": "3/4 cup" },
    { "name": "water", "measure": "1/2 cup" },
    { "name": "brown sugar", "measure": "1/4 cup" }
  ],
  "instructions": [
    "Preheat oven to 350° F.",
    "Mix soy sauce, water, and brown sugar in a bowl.",
    "Place chicken in a baking dish and pour sauce over it.",
    "Bake for 45 minutes or until chicken is cooked through."
  ]
}
```

**Status Codes:**
- `200`: Success
- `404`: No meals found matching filters
- `500`: Server error

**Notes:**
- No authentication required
- Instructions are automatically cleaned (checkboxes and redundant labels removed)
- If no filters provided, returns completely random recipe

---

### GET `/api/meal`

Retrieves detailed information for a specific meal by its ID.

**Request:**
```
GET /api/meal?id=52772
```

**Query Parameters:**
- `id` (required): TheMealDB meal ID (e.g., "52772")

**Response:**
```json
{
  "id": "52772",
  "name": "Teriyaki Chicken Casserole",
  "category": "Chicken",
  "area": "Japanese",
  "thumb": "https://www.themealdb.com/images/media/meals/wvpsxx1468259621.jpg",
  "youtubeUrl": "https://www.youtube.com/watch?v=4aZr5hZXP_s",
  "sourceUrl": "https://www.delish.com/cooking/recipe-ideas/recipes/a46538/teriyaki-chicken-casserole-recipe/",
  "tags": ["Meat", "Casserole"],
  "ingredients": [
    { "name": "soy sauce", "measure": "3/4 cup" },
    { "name": "water", "measure": "1/2 cup" }
  ],
  "instructions": [
    "Preheat oven to 350° F.",
    "Mix soy sauce, water, and brown sugar in a bowl."
  ]
}
```

**Status Codes:**
- `200`: Success
- `400`: Bad request (missing meal ID)
- `404`: Meal not found
- `500`: Server error

**Notes:**
- No authentication required
- Used when clicking on favorites to view full recipe details
- Instructions are automatically cleaned

---

### GET `/api/favorites`

Retrieves all favorite recipes for the authenticated user.

**Request:**
```
GET /api/favorites
Authorization: Bearer {supabase_jwt_token}
```

**Response:**
```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "user_id": "123e4567-e89b-12d3-a456-426614174000",
    "meal_id": "52772",
    "meal_name": "Teriyaki Chicken Casserole",
    "meal_thumb": "https://www.themealdb.com/images/media/meals/wvpsxx1468259621.jpg",
    "created_at": "2024-01-15T10:30:00Z"
  },
  {
    "id": "660e8400-e29b-41d4-a716-446655440001",
    "user_id": "123e4567-e89b-12d3-a456-426614174000",
    "meal_id": "52773",
    "meal_name": "Chicken Curry",
    "meal_thumb": "https://www.themealdb.com/images/media/meals/...",
    "created_at": "2024-01-14T08:15:00Z"
  }
]
```

**Status Codes:**
- `200`: Success (returns empty array if no favorites)
- `401`: Unauthorized (missing or invalid token)
- `500`: Server error

**Notes:**
- Requires authentication
- Returns only favorites for the authenticated user
- Results are ordered by `created_at` descending (newest first)

---

### POST `/api/favorites`

Saves a recipe to the user's favorites.

**Request:**
```
POST /api/favorites
Content-Type: application/json
Authorization: Bearer {supabase_jwt_token}
```

**Body:**
```json
{
  "meal_id": "52772",
  "meal_name": "Teriyaki Chicken Casserole",
  "meal_thumb": "https://www.themealdb.com/images/media/meals/wvpsxx1468259621.jpg"
}
```

**Required Fields:**
- `meal_id` (string): TheMealDB meal ID
- `meal_name` (string): Name of the meal
- `meal_thumb` (string, optional): URL to meal thumbnail image

**Response:**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "user_id": "123e4567-e89b-12d3-a456-426614174000",
  "meal_id": "52772",
  "meal_name": "Teriyaki Chicken Casserole",
  "meal_thumb": "https://www.themealdb.com/images/media/meals/wvpsxx1468259621.jpg",
  "created_at": "2024-01-15T10:30:00Z"
}
```

**Status Codes:**
- `201`: Created successfully
- `400`: Bad request (missing required fields)
- `401`: Unauthorized
- `409`: Conflict (favorite already exists for this user)
- `500`: Server error

**Notes:**
- Requires authentication
- Duplicate favorites are prevented (unique constraint on user_id + meal_id)
- User ID is automatically extracted from JWT token

---

### DELETE `/api/favorites`

Removes a favorite recipe from the user's favorites list.

**Request:**
```
DELETE /api/favorites?meal_id=52772
Authorization: Bearer {supabase_jwt_token}
```

**Query Parameters:**
- `meal_id` (required): TheMealDB meal ID to remove

**Response:**
```json
{
  "success": true,
  "message": "Favorite removed"
}
```

**Status Codes:**
- `200`: Success
- `400`: Bad request (missing meal_id)
- `401`: Unauthorized
- `404`: Favorite not found (or doesn't belong to user)
- `500`: Server error

**Notes:**
- Requires authentication
- Only removes favorites belonging to the authenticated user
- Safe to call even if favorite doesn't exist (returns 200)

---

## Known Bugs and Limitations

### Current Limitations

1. **Filter Priority System**
   - Only one filter type is applied at a time (ingredient > category > area)
   - Users cannot combine multiple filter types simultaneously
   - **Impact**: Users must choose between filtering by ingredient, category, or area
   - **Workaround**: Users can spin multiple times with different filters

2. **No Error Recovery**
   - If TheMealDB API is unavailable, the application shows a generic error message
   - No automatic retry logic
   - **Impact**: Users see unhelpful error messages during API outages
   - **Workaround**: Manual page refresh

3. **Limited Ingredient Search**
   - The ingredient filter uses exact matching against TheMealDB's ingredient list
   - May miss recipes with similar ingredients or alternative names
   - **Impact**: Some valid ingredient searches return no results
   - **Example**: Searching "chicken breast" might not match recipes with "chicken"

4. **No Pagination**
   - The favorites page displays all favorites without pagination
   - **Impact**: Could be slow with many saved recipes (100+)
   - **Workaround**: Users can delete old favorites

5. **No Recipe History**
   - Application doesn't track previously viewed recipes
   - **Impact**: Users can't easily revisit recipes they've seen before
   - **Workaround**: Users must save favorites to keep track

6. **Instruction Cleaning Edge Cases**
   - Some recipes may have unusual formatting that isn't perfectly cleaned
   - Very long instructions might not merge correctly
   - **Impact**: Occasional formatting issues in recipe instructions

### Known Bugs

1. **Race Condition in Auth Initialization**
   - **Description**: On favorites page, there's a timing issue where favorites may load before auth is fully initialized
   - **Impact**: Occasional "Failed to load favorites" errors on first page load
   - **Status**: Mitigated with setTimeout delays, but not fully resolved
   - **Severity**: Low (rare occurrence)

2. **Missing Error Messages**
   - **Description**: Some API errors don't provide user-friendly messages
   - **Impact**: Users see technical error messages
   - **Status**: Partial fix implemented
   - **Severity**: Medium

3. **Mobile Viewport Issues**
   - **Description**: Some pages may have minor layout issues on very small screens (< 320px)
   - **Impact**: Poor user experience on older/smaller devices
   - **Status**: Not fully tested on all devices
   - **Severity**: Low

---

## Future Development Roadmap

### Short-Term Enhancements (Next 1-2 Months)

1. **Multiple Filter Support**
   - Allow users to combine ingredient, category, and area filters
   - Implement filter UI improvements (checkboxes, multi-select)
   - **Priority**: High
   - **Effort**: Medium

2. **Improved Error Handling**
   - Add retry logic for failed API calls
   - Implement user-friendly error messages
   - Add error logging/monitoring
   - **Priority**: High
   - **Effort**: Medium

3. **Recipe History Tracking**
   - Track recently viewed recipes
   - Add "Recently Viewed" section
   - Store in Supabase `history` table (already created)
   - **Priority**: Medium
   - **Effort**: Low

4. **Enhanced Ingredient Search**
   - Implement fuzzy matching for ingredients
   - Add ingredient suggestions/autocomplete
   - **Priority**: Medium
   - **Effort**: High

### Medium-Term Enhancements (3-6 Months)

5. **Dietary Restriction Filters**
   - Add filters for vegetarian, vegan, gluten-free, etc.
   - Integrate with TheMealDB tags or implement custom filtering
   - **Priority**: Medium
   - **Effort**: Medium

6. **Recipe Sharing**
   - Generate shareable links for recipes
   - Social media sharing buttons
   - **Priority**: Low
   - **Effort**: Low

7. **Favorites Pagination**
   - Implement pagination or infinite scroll
   - Add search/filter within favorites
   - **Priority**: Medium
   - **Effort**: Medium

8. **User Profiles**
   - Allow users to customize profiles
   - Recipe preferences and dietary restrictions
   - **Priority**: Low
   - **Effort**: High

### Long-Term Enhancements (6+ Months)

9. **Mobile App Development**
   - Native iOS and Android apps
   - Push notifications for recipe suggestions
   - **Priority**: Low
   - **Effort**: Very High

10. **Recipe Collections**
    - Allow users to create custom recipe collections
    - Share collections with other users
    - **Priority**: Low
    - **Effort**: High

11. **Meal Planning**
    - Weekly meal planning feature
    - Shopping list generation
    - **Priority**: Low
    - **Effort**: Very High

12. **Recipe Ratings and Reviews**
    - Allow users to rate recipes
    - Add review/comment system
    - **Priority**: Low
    - **Effort**: High

### Technical Improvements

- **Testing**: Add comprehensive test suite (unit, integration, E2E)
- **Performance**: Optimize API calls, implement caching
- **Accessibility**: Improve ARIA labels, keyboard navigation
- **SEO**: Add meta tags, improve page titles
- **Analytics**: Implement usage tracking and analytics

---

## Additional Resources

- **Supabase Documentation**: https://supabase.com/docs
- **Vercel Documentation**: https://vercel.com/docs
- **TheMealDB API**: https://www.themealdb.com/api.php
- **Project Setup Guide**: See `SETUP.md` for detailed setup instructions
- **Quick Start Guide**: See `QUICKSTART.md` for rapid setup

---

## Support and Contribution

For questions or issues, please refer to:
- Project repository issues
- INST 377 course materials
- Documentation files in the project root

---

**Last Updated**: December 1st 2025  
**Version**: 1.0.0

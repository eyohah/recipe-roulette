# Recipe Roulette

## Description

Recipe Roulette is a web application that solves the "choice overload" problem when deciding what to cook. Instead of endlessly scrolling through recipes, users can click a single "SPIN" button to get a complete, cookable recipe instantly. The application supports optional filters by ingredient, category (e.g., Dessert, Seafood), or cuisine area (e.g., Italian, Mexican) to help users find recipes they can make with ingredients they already have.

The application fetches recipe data from TheMealDB API, normalizes it into a consistent format, and allows users to save their favorite recipes to a Supabase database. Each recipe includes a high-quality image, complete ingredient list with measurements, step-by-step instructions, tags, and links to source and YouTube videos when available.

## Target Browsers

Recipe Roulette is designed to work on all contemporary desktop and mobile browsers:

- **Desktop**: Chrome (latest), Firefox (latest), Safari (latest), Edge (latest)
- **Mobile**: iOS Safari (iOS 14+), Chrome Mobile (Android 8+)
- **Responsive Design**: The application uses a mobile-first responsive design that adapts to various screen sizes

The application uses modern web standards (ES6 modules, Fetch API, CSS Grid) and should work on any browser that supports these features (generally browsers from 2018 onwards).

## Link to Developer Manual

See the [Developer Manual](#developer-manual) section below.

---

# Developer Manual

## Installation

### Prerequisites

- Node.js (v18 or higher)
- npm (comes with Node.js)
- A Supabase account and project
- A Vercel account (for deployment)

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd recipe-roulette
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Supabase**
   - Create a new Supabase project at https://supabase.com
   - In your Supabase project, create the following tables:

   **Table: `profiles`**
   ```sql
   CREATE TABLE profiles (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     email TEXT UNIQUE NOT NULL,
     created_at TIMESTAMPTZ DEFAULT NOW(),
     role TEXT DEFAULT 'user'
   );
   ```

   **Table: `favorites`**
   ```sql
   CREATE TABLE favorites (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
     meal_id TEXT NOT NULL,
     meal_name TEXT NOT NULL,
     meal_thumb TEXT,
     created_at TIMESTAMPTZ DEFAULT NOW(),
     UNIQUE(user_id, meal_id)
   );
   ```

   **Table: `history`** (optional, for future use)
   ```sql
   CREATE TABLE history (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
     meal_id TEXT NOT NULL,
     meal_name TEXT NOT NULL,
     created_at TIMESTAMPTZ DEFAULT NOW()
   );
   ```

   - Enable Row Level Security (RLS) on `favorites` and `history` tables
   - Create RLS policies:
     ```sql
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

4. **Configure environment variables**
   - Create a `.env` file in the project root (for local development)
   - Add your Supabase credentials:
     ```
     SUPABASE_URL=your_supabase_project_url
     SUPABASE_ANON_KEY=your_supabase_anon_key
     ```
   - For Vercel deployment, add these as environment variables in the Vercel dashboard

## Running the Application

### Local Development

1. **Start the Vercel development server**
   ```bash
   npm run dev
   ```

2. **Open your browser**
   - Navigate to `http://localhost:3000`
   - The application should load with the home page

### Production Deployment

1. **Deploy to Vercel**
   ```bash
   vercel
   ```
   Or connect your GitHub repository to Vercel for automatic deployments.

2. **Set environment variables in Vercel**
   - Go to your project settings in Vercel
   - Add `SUPABASE_URL` and `SUPABASE_ANON_KEY` as environment variables

## Testing

Currently, the project does not include automated test suites. Manual testing should be performed for:

- **Spin functionality**: Test with no filters, with ingredient filter, with category filter, with area filter
- **Favorites**: Test saving favorites, viewing favorites page, removing favorites
- **API endpoints**: Test all endpoints return expected data formats
- **Error handling**: Test behavior when API calls fail or return no results

### Future Testing Roadmap

- Unit tests for API normalization functions
- Integration tests for API endpoints
- E2E tests for user workflows

## API Documentation

All API endpoints are serverless functions located in the `/api` directory and are accessible at `/api/{endpoint-name}`.

### GET `/api/lists`

Retrieves lists of available categories and cuisine areas from TheMealDB API.

**Request:**
```
GET /api/lists
```

**Response:**
```json
{
  "categories": ["Beef", "Chicken", "Dessert", ...],
  "areas": ["American", "British", "Canadian", "Chinese", ...]
}
```

**Status Codes:**
- `200`: Success
- `500`: Server error

---

### GET `/api/spin`

Retrieves a random recipe from TheMealDB API, optionally filtered by ingredient, category, or area. If filters are provided, it fetches matching recipes and randomly selects one, then retrieves the full recipe details.

**Request:**
```
GET /api/spin?area=Italian&category=Dessert&include=chicken
```

**Query Parameters:**
- `area` (optional): Cuisine area (e.g., "Italian", "Mexican")
- `category` (optional): Recipe category (e.g., "Dessert", "Seafood")
- `include` (optional): Ingredient name (e.g., "chicken", "tomato")

**Note:** Only one filter type is used at a time, with priority: `include` > `category` > `area`

**Response:**
```json
{
  "id": "52772",
  "name": "Teriyaki Chicken Casserole",
  "category": "Chicken",
  "area": "Japanese",
  "thumb": "https://www.themealdb.com/images/media/meals/wvpsxx1468256321.jpg",
  "youtubeUrl": "https://www.youtube.com/watch?v=4aZr5hZXP_s",
  "sourceUrl": "https://www.delish.com/cooking/recipe-ideas/recipes/a53823/easy-chicken-and-broccoli-casserole-recipe/",
  "tags": ["Meat", "Casserole"],
  "ingredients": [
    { "name": "soy sauce", "measure": "3/4 cup" },
    { "name": "water", "measure": "1/2 cup" },
    ...
  ],
  "instructions": [
    "Preheat oven to 350° F.",
    "Spray a 9x13-inch glass baking dish with cooking spray.",
    ...
  ]
}
```

**Status Codes:**
- `200`: Success
- `404`: No meals found matching filters
- `500`: Server error

---

### GET `/api/favorites`

Retrieves all favorite recipes for the authenticated user from Supabase.

**Request:**
```
GET /api/favorites
```

**Headers:**
- `Authorization: Bearer {supabase_jwt_token}` (required)

**Response:**
```json
[
  {
    "id": "uuid",
    "user_id": "uuid",
    "meal_id": "52772",
    "meal_name": "Teriyaki Chicken Casserole",
    "meal_thumb": "https://www.themealdb.com/images/media/meals/...",
    "created_at": "2024-01-15T10:30:00Z"
  },
  ...
]
```

**Status Codes:**
- `200`: Success
- `401`: Unauthorized (missing or invalid token)
- `500`: Server error

---

### POST `/api/favorites`

Saves a recipe to the user's favorites in Supabase.

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
  "meal_thumb": "https://www.themealdb.com/images/media/meals/..."
}
```

**Response:**
```json
{
  "id": "uuid",
  "user_id": "uuid",
  "meal_id": "52772",
  "meal_name": "Teriyaki Chicken Casserole",
  "meal_thumb": "https://www.themealdb.com/images/media/meals/...",
  "created_at": "2024-01-15T10:30:00Z"
}
```

**Status Codes:**
- `201`: Created successfully
- `400`: Bad request (missing required fields)
- `401`: Unauthorized
- `409`: Conflict (favorite already exists)
- `500`: Server error

---

### DELETE `/api/favorites/:meal_id`

Removes a favorite recipe from the user's favorites list.

**Request:**
```
DELETE /api/favorites/52772
Authorization: Bearer {supabase_jwt_token}
```

**Response:**
```json
{
  "success": true,
  "message": "Favorite removed"
}
```

**Status Codes:**
- `200`: Success
- `401`: Unauthorized
- `404`: Favorite not found
- `500`: Server error

---

## Known Bugs and Limitations

### Current Issues

1. **No User Authentication**: The current implementation does not include user authentication. Favorites are stored per session using localStorage as a fallback. To use Supabase favorites, authentication must be implemented.

2. **Filter Priority**: Only one filter type is applied at a time (ingredient > category > area). Users cannot combine multiple filter types simultaneously.

3. **No Error Recovery**: If TheMealDB API is unavailable, the application shows a generic error message without retry logic.

4. **Limited Ingredient Search**: The ingredient filter uses exact matching, which may miss recipes with similar ingredients or alternative names.

5. **No Pagination**: The favorites page displays all favorites without pagination, which could be slow with many saved recipes.

### Data Limitations

- Recipe data depends on TheMealDB's coverage, which may not include all cuisines or dietary restrictions
- Some recipes may have incomplete ingredient measurements
- YouTube and source links are not available for all recipes

## Roadmap for Future Development

### Short-term (Next Sprint)

1. **User Authentication**
   - Implement Supabase Auth with email/password or magic link
   - Add sign-in/sign-out UI
   - Migrate localStorage favorites to Supabase

2. **Enhanced Filtering**
   - Allow combining multiple filter types
   - Add dietary restriction filters (vegetarian, vegan, gluten-free)
   - Add difficulty level filter

3. **Error Handling Improvements**
   - Add retry logic for failed API calls
   - Implement better error messages with actionable suggestions
   - Add offline mode detection

### Medium-term (Next Quarter)

1. **Recipe History**
   - Implement spin history tracking
   - Add "Recently Viewed" section
   - Show statistics (most spun categories, favorite cuisines)

2. **Social Features**
   - Share recipes via social media
   - Export favorites as a shopping list
   - Print-friendly recipe view

3. **Performance Optimization**
   - Implement caching for frequently accessed recipes
   - Add image lazy loading
   - Optimize bundle size

### Long-term (Future Versions)

1. **Advanced Features**
   - Meal planning calendar
   - Shopping list generation from multiple recipes
   - Recipe recommendations based on user preferences
   - Integration with grocery delivery services

2. **Mobile App**
   - Native iOS/Android apps
   - Push notifications for meal suggestions
   - Offline recipe storage

3. **AI Integration**
   - Smart ingredient substitution suggestions
   - Personalized recipe recommendations
   - Dietary preference learning


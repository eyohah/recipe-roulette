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

### Installation

#### Prerequisites

- Node.js (v18 or higher)
- npm (comes with Node.js)
- A Supabase account and project
- A Vercel account (for deployment)

#### Setup Steps

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
   - Enable Email authentication in Authentication → Providers
   - In SQL Editor, create the following tables:

   **Table: `favorites`**
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

   - Enable Row Level Security (RLS) on `favorites` table
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

### Running the Application

#### Local Development

1. **Start the development server**
   ```bash
   npm run dev
   ```

2. **Open your browser**
   - Navigate to `http://localhost:3000`
   - You will be redirected to login if not authenticated

#### Production Deployment

1. **Deploy to Vercel**
   ```bash
   vercel
   ```
   Or connect your GitHub repository to Vercel for automatic deployments.

2. **Set environment variables in Vercel**
   - Go to your project settings in Vercel
   - Add `SUPABASE_URL` and `SUPABASE_ANON_KEY` as environment variables

## API Documentation

All API endpoints are serverless functions located in the `/api` directory.

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

Retrieves a random recipe from TheMealDB API, optionally filtered by ingredient, category, or area.

**Request:**
```
GET /api/spin?area=Italian&category=Dessert&include=chicken
```

**Query Parameters:**
- `area` (optional): Cuisine area (e.g., "Italian", "Mexican")
- `category` (optional): Recipe category (e.g., "Dessert", "Seafood")
- `include` (optional): Ingredient name (e.g., "chicken", "tomato")

**Response:**
```json
{
  "id": "52772",
  "name": "Teriyaki Chicken Casserole",
  "category": "Chicken",
  "area": "Japanese",
  "thumb": "https://www.themealdb.com/images/media/meals/...",
  "youtubeUrl": "https://www.youtube.com/watch?v=...",
  "sourceUrl": "https://www.delish.com/...",
  "tags": ["Meat", "Casserole"],
  "ingredients": [
    { "name": "soy sauce", "measure": "3/4 cup" },
    ...
  ],
  "instructions": [
    "Preheat oven to 350° F.",
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
    "id": "uuid",
    "user_id": "uuid",
    "meal_id": "52772",
    "meal_name": "Teriyaki Chicken Casserole",
    "meal_thumb": "https://www.themealdb.com/images/media/meals/...",
    "created_at": "2024-01-15T10:30:00Z"
  }
]
```

**Status Codes:**
- `200`: Success
- `401`: Unauthorized (missing or invalid token)
- `500`: Server error

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
DELETE /api/favorites?meal_id=52772
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

## Known Limitations

1. **Filter Priority**: Only one filter type is applied at a time (ingredient > category > area). Users cannot combine multiple filter types simultaneously.

2. **No Error Recovery**: If TheMealDB API is unavailable, the application shows a generic error message without retry logic.

3. **Limited Ingredient Search**: The ingredient filter uses exact matching, which may miss recipes with similar ingredients or alternative names.

4. **No Pagination**: The favorites page displays all favorites without pagination, which could be slow with many saved recipes.

## Future Enhancements

- Allow combining multiple filter types
- Add dietary restriction filters (vegetarian, vegan, gluten-free)
- Implement recipe history tracking
- Add recipe sharing functionality
- Mobile app development

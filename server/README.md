# Movie Site API

This is the backend API for the Movie Site application. It provides endpoints for user authentication, movie search, and user interactions with movies.

## Technologies Used

- Node.js
- Express
- MongoDB
- Mongoose
- JWT Authentication
- IMDB API Integration

## Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/movie-site
   JWT_SECRET=your_jwt_secret_key
   IMDB_API_KEY=your_imdb_api_key
   NODE_ENV=development
   ```

3. Start the server:
   ```
   npm run dev
   ```

## API Endpoints

### Users

- `POST /api/users` - Register a new user
- `POST /api/users/login` - Login user
- `GET /api/users/profile` - Get user profile (protected)
- `PUT /api/users/profile` - Update user profile (protected)
- `POST /api/users/favorites` - Add movie to favorites (protected)
- `DELETE /api/users/favorites/:imdbId` - Remove movie from favorites (protected)
- `POST /api/users/watchlist` - Add movie to watchlist (protected)
- `DELETE /api/users/watchlist/:imdbId` - Remove movie from watchlist (protected)

### Movies

- `GET /api/movies/search` - Search movies by title
- `GET /api/movies/trending` - Get trending movies
- `GET /api/movies/:id` - Get movie details by IMDB ID
- `POST /api/movies/:id/reviews` - Add review to movie (protected) 
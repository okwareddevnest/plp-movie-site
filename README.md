# MovieHub - MERN Stack Movie Site

A full-stack movie information website built with the MERN stack (MongoDB, Express, React, Node.js) that pulls data from the IMDB API. The site features a responsive design using Radix UI and Tailwind CSS.

## Features

- User authentication (register, login, profile management)
- Movie search and browsing
- Detailed movie information
- User favorites and watchlist
- User reviews and ratings
- Responsive design for all device sizes
- Modern UI with Radix UI components and Tailwind CSS

## Tech Stack

### Backend
- Node.js
- Express
- MongoDB with Mongoose
- JWT Authentication
- IMDB API Integration

### Frontend
- React
- React Router
- Radix UI
- Tailwind CSS
- Axios
- React Query

## Project Structure

```
movie-site/
├── server/             # Backend API
│   ├── config/         # Configuration files
│   ├── controllers/    # Route controllers
│   ├── middleware/     # Custom middleware
│   ├── models/         # Mongoose models
│   ├── routes/         # API routes
│   └── index.js        # Entry point
│
└── client/             # Frontend React app
    ├── public/         # Static files
    └── src/            # React source code
        ├── api/        # API service functions
        ├── components/ # Reusable components
        ├── context/    # React context
        ├── hooks/      # Custom hooks
        ├── pages/      # Page components
        └── utils/      # Utility functions
```

## Setup and Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- IMDB API Key

### Backend Setup
1. Navigate to the server directory:
   ```
   cd server
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the server directory with the following variables:
   ```
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/movie-site
   JWT_SECRET=your_jwt_secret_key
   IMDB_API_KEY=your_imdb_api_key
   NODE_ENV=development
   ```

4. Start the server:
   ```
   npm run dev
   ```

### Frontend Setup
1. Navigate to the client directory:
   ```
   cd client
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
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

## License

This project is licensed under the MIT License. 